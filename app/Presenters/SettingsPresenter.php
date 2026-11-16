<?php

namespace App\Presenters;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsPresenter
{
    public function profile(bool $mustVerifyEmail, mixed $status): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $mustVerifyEmail,
            'status' => $status,
        ]);
    }

    public function password(bool $mustVerifyEmail, mixed $status): Response
    {
        return Inertia::render('settings/password', [
            'mustVerifyEmail' => $mustVerifyEmail,
            'status' => $status,
        ]);
    }

    public function profileUpdated(): RedirectResponse
    {
        return to_route('profile.edit');
    }

    public function profileDeleted(): RedirectResponse
    {
        return redirect('/');
    }

    public function passwordUpdated(): RedirectResponse
    {
        return back();
    }
}
