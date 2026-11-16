<?php

namespace App\Presenters;

use App\Models\AuthorProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuthorProfilePresenter
{
    public function index(LengthAwarePaginator $profiles): Response
    {
        return Inertia::render('AuthorProfiles/Index', [
            'title' => 'Author Profiles',
            'items' => $profiles,
            'columns' => $this->columns(),
            'indexRoute' => 'author-profiles.index',
            'createRoute' => 'author-profiles.create',
            'showRoute' => 'author-profiles.show',
            'editRoute' => 'author-profiles.edit',
            'deleteRoute' => 'author-profiles.destroy',
        ]);
    }

    public function create(array $authorOptions): Response
    {
        return Inertia::render('AuthorProfiles/Create', [
            'title' => 'Author Profile',
            'indexRoute' => 'author-profiles.index',
            'storeRoute' => 'author-profiles.store',
            'fields' => $this->formFields($authorOptions),
        ]);
    }

    public function show(AuthorProfile $profile): Response
    {
        return Inertia::render('AuthorProfiles/Show', [
            'title' => 'Author Profile',
            'item' => $profile,
            'columns' => $this->columns(),
            'indexRoute' => 'author-profiles.index',
            'editRoute' => 'author-profiles.edit',
            'deleteRoute' => 'author-profiles.destroy',
        ]);
    }

    public function edit(AuthorProfile $profile, array $authorOptions): Response
    {
        return Inertia::render('AuthorProfiles/Edit', [
            'title' => 'Author Profile',
            'indexRoute' => 'author-profiles.index',
            'storeRoute' => 'author-profiles.store',
            'updateRoute' => 'author-profiles.update',
            'recordId' => $profile->id,
            'values' => $profile->only('author_id', 'bio'),
            'fields' => $this->formFields($authorOptions),
        ]);
    }

    public function created(): RedirectResponse
    {
        return $this->success('Author profile created successfully.');
    }

    public function updated(): RedirectResponse
    {
        return $this->success('Author profile updated successfully.');
    }

    public function deleted(): RedirectResponse
    {
        return $this->success('Author profile deleted successfully.');
    }

    private function success(string $message): RedirectResponse
    {
        return redirect()
            ->route('author-profiles.index')
            ->with('success', $message);
    }

    private function columns(): array
    {
        return [
            ['key' => 'author.name', 'label' => 'Author'],
            ['key' => 'bio', 'label' => 'Biography'],
        ];
    }

    private function formFields(array $authorOptions): array
    {
        return [
            [
                'name' => 'author_id',
                'label' => 'Author',
                'type' => 'select',
                'required' => true,
                'options' => $authorOptions,
            ],
            ['name' => 'bio', 'label' => 'Biography', 'type' => 'textarea'],
        ];
    }
}
