<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Presenters\AuthPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function __construct(
        private AuthPresenter $presenter
    ) {}

    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->presenter->verificationAlreadyComplete();
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->presenter->verificationLinkSent();
    }
}
