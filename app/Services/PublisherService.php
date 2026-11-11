<?php

namespace App\Services;

use App\Models\Publisher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PublisherService
{
    public function getAll(int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        return Publisher::query()
            ->when($search, function ($query, $search) {
                $query->where('publisher_name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Publisher
    {
        return Publisher::create($this->sanitize($data));
    }

    public function update(Publisher $publisher, array $data): Publisher
    {
        $publisher->update($this->sanitize($data));

        return $publisher->refresh();
    }

    public function delete(Publisher $publisher): void
    {
        $publisher->delete();
    }

    private function sanitize(array $data): array
    {
        return [
            'publisher_name' => trim(strip_tags($data['publisher_name'])),
        ];
    }
}
