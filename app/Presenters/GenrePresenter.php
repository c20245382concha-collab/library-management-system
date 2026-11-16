<?php

namespace App\Presenters;

use App\Models\Genre;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GenrePresenter
{
    public function index(LengthAwarePaginator $genres, array $filters): Response
    {
        return Inertia::render('Genres/Index', [
            'title' => 'Genres',
            'items' => $genres,
            'columns' => $this->columns(),
            'indexRoute' => 'genres.index',
            'createRoute' => 'genres.create',
            'showRoute' => 'genres.show',
            'editRoute' => 'genres.edit',
            'deleteRoute' => 'genres.destroy',
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Genres/Create', [
            'title' => 'Genre',
            'indexRoute' => 'genres.index',
            'storeRoute' => 'genres.store',
            'fields' => $this->fields(),
        ]);
    }

    public function show(Genre $genre): Response
    {
        return Inertia::render('Genres/Show', [
            'title' => 'Genre',
            'item' => $genre,
            'columns' => $this->columns(),
            'indexRoute' => 'genres.index',
            'editRoute' => 'genres.edit',
            'deleteRoute' => 'genres.destroy',
        ]);
    }

    public function edit(Genre $genre): Response
    {
        return Inertia::render('Genres/Edit', [
            'title' => 'Genre',
            'indexRoute' => 'genres.index',
            'storeRoute' => 'genres.store',
            'updateRoute' => 'genres.update',
            'recordId' => $genre->id,
            'values' => $genre->only('genre_name'),
            'fields' => $this->fields(),
        ]);
    }

    public function created(): RedirectResponse
    {
        return $this->success('Genre created successfully.');
    }

    public function updated(): RedirectResponse
    {
        return $this->success('Genre updated successfully.');
    }

    public function deleted(): RedirectResponse
    {
        return $this->success('Genre deleted successfully.');
    }

    private function success(string $message): RedirectResponse
    {
        return redirect()
            ->route('genres.index')
            ->with('success', $message);
    }

    private function columns(): array
    {
        return [['key' => 'genre_name', 'label' => 'Genre']];
    }

    private function fields(): array
    {
        return [['name' => 'genre_name', 'label' => 'Genre Name', 'required' => true]];
    }
}
