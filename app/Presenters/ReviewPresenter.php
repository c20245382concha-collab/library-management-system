<?php

namespace App\Presenters;

use App\Models\Review;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReviewPresenter
{
    public function index(LengthAwarePaginator $reviews): Response
    {
        return Inertia::render('Reviews/Index', [
            'title' => 'Reviews',
            'items' => $reviews,
            'columns' => [
                ['key' => 'user.name', 'label' => 'Member'],
                ['key' => 'book.title', 'label' => 'Book'],
                ['key' => 'stars', 'label' => 'Rating'],
                ['key' => 'comment', 'label' => 'Comment'],
            ],
            'indexRoute' => 'reviews.index',
        ]);
    }

    public function create(array $bookOptions, ?int $bookId): Response
    {
        return Inertia::render('Reviews/Create', [
            'title' => 'Review',
            'indexRoute' => 'books.index',
            'storeRoute' => 'reviews.store',
            'values' => ['book_id' => $bookId ?? ''],
            'fields' => $this->formFields($bookOptions),
        ]);
    }

    public function edit(Review $review, array $bookOptions): Response
    {
        return Inertia::render('Reviews/Edit', [
            'title' => 'Review',
            'indexRoute' => 'books.index',
            'storeRoute' => 'reviews.store',
            'updateRoute' => 'reviews.update',
            'recordId' => $review->id,
            'values' => $review->only('book_id', 'stars', 'comment'),
            'fields' => $this->formFields($bookOptions),
        ]);
    }

    public function created(int $bookId): RedirectResponse
    {
        return redirect()
            ->route('books.show', $bookId)
            ->with('success', 'Review submitted successfully.');
    }

    public function updated(int $bookId): RedirectResponse
    {
        return redirect()
            ->route('books.show', $bookId)
            ->with('success', 'Review updated successfully.');
    }

    public function deleted(): RedirectResponse
    {
        return redirect()
            ->route('books.index')
            ->with('success', 'Review deleted successfully.');
    }

    private function formFields(array $bookOptions): array
    {
        return [
            [
                'name' => 'book_id',
                'label' => 'Book',
                'type' => 'select',
                'required' => true,
                'options' => $bookOptions,
            ],
            ['name' => 'stars', 'label' => 'Rating (1–5)', 'type' => 'number', 'required' => true, 'min' => 1, 'max' => 5],
            ['name' => 'comment', 'label' => 'Comment', 'type' => 'textarea'],
        ];
    }
}
