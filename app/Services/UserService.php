<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAll(
        int $perPage = 10,
        ?string $search = null
    ): LengthAwarePaginator {
        return User::query()
            ->with('role')
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): User
    {
        $data = $this->sanitize($data);

        $data['password'] = Hash::make($data['password']);

        return User::create($data)->load('role');
    }

    public function update(User $user, array $data): User
    {
        $data = $this->sanitize($data);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return $user->refresh()->load('role');
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    private function sanitize(array $data): array
    {
        $clean = [
            'name' => trim(strip_tags($data['name'])),
            'email' => strtolower(trim($data['email'])),
            'role_id' => $data['role_id'],
        ];

        if (isset($data['password'])) {
            $clean['password'] = $data['password'];
        }

        return $clean;
    }
}
