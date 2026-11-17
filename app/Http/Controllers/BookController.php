<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Author;
use App\Models\Book;
use App\Models\Genre;
use App\Models\Publisher;
use App\Models\User;
use App\Services\BookService;
use DomainException;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function __construct(
        private BookService $bookService
    ) {
    }

    public function index(SearchRequest $request): Response
    {
        $user = Auth::user();
        $isAdmin = $user instanceof User && $user->isAdmin();

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
            'canManage' => $isAdmin,
            'filters' => $request->safe()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Books/Create', [
            'title' => 'Book',
            'resource' => 'books',
            'authors' => $this->authorOptions(),
            'publishers' => $this->publisherOptions(),
            'genres' => $this->genreOptions(),
        ]);
    }

    public function store(BookRequest $request): RedirectResponse
    {
        $this->bookService->create($request->validated());

        return redirect()
            ->route('books.index')
            ->with('success', 'Book created successfully.');
    }

    public function show(Book $book): Response
    {
        $user = Auth::user();
        $isMember = $user instanceof User && $user->isMember();

        $book->load([
            'author',
            'publisher',
            'genres',
            'reviews.user',
        ]);

        return Inertia::render('Books/Show', [
            'book' => $book,
            'canRequest' => $isMember,
            'canReview' => $isMember,
            'currentUserId' => Auth::id(),
        ]);
    }

    public function edit(Book $book): Response
    {
        $book->load('genres');

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
            ]) + [
                'genre_ids' => $book->genres->modelKeys(),
            ],
            'authors' => $this->authorOptions(),
            'publishers' => $this->publisherOptions(),
            'genres' => $this->genreOptions(),
        ]);
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
            return back()->with('error', $exception->getMessage());
        }

        return redirect()
            ->route('books.index')
            ->with('success', 'Book updated successfully.');
    }

    public function destroy(Book $book): RedirectResponse
    {
        try {
            $this->bookService->delete($book);
        } catch (DomainException $exception) {
            return back()->with('error', $exception->getMessage());
        } catch (QueryException $exception) {
            if (!str_starts_with((string) $exception->getCode(), '23')) {
                throw $exception;
            }

            return back()->with(
                'error',
                'This book cannot be deleted while borrowing requests are linked to it.'
            );
        }

        return redirect()
            ->route('books.index')
            ->with('success', 'Book deleted successfully.');
    }

    private function authorOptions(): array
    {
        return Author::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn($author) => [
                'value' => $author->id,
                'label' => $author->name,
            ])
            ->all();
    }

    private function publisherOptions(): array
    {
        return Publisher::query()
            ->orderBy('publisher_name')
            ->get(['id', 'publisher_name'])
            ->map(fn($publisher) => [
                'value' => $publisher->id,
                'label' => $publisher->publisher_name,
            ])
            ->all();
    }

    private function genreOptions(): array
    {
        return Genre::query()
            ->orderBy('genre_name')
            ->get(['id', 'genre_name'])
            ->map(fn($genre) => [
                'value' => $genre->id,
                'label' => $genre->genre_name,
            ])
            ->all();
    }
}