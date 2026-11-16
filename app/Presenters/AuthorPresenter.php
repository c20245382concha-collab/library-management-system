<?php

namespace App\Presenters;

use App\Models\Author;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuthorPresenter
{
    public function index(LengthAwarePaginator $authors, array $filters): Response
    {
        return Inertia::render('Authors/Index', [
            'title' => 'Authors',
            'items' => $authors,
            'columns' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'profile.bio', 'label' => 'Biography'],
            ],
            'indexRoute' => 'authors.index',
            'createRoute' => 'authors.create',
            'showRoute' => 'authors.show',
            'showLabel' => 'View profile',
            'editRoute' => 'authors.edit',
            'deleteRoute' => 'authors.destroy',
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Authors/Create', [
            'title' => 'Author',
            'indexRoute' => 'authors.index',
            'storeRoute' => 'authors.store',
            'fields' => $this->formFields(),
        ]);
    }

    public function show(Author $author): Response
    {
        return Inertia::render('Authors/Show', [
            'title' => 'Author',
            'author' => $author,
        ]);
    }

    public function edit(Author $author): Response
    {
        return Inertia::render('Authors/Edit', [
            'title' => 'Author',
            'indexRoute' => 'authors.index',
            'storeRoute' => 'authors.store',
            'updateRoute' => 'authors.update',
            'recordId' => $author->id,
            'values' => $author->only('name') + [
                'bio' => $author->profile?->bio,
            ],
            'fields' => $this->formFields(),
        ]);
    }

    public function created(): RedirectResponse
    {
        return redirect()
            ->route('authors.index')
            ->with('success', 'Author created successfully.');
    }

    public function updated(): RedirectResponse
    {
        return redirect()
            ->route('authors.index')
            ->with('success', 'Author updated successfully.');
    }

    public function deleted(): RedirectResponse
    {
        return redirect()
            ->route('authors.index')
            ->with('success', 'Author deleted successfully.');
    }

    public function deletionFailed(string $message): RedirectResponse
    {
        return back()->with('error', $message);
    }

    private function formFields(): array
    {
        return [
            ['name' => 'name', 'label' => 'Name', 'required' => true],
            ['name' => 'bio', 'label' => 'Biography', 'type' => 'textarea'],
        ];
    }
}
