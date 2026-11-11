<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BorrowingRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BorrowingRequestService
{
    public function getAll(
        int $perPage = 10,
        ?string $search = null
    ): LengthAwarePaginator {
        return BorrowingRequest::query()
            ->with(['user', 'book', 'approver'])
            ->when($search, function ($query, $search) {
                $like = '%' . mb_strtolower($search) . '%';

                $query->where(function ($query) use ($search, $like) {
                    $query->whereHas('user', function ($query) use ($like) {
                        $query->whereRaw('LOWER(name) LIKE ?', [$like])
                            ->orWhereRaw('LOWER(email) LIKE ?', [$like]);
                    })->orWhereHas('book', function ($query) use ($like) {
                        $query->whereRaw('LOWER(title) LIKE ?', [$like])
                            ->orWhereRaw('LOWER(isbn) LIKE ?', [$like]);
                    })->orWhereRaw('LOWER(status) LIKE ?', [$like]);

                    if (ctype_digit($search)) {
                        $query->orWhere('id', (int) $search);
                    }
                });
            })
            ->latest('requested_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getUserRequests(
        int $userId,
        int $perPage = 10
    ): LengthAwarePaginator {
        return BorrowingRequest::query()
            ->with(['book.author', 'book.publisher'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function submit(int $userId, array $data): BorrowingRequest
    {
        return DB::transaction(function () use ($userId, $data) {
            $book = Book::query()
                ->lockForUpdate()
                ->findOrFail($data['book_id']);

            if ($book->available_copies < 1) {
                throw ValidationException::withMessages([
                    'book_id' => 'This book currently has no available copies.',
                ]);
            }

            $existingRequest = BorrowingRequest::query()
                ->where('user_id', $userId)
                ->where('book_id', $book->id)
                ->whereIn('status', ['pending', 'approved', 'borrowed'])
                ->exists();

            if ($existingRequest) {
                throw ValidationException::withMessages([
                    'book_id' => 'You already have an active request for this book.',
                ]);
            }

            return BorrowingRequest::create([
                'user_id' => $userId,
                'book_id' => $book->id,
                'status' => 'pending',
                'requested_at' => now(),
            ]);
        });
    }

    public function approve(
        BorrowingRequest $request,
        int $approverId
    ): BorrowingRequest {
        return DB::transaction(function () use ($request, $approverId) {
            $request = BorrowingRequest::query()
                ->lockForUpdate()
                ->findOrFail($request->id);

            if ($request->status !== 'pending') {
                throw ValidationException::withMessages([
                    'status' => 'Only pending requests can be approved.',
                ]);
            }

            $request->update([
                'status' => 'approved',
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            return $request->refresh();
        });
    }

    public function reject(
        BorrowingRequest $request,
        int $approverId
    ): BorrowingRequest {
        return DB::transaction(function () use ($request, $approverId) {
            $request = BorrowingRequest::query()
                ->lockForUpdate()
                ->findOrFail($request->id);

            if ($request->status !== 'pending') {
                throw ValidationException::withMessages([
                    'status' => 'Only pending requests can be rejected.',
                ]);
            }

            $request->update([
                'status' => 'rejected',
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            return $request->refresh();
        });
    }

    public function issue(
        BorrowingRequest $request
    ): BorrowingRequest {
        return DB::transaction(function () use ($request) {
            $request = BorrowingRequest::query()
                ->lockForUpdate()
                ->findOrFail($request->id);

            if ($request->status !== 'approved') {
                throw ValidationException::withMessages([
                    'status' => 'Only approved requests can be issued.',
                ]);
            }

            $book = Book::query()
                ->lockForUpdate()
                ->findOrFail($request->book_id);

            if ($book->available_copies < 1) {
                throw ValidationException::withMessages([
                    'book_id' => 'No available copies remain.',
                ]);
            }

            $book->decrement('available_copies');

            $request->update([
                'status' => 'borrowed',
                'borrowed_at' => now(),
                'due_date' => now()->addDays(7)->toDateString(),
            ]);

            return $request->refresh()->load(['user', 'book']);
        });
    }

    public function returnBook(
        BorrowingRequest $request
    ): BorrowingRequest {
        return DB::transaction(function () use ($request) {
            $request = BorrowingRequest::query()
                ->lockForUpdate()
                ->findOrFail($request->id);

            if ($request->status !== 'borrowed') {
                throw ValidationException::withMessages([
                    'status' => 'Only borrowed books can be returned.',
                ]);
            }

            $book = Book::query()
                ->lockForUpdate()
                ->findOrFail($request->book_id);

            if ($book->available_copies >= $book->total_copies) {
                throw new \DomainException(
                    'The book inventory is already at its maximum.'
                );
            }

            $book->increment('available_copies');

            $request->update([
                'status' => 'returned',
                'returned_at' => now(),
            ]);

            return $request->refresh()->load(['user', 'book']);
        });
    }

    public function isOverdue(BorrowingRequest $request): bool
    {
        return $request->status === 'borrowed'
            && $request->due_date !== null
            && $request->due_date->isPast();
    }
}
