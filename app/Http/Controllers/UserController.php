<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchRequest;
use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(SearchRequest $request): Response
    {
        return Inertia::render('Users/Index', [
            'title' => 'Users',
            'items' => $this->userService->getAll(
                search: $request->validated('search')
            ),
            'columns' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'email', 'label' => 'Email'],
                ['key' => 'role.role_name', 'label' => 'Role'],
            ],
            'indexRoute' => 'users.index',
            'createRoute' => 'users.create',
            'showRoute' => 'users.show',
            'editRoute' => 'users.edit',
            'deleteRoute' => 'users.destroy',
            'filters' => $request->safe()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Users/Create', [
            'title' => 'User',
            'indexRoute' => 'users.index',
            'storeRoute' => 'users.store',
            'fields' => $this->formFields(),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $this->userService->create($request->validated());

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        $user->load('role');

        return Inertia::render('Users/Show', [
            'title' => 'User',
            'item' => $user,
            'columns' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'email', 'label' => 'Email'],
                ['key' => 'role.role_name', 'label' => 'Role'],
            ],
            'indexRoute' => 'users.index',
            'editRoute' => 'users.edit',
            'deleteRoute' => 'users.destroy',
        ]);
    }

    public function edit(User $user): Response
    {
        $user->load('role');

        return Inertia::render('Users/Edit', [
            'title' => 'User',
            'indexRoute' => 'users.index',
            'storeRoute' => 'users.store',
            'updateRoute' => 'users.update',
            'recordId' => $user->id,
            'values' => $user->only('name', 'email', 'role_id'),
            'fields' => $this->formFields(editing: true),
        ]);
    }

    public function update(
        UserRequest $request,
        User $user
    ): RedirectResponse {
        $this->userService->update(
            $user,
            $request->validated()
        );

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        try {
            $this->userService->delete($user);
        } catch (QueryException $exception) {
            if (! str_starts_with((string) $exception->getCode(), '23')) {
                throw $exception;
            }

            return back()->with('error', 'This user cannot be deleted while borrowing records are linked to them.');
        }

        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    private function formFields(bool $editing = false): array
    {
        return [
            ['name' => 'name', 'label' => 'Name', 'required' => true],
            ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true],
            [
                'name' => 'role_id',
                'label' => 'Role',
                'type' => 'select',
                'required' => true,
                'options' => Role::orderBy('role_name')->get(['id', 'role_name'])->map(fn ($role) => [
                    'value' => $role->id,
                    'label' => $role->role_name,
                ]),
            ],
            ['name' => 'password', 'label' => 'Password', 'type' => 'password', 'required' => ! $editing],
            ['name' => 'password_confirmation', 'label' => 'Confirm Password', 'type' => 'password', 'required' => ! $editing],
        ];
    }
}
