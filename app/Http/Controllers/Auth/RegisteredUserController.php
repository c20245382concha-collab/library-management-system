<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegistrationRequest;
use App\Presenters\AuthPresenter;
use App\Services\UserService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private UserService $userService,
        private AuthPresenter $presenter
    ) {}

    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return $this->presenter->registration();
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(RegistrationRequest $request): RedirectResponse
    {
        $user = $this->userService->register($request->validated());

        event(new Registered($user));

        Auth::login($user);

        return $this->presenter->registered();
    }
}
