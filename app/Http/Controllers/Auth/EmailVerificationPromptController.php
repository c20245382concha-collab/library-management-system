<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Presenters\AuthPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    public function __construct(
        private AuthPresenter $presenter
    ) {}

    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->presenter->verificationAlreadyComplete();
        }

        return $this->presenter->verifyEmail($request->session()->get('status'));
    }
}
