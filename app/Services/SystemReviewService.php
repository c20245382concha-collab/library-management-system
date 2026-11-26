<?php

namespace App\Services;

use App\Models\SystemReview;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SystemReviewService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return SystemReview::query()
            ->latest()
            ->paginate($perPage);
    }

    public function sanitize(array $data): array
    {
        return [
            'name' => trim(strip_tags($data['name'] ?? '')),
            'email' => filter_var(
                trim($data['email'] ?? ''),
                FILTER_SANITIZE_EMAIL
            ),
            'rating' => (int) ($data['rating'] ?? 0),
            'feedback' => trim(strip_tags($data['feedback'] ?? '')),
        ];
    }

    public function create(array $data): SystemReview
    {
        $sanitizedData = $this->sanitize($data);

        return SystemReview::create($sanitizedData);
    }
}
