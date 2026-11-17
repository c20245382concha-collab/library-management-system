<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthorProfileRequest;
use App\Models\AuthorProfile;
use App\Services\AuthorProfileService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;

class AuthorProfileController extends Controller
{
    public function __construct(
        private AuthorProfileService $profileService
    ) {
    }

    public function index(): Response
    {
        return Inertia::render('AuthorProfiles/Index', [
            'title' => 'Author Profiles',
            'items' => $this->profileService->getAll(),
            'columns' => [
                ['key' => 'author.name', 'label' => 'Author'],
                ['key' => 'bio', 'label' => 'Biography'],
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('AuthorProfiles/Create', [
            'title' => 'Author Profile',
            'resource' => 'author-profiles',
            'authors' => $this->profileService->getAuthorOptions(),
        ]);
    }

    public function store(
        AuthorProfileRequest $request
    ): RedirectResponse {
        $this->profileService->create($request->validated());

        return redirect()->route('author-profiles.index')->with('success', 'Author profile created successfully.');
    }

    public function show(AuthorProfile $authorProfile): Response
    {
        $authorProfile = $this->profileService->getForShow($authorProfile);

        return Inertia::render('AuthorProfiles/Show', [
            'title' => 'Author Profile',
            'item' => $authorProfile,
            'columns' => [
                ['key' => 'author.name', 'label' => 'Author'],
                ['key' => 'bio', 'label' => 'Biography'],
            ],
        ]);
    }

    public function edit(AuthorProfile $authorProfile): Response
    {
        $authorProfile = $this->profileService->getForEdit($authorProfile);

        return Inertia::render('AuthorProfiles/Edit', [
            'title' => 'Author Profile',
            'resource' => 'author-profiles',
            'recordId' => $authorProfile->id,
            'values' => $authorProfile->only('author_id', 'bio'),
            'authors' => $this->profileService->getAuthorOptions(),
        ]);
    }

    public function update(
        AuthorProfileRequest $request,
        AuthorProfile $authorProfile
    ): RedirectResponse {
        $this->profileService->update(
            $authorProfile,
            $request->validated()
        );

        return redirect()->route('author-profiles.index')->with('success', 'Author profile updated successfully.');
    }

    public function destroy(
        AuthorProfile $authorProfile
    ): RedirectResponse {
        $this->profileService->delete($authorProfile);

        return redirect()
            ->route('author-profiles.index')
            ->with('success', 'Author profile deleted successfully.');
    }

}
