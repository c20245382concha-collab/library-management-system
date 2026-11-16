<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\NewPasswordRequest;
use App\Presenters\AuthPresenter;
use App\Services\UserService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class NewPasswordController extends Controller
{
    public function __construct(
        private UserService $userService,
        private AuthPresenter $presenter
    ) {}

    /**
     * Show the password reset page.
     */
    public function create(Request $request): Response
    {
        return $this->presenter->resetPassword($request->email, $request->route('token'));
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws ValidationException
     */
    public function store(NewPasswordRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $validated,
            function ($user) use ($validated) {
                $this->userService->resetPassword($user, $validated['password']);

                event(new PasswordReset($user));
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        if ($status == Password::PasswordReset) {
            return $this->presenter->passwordReset($status);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}
