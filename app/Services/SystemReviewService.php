<?php

namespace App\Services;

use App\Models\SystemReview;

class SystemReviewService
{
    public function paginate(?string $search = null, int $perPage = 10)
    {
        return SystemReview::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    private function sanitize(array $data): array
    {
        return [
            'name' => strip_tags(trim($data['name'])),
            'email' => strtolower(trim($data['email'])),
            'rating' => (int) $data['rating'],
            'feedback' => strip_tags(trim($data['feedback'])),
        ];
    }

    public function create(array $data): SystemReview
    {
        return SystemReview::create(
            $this->sanitize($data)
        );
    }

    public function update(SystemReview $systemReview, array $data): bool
    {
        return $systemReview->update(
            $this->sanitize($data)
        );
    }

    public function delete(SystemReview $systemReview): bool
    {
        return $systemReview->delete();
    }
}
