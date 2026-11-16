<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthorRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Author;
use App\Presenters\AuthorPresenter;
use App\Services\AuthorService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class AuthorController extends Controller
{
    public function __construct(
        private AuthorService $authorService,
        private AuthorPresenter $authorPresenter
    ) {}

    public function index(SearchRequest $request): Response
    {
        $authors = $this->authorService->getAll(
            search: $request->validated('search')
        );

        return $this->authorPresenter->index(
            $authors,
            $request->safe()->only('search')
        );
    }

    public function create(): Response
    {
        return $this->authorPresenter->create();
    }

    public function store(AuthorRequest $request): RedirectResponse
    {
        $this->authorService->create($request->validated());

        return $this->authorPresenter->created();
    }

    public function show(Author $author): Response
    {
        return $this->authorPresenter->show(
            $this->authorService->getForShow($author)
        );
    }

    public function edit(Author $author): Response
    {
        $author = $this->authorService->getForEdit($author);

        return $this->authorPresenter->edit($author);
    }

    public function update(
        AuthorRequest $request,
        Author $author
    ): RedirectResponse {
        $this->authorService->update(
            $author,
            $request->validated()
        );

        return $this->authorPresenter->updated();
    }

    public function destroy(Author $author): RedirectResponse
    {
        try {
            $this->authorService->delete($author);
        } catch (DomainException $exception) {
            return $this->authorPresenter->deletionFailed($exception->getMessage());
        }

        return $this->authorPresenter->deleted();
    }
}
