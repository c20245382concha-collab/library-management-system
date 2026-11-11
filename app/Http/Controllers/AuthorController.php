<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthorRequest;
use App\Models\Author;
use App\Services\AuthorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use Inertia\Response;

class AuthorController extends Controller
{
    public function __construct(
        private AuthorService $authorService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Resources/Index', [
            'title' => 'Authors',
            'items' => $this->authorService->getAll(
                search: request('search')
            ),
            'columns' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'profile.bio', 'label' => 'Biography'],
            ],
            'indexRoute' => 'authors.index',
            'createRoute' => 'authors.create',
            'showRoute' => 'authors.show',
            'editRoute' => 'authors.edit',
            'deleteRoute' => 'authors.destroy',
            'filters' => request()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Author',
            'indexRoute' => 'authors.index',
            'storeRoute' => 'authors.store',
            'fields' => [
                ['name' => 'name', 'label' => 'Name', 'required' => true],
            ],
        ]);
    }

    public function store(AuthorRequest $request): RedirectResponse
    {
        $this->authorService->create($request->validated());

        return redirect()
            ->route('authors.index')
            ->with('success', 'Author created successfully.');
    }

    public function show(Author $author): Response
    {
        $author->load('profile');

        return Inertia::render('Resources/Show', [
            'title' => 'Author',
            'item' => $author,
            'columns' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'profile.bio', 'label' => 'Biography'],
            ],
            'indexRoute' => 'authors.index',
            'editRoute' => 'authors.edit',
            'deleteRoute' => 'authors.destroy',
        ]);
    }

    public function edit(Author $author): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Author',
            'indexRoute' => 'authors.index',
            'storeRoute' => 'authors.store',
            'updateRoute' => 'authors.update',
            'recordId' => $author->id,
            'values' => $author->only('name'),
            'fields' => [
                ['name' => 'name', 'label' => 'Name', 'required' => true],
            ],
        ]);
    }

    public function update(
        AuthorRequest $request,
        Author $author
    ): RedirectResponse {
        $this->authorService->update(
            $author,
            $request->validated()
        );

        return redirect()
            ->route('authors.index')
            ->with('success', 'Author updated successfully.');
    }

    public function destroy(Author $author): RedirectResponse
    {
        try {
            $this->authorService->delete($author);
        } catch (QueryException $exception) {
            if (!str_starts_with((string) $exception->getCode(), '23')) {
                throw $exception;
            }

            return back()->with('error', 'This author cannot be deleted while books are linked to them.');
        }

        return redirect()
            ->route('authors.index')
            ->with('success', 'Author deleted successfully.');
    }
}
