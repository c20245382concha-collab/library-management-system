<?php

namespace App\Services;

use App\Models\AuthorProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AuthorProfileService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return AuthorProfile::query()
            ->with('author')
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): AuthorProfile
    {
        return AuthorProfile::create($this->sanitize($data));
    }

    public function update(AuthorProfile $profile, array $data): AuthorProfile
    {
        $profile->update($this->sanitize($data));

        return $profile->refresh();
    }

    public function delete(AuthorProfile $profile): void
    {
        $profile->delete();
    }

    private function sanitize(array $data): array
    {
        return [
            'author_id' => $data['author_id'],
            'bio' => isset($data['bio']) && trim($data['bio']) !== ''
                ? trim(strip_tags($data['bio']))
                : null,
        ];
    }
}
