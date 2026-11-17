<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

    public function getForShow(User $user): User
    {
        return $user->load('role');
    }

    public function getForEdit(User $user): User
    {
        return $user->load('role');
    }

    public function getRoleOptions(): array
    {
        return Role::query()
            ->orderBy('role_name')
            ->get(['id', 'role_name'])
            ->map(fn ($role) => [
                'value' => $role->id,
                'label' => $role->role_name,
            ])
            ->all();
    }

    public function register(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $role = Role::query()->firstOrCreate([
                'role_name' => 'Member/Student',
            ]);

            return $this->create([
                ...$data,
                'role_id' => $role->id,
            ]);
        });
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

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return $user->refresh()->load('role');
    }

    public function delete(User $user): void
    {
        try {
            $user->delete();
        } catch (QueryException $exception) {
            if (! str_starts_with((string) $exception->getCode(), '23')) {
                throw $exception;
            }

            throw new \DomainException(
                'This user cannot be deleted while borrowing records are linked to them.',
                previous: $exception
            );
        }
    }

    public function updateProfile(User $user, array $data): User
    {
        $sanitized = [
            'name' => trim(strip_tags($data['name'])),
            'email' => strtolower(trim($data['email'])),
        ];

        if ($user->email !== $sanitized['email']) {
            $user->email_verified_at = null;
        }

        $user->fill($sanitized)->save();

        return $user->refresh();
    }

    public function deleteAccount(User $user): void
    {
        $user->delete();
    }

    public function updatePassword(User $user, string $password): User
    {
        $user->update([
            'password' => Hash::make($password),
        ]);

        return $user->refresh();
    }

    public function resetPassword(User $user, string $password): User
    {
        $user->forceFill([
            'password' => Hash::make($password),
            'remember_token' => Str::random(60),
        ])->save();

        return $user;
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
