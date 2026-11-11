<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class BookService
{
    public function getAll(
        int $perPage = 10,
        ?string $search = null
    ): LengthAwarePaginator {
        return Book::query()
            ->with(['author', 'publisher', 'genres'])
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('isbn', 'like', "%{$search}%")
                        ->orWhereHas('author', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Book
    {
        return DB::transaction(function () use ($data) {
            $genres = $data['genre_ids'] ?? [];

            unset($data['genre_ids']);

            $data = $this->sanitize($data);

            // New books initially have all copies available.
            $data['available_copies'] = $data['total_copies'];

            $book = Book::create($data);

            $book->genres()->sync($genres);

            return $book->load(['author', 'publisher', 'genres']);
        });
    }

    public function update(Book $book, array $data): Book
    {
        return DB::transaction(function () use ($book, $data) {
            $genres = $data['genre_ids'] ?? [];

            unset($data['genre_ids']);

            $book = Book::query()
                ->lockForUpdate()
                ->findOrFail($book->id);

            $data = $this->sanitize($data);

            // Preserve the number of copies currently borrowed.
            $borrowedCopies = $book->total_copies - $book->available_copies;

            if ($data['total_copies'] < $borrowedCopies) {
                throw new \DomainException(
                    'Total copies cannot be less than the number of borrowed copies.'
                );
            }

            $data['available_copies'] = $data['total_copies'] - $borrowedCopies;

            $book->update($data);

            $book->genres()->sync($genres);

            return $book->refresh()->load([
                'author',
                'publisher',
                'genres',
            ]);
        });
    }

    public function delete(Book $book): void
    {
        DB::transaction(function () use ($book) {
            $book = Book::query()
                ->lockForUpdate()
                ->findOrFail($book->id);

            if ($book->total_copies !== $book->available_copies) {
                throw new \DomainException(
                    'This book cannot be deleted while copies are borrowed.'
                );
            }

            $book->delete();
        });
    }

    private function sanitize(array $data): array
    {
        return [
            'author_id' => $data['author_id'],
            'publisher_id' => $data['publisher_id'],
            'title' => trim(strip_tags($data['title'])),
            'isbn' => isset($data['isbn']) && trim($data['isbn']) !== ''
                ? trim($data['isbn'])
                : null,
            'edition' => isset($data['edition']) && trim($data['edition']) !== ''
                ? trim(strip_tags($data['edition']))
                : null,
            'publication_year' => $data['publication_year'] ?? null,
            'language' => trim(strip_tags($data['language'])),
            'description' => isset($data['description']) && trim($data['description']) !== ''
                ? trim(strip_tags($data['description']))
                : null,
            'cover_image' => $data['cover_image'] ?? null,
            'total_copies' => (int) $data['total_copies'],
        ];
    }
}
