<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenreRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Genre;
use App\Presenters\GenrePresenter;
use App\Services\GenreService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class GenreController extends Controller
{
    public function __construct(
        private GenreService $genreService,
        private GenrePresenter $presenter
    ) {}

    public function index(SearchRequest $request): Response
    {
        $genres = $this->genreService->getAll(
            search: $request->validated('search')
        );

        return $this->presenter->index($genres, $request->safe()->only('search'));
    }

    public function create(): Response
    {
        return $this->presenter->create();
    }

    public function store(GenreRequest $request): RedirectResponse
    {
        $this->genreService->create($request->validated());

        return $this->presenter->created();
    }

    public function show(Genre $genre): Response
    {
        return $this->presenter->show($genre);
    }

    public function edit(Genre $genre): Response
    {
        return $this->presenter->edit($genre);
    }

    public function update(
        GenreRequest $request,
        Genre $genre
    ): RedirectResponse {
        $this->genreService->update(
            $genre,
            $request->validated()
        );

        return $this->presenter->updated();
    }

    public function destroy(Genre $genre): RedirectResponse
    {
        $this->genreService->delete($genre);

        return $this->presenter->deleted();
    }
}
