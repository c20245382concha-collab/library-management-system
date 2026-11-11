<?php

namespace App\Services;

use App\Models\Review;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReviewService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Review::query()
            ->with(['user', 'book'])
            ->latest()
            ->paginate($perPage);
    }

    public function getBookReviews(
        int $bookId,
        int $perPage = 10
    ): LengthAwarePaginator {
        return Review::query()
            ->with('user')
            ->where('book_id', $bookId)
            ->latest()
            ->paginate($perPage);
    }

    public function create(int $userId, array $data): Review
    {
        return Review::create(
            $this->sanitize($data, $userId)
        );
    }

    public function update(
        Review $review,
        array $data
    ): Review {
        $data['user_id'] = $review->user_id;

        $review->update(
            $this->sanitize($data)
        );

        return $review->refresh();
    }

    public function delete(Review $review): void
    {
        $review->delete();
    }

    private function sanitize(
        array $data,
        ?int $userId = null
    ): array {
        return [
            'user_id' => $userId ?? $data['user_id'] ?? null,
            'book_id' => $data['book_id'],
            'stars' => (int) $data['stars'],
            'comment' => isset($data['comment'])
                && trim($data['comment']) !== ''
                    ? trim(strip_tags($data['comment']))
                    : null,
        ];
    }
}
