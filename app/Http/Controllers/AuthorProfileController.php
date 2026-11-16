<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthorProfileRequest;
use App\Models\AuthorProfile;
use App\Presenters\AuthorProfilePresenter;
use App\Services\AuthorProfileService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class AuthorProfileController extends Controller
{
    public function __construct(
        private AuthorProfileService $profileService,
        private AuthorProfilePresenter $presenter
    ) {}

    public function index(): Response
    {
        return $this->presenter->index($this->profileService->getAll());
    }

    public function create(): Response
    {
        return $this->presenter->create($this->profileService->getAuthorOptions());
    }

    public function store(
        AuthorProfileRequest $request
    ): RedirectResponse {
        $this->profileService->create($request->validated());

        return $this->presenter->created();
    }

    public function show(AuthorProfile $authorProfile): Response
    {
        return $this->presenter->show($this->profileService->getForShow($authorProfile));
    }

    public function edit(AuthorProfile $authorProfile): Response
    {
        $authorProfile = $this->profileService->getForEdit($authorProfile);

        return $this->presenter->edit(
            $authorProfile,
            $this->profileService->getAuthorOptions()
        );
    }

    public function update(
        AuthorProfileRequest $request,
        AuthorProfile $authorProfile
    ): RedirectResponse {
        $this->profileService->update(
            $authorProfile,
            $request->validated()
        );

        return $this->presenter->updated();
    }

    public function destroy(
        AuthorProfile $authorProfile
    ): RedirectResponse {
        $this->profileService->delete($authorProfile);

        return $this->presenter->deleted();
    }
}
