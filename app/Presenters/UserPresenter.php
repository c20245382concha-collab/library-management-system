<?php

namespace App\Presenters;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserPresenter
{
    public function index(LengthAwarePaginator $users, array $filters): Response
    {
        return Inertia::render('Users/Index', [
            'title' => 'Users',
            'items' => $users,
            'columns' => $this->columns(),
            'indexRoute' => 'users.index',
            'createRoute' => 'users.create',
            'showRoute' => 'users.show',
            'editRoute' => 'users.edit',
            'deleteRoute' => 'users.destroy',
            'filters' => $filters,
        ]);
    }

    public function create(array $roleOptions): Response
    {
        return Inertia::render('Users/Create', [
            'title' => 'User',
            'indexRoute' => 'users.index',
            'storeRoute' => 'users.store',
            'fields' => $this->formFields($roleOptions),
        ]);
    }

    public function show(User $user): Response
    {
        return Inertia::render('Users/Show', [
            'title' => 'User',
            'item' => $user,
            'columns' => $this->columns(),
            'indexRoute' => 'users.index',
            'editRoute' => 'users.edit',
            'deleteRoute' => 'users.destroy',
        ]);
    }

    public function edit(User $user, array $roleOptions): Response
    {
        return Inertia::render('Users/Edit', [
            'title' => 'User',
            'indexRoute' => 'users.index',
            'storeRoute' => 'users.store',
            'updateRoute' => 'users.update',
            'recordId' => $user->id,
            'values' => $user->only('name', 'email', 'role_id'),
            'fields' => $this->formFields($roleOptions, editing: true),
        ]);
    }

    public function created(): RedirectResponse
    {
        return $this->success('User created successfully.');
    }

    public function updated(): RedirectResponse
    {
        return $this->success('User updated successfully.');
    }

    public function deleted(): RedirectResponse
    {
        return $this->success('User deleted successfully.');
    }

    public function deletionFailed(string $message): RedirectResponse
    {
        return back()->with('error', $message);
    }

    private function success(string $message): RedirectResponse
    {
        return redirect()
            ->route('users.index')
            ->with('success', $message);
    }

    private function columns(): array
    {
        return [
            ['key' => 'name', 'label' => 'Name'],
            ['key' => 'email', 'label' => 'Email'],
            ['key' => 'role.role_name', 'label' => 'Role'],
        ];
    }

    private function formFields(array $roleOptions, bool $editing = false): array
    {
        return [
            ['name' => 'name', 'label' => 'Name', 'required' => true],
            ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true],
            [
                'name' => 'role_id',
                'label' => 'Role',
                'type' => 'select',
                'required' => true,
                'options' => $roleOptions,
            ],
            ['name' => 'password', 'label' => 'Password', 'type' => 'password', 'required' => ! $editing],
            ['name' => 'password_confirmation', 'label' => 'Confirm Password', 'type' => 'password', 'required' => ! $editing],
        ];
    }
}
