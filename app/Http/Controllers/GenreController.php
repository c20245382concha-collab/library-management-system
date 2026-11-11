<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenreRequest;
use App\Models\Genre;
use App\Services\GenreService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GenreController extends Controller
{
    public function __construct(
        private GenreService $genreService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Resources/Index', [
            'title' => 'Genres',
            'items' => $this->genreService->getAll(
                search: request('search')
            ),
            'columns' => [['key' => 'genre_name', 'label' => 'Genre']],
            'indexRoute' => 'genres.index',
            'createRoute' => 'genres.create',
            'showRoute' => 'genres.show',
            'editRoute' => 'genres.edit',
            'deleteRoute' => 'genres.destroy',
            'filters' => request()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Genre',
            'indexRoute' => 'genres.index',
            'storeRoute' => 'genres.store',
            'fields' => [['name' => 'genre_name', 'label' => 'Genre Name', 'required' => true]],
        ]);
    }

    public function store(GenreRequest $request): RedirectResponse
    {
        $this->genreService->create($request->validated());

        return redirect()
            ->route('genres.index')
            ->with('success', 'Genre created successfully.');
    }

    public function show(Genre $genre): Response
    {
        return Inertia::render('Resources/Show', [
            'title' => 'Genre',
            'item' => $genre,
            'columns' => [['key' => 'genre_name', 'label' => 'Genre']],
            'indexRoute' => 'genres.index',
            'editRoute' => 'genres.edit',
            'deleteRoute' => 'genres.destroy',
        ]);
    }

    public function edit(Genre $genre): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Genre',
            'indexRoute' => 'genres.index',
            'storeRoute' => 'genres.store',
            'updateRoute' => 'genres.update',
            'recordId' => $genre->id,
            'values' => $genre->only('genre_name'),
            'fields' => [['name' => 'genre_name', 'label' => 'Genre Name', 'required' => true]],
        ]);
    }

    public function update(
        GenreRequest $request,
        Genre $genre
    ): RedirectResponse {
        $this->genreService->update(
            $genre,
            $request->validated()
        );

        return redirect()
            ->route('genres.index')
            ->with('success', 'Genre updated successfully.');
    }

    public function destroy(Genre $genre): RedirectResponse
    {
        $this->genreService->delete($genre);

        return redirect()
            ->route('genres.index')
            ->with('success', 'Genre deleted successfully.');
    }
}
