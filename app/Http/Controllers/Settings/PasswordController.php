<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Presenters\SettingsPresenter;
use App\Services\UserService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class PasswordController extends Controller
{
    public function __construct(
        private UserService $userService,
        private SettingsPresenter $presenter
    ) {}

    /**
     * Show the user's password settings page.
     */
    public function edit(Request $request): Response
    {
        return $this->presenter->password(
            $request->user() instanceof MustVerifyEmail,
            $request->session()->get('status')
        );
    }

    /**
     * Update the user's password.
     */
    public function update(PasswordUpdateRequest $request): RedirectResponse
    {
        $this->userService->updatePassword($request->user(), $request->validated('password'));

        return $this->presenter->passwordUpdated();
    }
}
