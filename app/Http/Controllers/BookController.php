<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Book;
use App\Models\User;
use App\Services\BookService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function __construct(
        private BookService $bookService
    ) {}

    public function index(SearchRequest $request): Response
    {
        $user = Auth::user();

        return Inertia::render('Books/Index', [
            'title' => 'Books',
            'items' => $this->bookService->getAll(
                search: $request->validated('search')
            ),
            'columns' => [
                ['key' => 'title', 'label' => 'Title'],
                ['key' => 'author.name', 'label' => 'Author'],
                ['key' => 'publisher.publisher_name', 'label' => 'Publisher'],
                ['key' => 'available_copies', 'label' => 'Available'],
                ['key' => 'total_copies', 'label' => 'Copies'],
            ],
            'canManage' => $user instanceof User && $user->isAdmin(),
            'filters' => $request->safe()->only('search'),
        ]);
    }

    public function create(): Response
    {
        $options = array_map(
            static fn ($option) => $option->all(),
            $this->bookService->getFormOptions()
        );

        return Inertia::render('Books/Create', [
            'title' => 'Book',
            'resource' => 'books',
            ...$options,
        ]);
    }

    public function store(BookRequest $request): RedirectResponse
    {
        $this->bookService->create($request->validated());

        return to_route('books.index')->with('success', 'Book created successfully.');
    }

    public function show(Book $book): Response
    {
        $user = Auth::user();
        $canRequest = $user instanceof User && $user->isMember();

        return Inertia::render('Books/Show', [
            'book' => $this->bookService->getForShow($book),
            'canRequest' => $canRequest,
            'canReview' => $canRequest,
            'currentUserId' => Auth::id(),
        ]);
    }

    public function edit(Book $book): Response
    {
        $book = $this->bookService->getForEdit($book);
        $options = array_map(
            static fn ($option) => $option->all(),
            $this->bookService->getFormOptions()
        );

        return Inertia::render('Books/Edit', [
            'title' => 'Book',
            'resource' => 'books',
            'recordId' => $book->id,
            'values' => $book->only([
                'author_id',
                'publisher_id',
                'title',
                'isbn',
                'edition',
                'publication_year',
                'language',
                'description',
                'cover_image',
                'total_copies',
            ]) + ['genre_ids' => $book->genres->modelKeys()],
            ...$options,
        ]);
    }

    public function update(BookRequest $request, Book $book): RedirectResponse
    {
        try {
            $this->bookService->update($book, $request->validated());
        } catch (DomainException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('books.index')->with('success', 'Book updated successfully.');
    }

    public function destroy(Book $book): RedirectResponse
    {
        try {
            $this->bookService->delete($book);
        } catch (DomainException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('books.index')->with('success', 'Book deleted successfully.');
    }
}
