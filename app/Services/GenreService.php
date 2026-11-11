<?php

namespace App\Services;

use App\Models\Genre;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GenreService
{
    public function getAll(int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        return Genre::query()
            ->when($search, function ($query, $search) {
                $query->where('genre_name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Genre
    {
        return Genre::create($this->sanitize($data));
    }

    public function update(Genre $genre, array $data): Genre
    {
        $genre->update($this->sanitize($data));

        return $genre->refresh();
    }

    public function delete(Genre $genre): void
    {
        $genre->delete();
    }

    private function sanitize(array $data): array
    {
        return [
            'genre_name' => trim(strip_tags($data['genre_name'])),
        ];
    }
}
