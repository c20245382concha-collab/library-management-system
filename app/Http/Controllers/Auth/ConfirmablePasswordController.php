<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ConfirmablePasswordRequest;
use App\Presenters\AuthPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    public function __construct(
        private AuthPresenter $presenter
    ) {}

    /**
     * Show the confirm password page.
     */
    public function show(): Response
    {
        return $this->presenter->confirmPassword();
    }

    /**
     * Confirm the user's password.
     */
    public function store(ConfirmablePasswordRequest $request): RedirectResponse
    {
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->validated('password'),
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        return $this->presenter->passwordConfirmed();
    }
}
