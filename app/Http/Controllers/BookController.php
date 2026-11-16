<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Book;
use App\Models\User;
use App\Presenters\BookPresenter;
use App\Services\BookService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class BookController extends Controller
{
    public function __construct(
        private BookService $bookService,
        private BookPresenter $bookPresenter
    ) {}

    public function index(SearchRequest $request): Response
    {
        $user = Auth::user();
        $isAdmin = $user instanceof User && $user->isAdmin();

        $books = $this->bookService->getAll(
            search: $request->validated('search')
        );

        return $this->bookPresenter->index(
            $books,
            $request->safe()->only('search'),
            $isAdmin
        );
    }

    public function create(): Response
    {
        $options = $this->bookService->getFormOptions();

        return $this->bookPresenter->create($options);
    }

    public function store(BookRequest $request): RedirectResponse
    {
        $this->bookService->create($request->validated());

        return $this->bookPresenter->created();
    }

    public function show(Book $book): Response
    {
        $user = Auth::user();
        $isMember = $user instanceof User && $user->isMember();

        return $this->bookPresenter->show(
            $this->bookService->getForShow($book),
            $isMember,
            Auth::id()
        );
    }

    public function edit(Book $book): Response
    {
        $book = $this->bookService->getForEdit($book);
        $options = $this->bookService->getFormOptions();

        return $this->bookPresenter->edit($book, $options);
    }

    public function update(
        BookRequest $request,
        Book $book
    ): RedirectResponse {
        try {
            $this->bookService->update(
                $book,
                $request->validated()
            );
        } catch (DomainException $exception) {
            return $this->bookPresenter->failed($exception->getMessage());
        }

        return $this->bookPresenter->updated();
    }

    public function destroy(Book $book): RedirectResponse
    {
        try {
            $this->bookService->delete($book);
        } catch (DomainException $exception) {
            return $this->bookPresenter->failed($exception->getMessage());
        }

        return $this->bookPresenter->deleted();
    }
}
