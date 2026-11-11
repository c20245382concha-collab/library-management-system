<?php

namespace App\Services;

use App\Models\Author;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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
        return Author::create($this->sanitize($data));
    }

    public function update(Author $author, array $data): Author
    {
        $author->update($this->sanitize($data));

        return $author->refresh();
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
}
