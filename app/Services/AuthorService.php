<?php

namespace App\Services;

use App\Models\Author;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class AuthorService
{
    public function getAll(int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        return Author::query()
            ->with('profile')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Author
    {
        return DB::transaction(function () use ($data) {
            $author = Author::create($this->sanitize($data));
            $this->saveProfile($author, $data);

            return $author->load('profile');
        });
    }

    public function update(Author $author, array $data): Author
    {
        DB::transaction(function () use ($author, $data) {
            $author->update($this->sanitize($data));
            $this->saveProfile($author, $data);
        });

        return $author->refresh()->load('profile');
    }

    public function delete(Author $author): void
    {
        $author->delete();
    }

    private function sanitize(array $data): array
    {
        return [
            'name' => trim(strip_tags($data['name'])),
        ];
    }

    private function saveProfile(Author $author, array $data): void
    {
        if (! array_key_exists('bio', $data)) {
            return;
        }

        $bio = isset($data['bio']) && trim($data['bio']) !== ''
            ? trim(strip_tags($data['bio']))
            : null;

        if ($bio === null) {
            $author->profile()->delete();

            return;
        }

        $author->profile()->updateOrCreate([], ['bio' => $bio]);
    }
}
