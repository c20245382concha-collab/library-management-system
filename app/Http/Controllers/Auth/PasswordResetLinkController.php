<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetLinkRequest;
use App\Presenters\AuthPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    public function __construct(
        private AuthPresenter $presenter
    ) {}

    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return $this->presenter->forgotPassword($request->session()->get('status'));
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(PasswordResetLinkRequest $request): RedirectResponse
    {
        Password::sendResetLink(
            $request->validated()
        );

        return $this->presenter->resetLinkRequested();
    }
}
