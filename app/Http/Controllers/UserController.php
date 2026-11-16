<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Presenters\UserPresenter;
use App\Services\UserService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService,
        private UserPresenter $presenter
    ) {}

    public function index(SearchRequest $request): Response
    {
        $users = $this->userService->getAll(
            search: $request->validated('search')
        );

        return $this->presenter->index($users, $request->safe()->only('search'));
    }

    public function create(): Response
    {
        return $this->presenter->create($this->userService->getRoleOptions());
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $this->userService->create($request->validated());

        return $this->presenter->created();
    }

    public function show(User $user): Response
    {
        return $this->presenter->show($this->userService->getForShow($user));
    }

    public function edit(User $user): Response
    {
        $user = $this->userService->getForEdit($user);

        return $this->presenter->edit(
            $user,
            $this->userService->getRoleOptions()
        );
    }

    public function update(
        UserRequest $request,
        User $user
    ): RedirectResponse {
        $this->userService->update(
            $user,
            $request->validated()
        );

        return $this->presenter->updated();
    }

    public function destroy(User $user): RedirectResponse
    {
        try {
            $this->userService->delete($user);
        } catch (DomainException $exception) {
            return $this->presenter->deletionFailed($exception->getMessage());
        }

        return $this->presenter->deleted();
    }
}
