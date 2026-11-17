<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthorRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Author;
use App\Services\AuthorService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuthorController extends Controller
{
    public function __construct(
        private AuthorService $authorService
    ) {}

    public function index(SearchRequest $request): Response
    {
        return Inertia::render('Authors/Index', [
            'title' => 'Authors',
            'items' => $this->authorService->getAll(
                search: $request->validated('search')
            ),
            'columns' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'profile.bio', 'label' => 'Biography'],
            ],
            'filters' => $request->safe()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Authors/Create', [
            'title' => 'Author',
            'resource' => 'authors',
        ]);
    }

    public function store(AuthorRequest $request): RedirectResponse
    {
        $this->authorService->create($request->validated());

        return to_route('authors.index')->with('success', 'Author created successfully.');
    }

    public function show(Author $author): Response
    {
        $author = $this->authorService->getForShow($author);

        return Inertia::render('Authors/Show', [
            'title' => 'Author',
            'author' => $author,
        ]);
    }

    public function edit(Author $author): Response
    {
        $author = $this->authorService->getForEdit($author);

        return Inertia::render('Authors/Edit', [
            'title' => 'Author',
            'resource' => 'authors',
            'recordId' => $author->id,
            'values' => $author->only('name') + [
                'bio' => $author->profile?->bio,
            ],
        ]);
    }

    public function update(AuthorRequest $request, Author $author): RedirectResponse
    {
        $this->authorService->update($author, $request->validated());

        return to_route('authors.index')->with('success', 'Author updated successfully.');
    }

    public function destroy(Author $author): RedirectResponse
    {
        try {
            $this->authorService->delete($author);
        } catch (DomainException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('authors.index')->with('success', 'Author deleted successfully.');
    }
}
