<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use App\Models\Book;
use App\Models\Author;
use App\Models\Publisher;
use App\Models\Genre;
use App\Models\User;
use App\Services\BookService;
use Illuminate\Database\QueryException;
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

    public function index(): Response
    {
        $user = Auth::user();
        $isAdmin = $user instanceof User && $user->isAdmin();

        return Inertia::render('Resources/Index', [
            'title' => 'Books',
            'items' => $this->bookService->getAll(
                search: request('search')
            ),
            'columns' => [
                ['key' => 'title', 'label' => 'Title'],
                ['key' => 'author.name', 'label' => 'Author'],
                ['key' => 'publisher.publisher_name', 'label' => 'Publisher'],
                ['key' => 'available_copies', 'label' => 'Available'],
                ['key' => 'total_copies', 'label' => 'Copies'],
            ],
            'indexRoute' => 'books.index',
            'createRoute' => $isAdmin ? 'books.create' : null,
            'editRoute' => $isAdmin ? 'books.edit' : null,
            'deleteRoute' => $isAdmin ? 'books.destroy' : null,
            'showRoute' => 'books.show',
            'filters' => request()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Book',
            'indexRoute' => 'books.index',
            'storeRoute' => 'books.store',
            'fields' => $this->formFields(),
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

        return Inertia::render('Resources/Form', [
            'title' => 'Book',
            'indexRoute' => 'books.index',
            'storeRoute' => 'books.store',
            'updateRoute' => 'books.update',
            'recordId' => $book->id,
            'values' => $book->only([
                'author_id', 'publisher_id', 'title', 'isbn', 'edition',
                'publication_year', 'language', 'description', 'cover_image', 'total_copies',
            ]) + ['genre_ids' => $book->genres->modelKeys()],
            'fields' => $this->formFields(),
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

            return back()->with('error', 'This book cannot be deleted while borrowing requests are linked to it.');
        }

        return redirect()
            ->route('books.index')
            ->with('success', 'Book deleted successfully.');
    }

    private function formFields(): array
    {
        return [
            [
                'name' => 'title',
                'label' => 'Title',
                'required' => true,
            ],
            [
                'name' => 'author_id',
                'label' => 'Author',
                'type' => 'select',
                'required' => true,
                'options' => Author::orderBy('name')->get(['id', 'name'])->map(fn ($author) => [
                    'value' => $author->id,
                    'label' => $author->name,
                ]),
            ],
            [
                'name' => 'publisher_id',
                'label' => 'Publisher',
                'type' => 'select',
                'required' => true,
                'options' => Publisher::orderBy('publisher_name')->get(['id', 'publisher_name'])->map(fn ($publisher) => [
                    'value' => $publisher->id,
                    'label' => $publisher->publisher_name,
                ]),
            ],
            ['name' => 'isbn', 'label' => 'ISBN'],
            ['name' => 'edition', 'label' => 'Edition'],
            ['name' => 'publication_year', 'label' => 'Publication Year', 'type' => 'number', 'min' => 1000, 'max' => (int) date('Y')],
            ['name' => 'language', 'label' => 'Language', 'required' => true],
            ['name' => 'description', 'label' => 'Description', 'type' => 'textarea'],
            ['name' => 'cover_image', 'label' => 'Cover Image URL'],
            ['name' => 'total_copies', 'label' => 'Total Copies', 'type' => 'number', 'required' => true, 'min' => 1],
            [
                'name' => 'genre_ids',
                'label' => 'Genres',
                'type' => 'multi',
                'options' => Genre::orderBy('genre_name')->get(['id', 'genre_name'])->map(fn ($genre) => [
                    'value' => $genre->id,
                    'label' => $genre->genre_name,
                ]),
            ],
        ];
    }
}
