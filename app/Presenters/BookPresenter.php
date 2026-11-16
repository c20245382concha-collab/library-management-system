<?php

namespace App\Presenters;

use App\Models\Book;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BookPresenter
{
    public function index(
        LengthAwarePaginator $books,
        array $filters,
        bool $isAdmin
    ): Response {
        return Inertia::render('Books/Index', [
            'title' => 'Books',
            'items' => $books,
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
            'filters' => $filters,
        ]);
    }

    public function create(array $options): Response
    {
        return Inertia::render('Books/Create', [
            'title' => 'Book',
            'indexRoute' => 'books.index',
            'storeRoute' => 'books.store',
            'fields' => $this->formFields($options),
        ]);
    }

    public function show(Book $book, bool $canRequest, ?int $currentUserId): Response
    {
        return Inertia::render('Books/Show', [
            'book' => $book,
            'canRequest' => $canRequest,
            'canReview' => $canRequest,
            'currentUserId' => $currentUserId,
        ]);
    }

    public function edit(Book $book, array $options): Response
    {
        return Inertia::render('Books/Edit', [
            'title' => 'Book',
            'indexRoute' => 'books.index',
            'storeRoute' => 'books.store',
            'updateRoute' => 'books.update',
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
            'fields' => $this->formFields($options),
        ]);
    }

    public function created(): RedirectResponse
    {
        return $this->success('Book created successfully.');
    }

    public function updated(): RedirectResponse
    {
        return $this->success('Book updated successfully.');
    }

    public function deleted(): RedirectResponse
    {
        return $this->success('Book deleted successfully.');
    }

    public function failed(string $message): RedirectResponse
    {
        return back()->with('error', $message);
    }

    private function success(string $message): RedirectResponse
    {
        return redirect()
            ->route('books.index')
            ->with('success', $message);
    }

    private function formFields(array $options): array
    {
        return [
            ['name' => 'title', 'label' => 'Title', 'required' => true],
            [
                'name' => 'author_id',
                'label' => 'Author',
                'type' => 'select',
                'required' => true,
                'options' => $options['authors'],
            ],
            [
                'name' => 'publisher_id',
                'label' => 'Publisher',
                'type' => 'select',
                'required' => true,
                'options' => $options['publishers'],
            ],
            ['name' => 'isbn', 'label' => 'ISBN'],
            ['name' => 'edition', 'label' => 'Edition'],
            ['name' => 'publication_year', 'label' => 'Publication Year', 'type' => 'number', 'min' => 1000, 'max' => now()->year],
            ['name' => 'language', 'label' => 'Language', 'required' => true],
            ['name' => 'description', 'label' => 'Description', 'type' => 'textarea'],
            ['name' => 'cover_image', 'label' => 'Cover Image URL'],
            ['name' => 'total_copies', 'label' => 'Total Copies', 'type' => 'number', 'required' => true, 'min' => 1],
            [
                'name' => 'genre_ids',
                'label' => 'Genres',
                'type' => 'multi',
                'options' => $options['genres'],
            ],
        ];
    }
}
