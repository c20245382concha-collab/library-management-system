<?php

namespace App\Presenters;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuthPresenter
{
    public function login(bool $canResetPassword, mixed $status): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => $canResetPassword,
            'status' => $status,
        ]);
    }

    public function registration(): Response
    {
        return Inertia::render('auth/register');
    }

    public function forgotPassword(mixed $status): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $status,
        ]);
    }

    public function resetPassword(mixed $email, mixed $token): Response
    {
        return Inertia::render('auth/reset-password', [
            'email' => $email,
            'token' => $token,
        ]);
    }

    public function confirmPassword(): Response
    {
        return Inertia::render('auth/confirm-password');
    }

    public function verifyEmail(mixed $status): Response
    {
        return Inertia::render('auth/verify-email', [
            'status' => $status,
        ]);
    }

    public function verificationAlreadyComplete(): RedirectResponse
    {
        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function verificationLinkSent(): RedirectResponse
    {
        return back()->with('status', 'verification-link-sent');
    }

    public function emailVerified(): RedirectResponse
    {
        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }

    public function authenticated(): RedirectResponse
    {
        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function registered(): RedirectResponse
    {
        return to_route('dashboard');
    }

    public function loggedOut(): RedirectResponse
    {
        return redirect('/');
    }

    public function passwordConfirmed(): RedirectResponse
    {
        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function resetLinkRequested(): RedirectResponse
    {
        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }

    public function passwordReset(mixed $status): RedirectResponse
    {
        return to_route('login')->with('status', __($status));
    }
}
