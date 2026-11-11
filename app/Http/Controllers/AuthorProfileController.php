<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthorProfileRequest;
use App\Models\Author;
use App\Models\AuthorProfile;
use App\Services\AuthorProfileService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuthorProfileController extends Controller
{
    public function __construct(
        private AuthorProfileService $profileService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Resources/Index', [
            'title' => 'Author Profiles',
            'items' => $this->profileService->getAll(),
            'columns' => [
                ['key' => 'author.name', 'label' => 'Author'],
                ['key' => 'bio', 'label' => 'Biography'],
            ],
            'indexRoute' => 'author-profiles.index',
            'createRoute' => 'author-profiles.create',
            'showRoute' => 'author-profiles.show',
            'editRoute' => 'author-profiles.edit',
            'deleteRoute' => 'author-profiles.destroy',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Author Profile',
            'indexRoute' => 'author-profiles.index',
            'storeRoute' => 'author-profiles.store',
            'fields' => [
                [
                    'name' => 'author_id',
                    'label' => 'Author',
                    'type' => 'select',
                    'required' => true,
                    'options' => Author::orderBy('name')->get(['id', 'name'])->map(fn ($author) => [
                        'value' => $author->id,
                        'label' => $author->name,
                    ]),
                ],
                ['name' => 'bio', 'label' => 'Biography', 'type' => 'textarea'],
            ],
        ]);
    }

    public function store(
        AuthorProfileRequest $request
    ): RedirectResponse {
        $this->profileService->create($request->validated());

        return redirect()
            ->route('author-profiles.index')
            ->with('success', 'Author profile created successfully.');
    }

    public function show(AuthorProfile $authorProfile): Response
    {
        $authorProfile->load('author');

        return Inertia::render('Resources/Show', [
            'title' => 'Author Profile',
            'item' => $authorProfile,
            'columns' => [
                ['key' => 'author.name', 'label' => 'Author'],
                ['key' => 'bio', 'label' => 'Biography'],
            ],
            'indexRoute' => 'author-profiles.index',
            'editRoute' => 'author-profiles.edit',
            'deleteRoute' => 'author-profiles.destroy',
        ]);
    }

    public function edit(AuthorProfile $authorProfile): Response
    {
        $authorProfile->load('author');

        return Inertia::render('Resources/Form', [
            'title' => 'Author Profile',
            'indexRoute' => 'author-profiles.index',
            'storeRoute' => 'author-profiles.store',
            'updateRoute' => 'author-profiles.update',
            'recordId' => $authorProfile->id,
            'values' => $authorProfile->only('author_id', 'bio'),
            'fields' => [
                [
                    'name' => 'author_id',
                    'label' => 'Author',
                    'type' => 'select',
                    'required' => true,
                    'options' => Author::orderBy('name')->get(['id', 'name'])->map(fn ($author) => [
                        'value' => $author->id,
                        'label' => $author->name,
                    ]),
                ],
                ['name' => 'bio', 'label' => 'Biography', 'type' => 'textarea'],
            ],
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

        return redirect()
            ->route('author-profiles.index')
            ->with('success', 'Author profile updated successfully.');
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
