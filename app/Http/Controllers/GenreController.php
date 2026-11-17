<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenreRequest;
use App\Http\Requests\SearchRequest;
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

    public function index(SearchRequest $request): Response
    {
        return Inertia::render('Genres/Index', [
            'title' => 'Genres',
            'items' => $this->genreService->getAll(
                search: $request->validated('search')
            ),
            'columns' => [['key' => 'genre_name', 'label' => 'Genre']],
            'filters' => $request->safe()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Genres/Create', [
            'title' => 'Genre',
            'resource' => 'genres',
        ]);
    }

    public function store(GenreRequest $request): RedirectResponse
    {
        $this->genreService->create($request->validated());

        return to_route('genres.index')->with('success', 'Genre created successfully.');
    }

    public function show(Genre $genre): Response
    {
        return Inertia::render('Genres/Show', [
            'title' => 'Genre',
            'item' => $genre,
            'columns' => [['key' => 'genre_name', 'label' => 'Genre']],
        ]);
    }

    public function edit(Genre $genre): Response
    {
        return Inertia::render('Genres/Edit', [
            'title' => 'Genre',
            'resource' => 'genres',
            'recordId' => $genre->id,
            'values' => $genre->only('genre_name'),
        ]);
    }

    public function update(GenreRequest $request, Genre $genre): RedirectResponse
    {
        $this->genreService->update($genre, $request->validated());

        return to_route('genres.index')->with('success', 'Genre updated successfully.');
    }

    public function destroy(Genre $genre): RedirectResponse
    {
        $this->genreService->delete($genre);

        return to_route('genres.index')->with('success', 'Genre deleted successfully.');
    }
}
