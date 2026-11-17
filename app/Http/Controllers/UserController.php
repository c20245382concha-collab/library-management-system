<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\UserService;
use DomainException;
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
            'filters' => $request->safe()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Users/Create', [
            'title' => 'User',
            'resource' => 'users',
            'roles' => $this->userService->getRoleOptions(),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $this->userService->create($request->validated());

        return to_route('users.index')->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        return Inertia::render('Users/Show', [
            'title' => 'User',
            'item' => $this->userService->getForShow($user),
            'columns' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'email', 'label' => 'Email'],
                ['key' => 'role.role_name', 'label' => 'Role'],
            ],
        ]);
    }

    public function edit(User $user): Response
    {
        $user = $this->userService->getForEdit($user);

        return Inertia::render('Users/Edit', [
            'title' => 'User',
            'resource' => 'users',
            'recordId' => $user->id,
            'values' => $user->only('name', 'email', 'role_id'),
            'roles' => $this->userService->getRoleOptions(),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $this->userService->update($user, $request->validated());

        return to_route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        try {
            $this->userService->delete($user);
        } catch (DomainException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('users.index')->with('success', 'User deleted successfully.');
    }
}
