<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewRequest;
use App\Models\Book;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(
        private ReviewService $reviewService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Resources/Index', [
            'title' => 'Reviews',
            'items' => $this->reviewService->getAll(),
            'columns' => [
                ['key' => 'user.name', 'label' => 'Member'],
                ['key' => 'book.title', 'label' => 'Book'],
                ['key' => 'stars', 'label' => 'Rating'],
                ['key' => 'comment', 'label' => 'Comment'],
            ],
            'indexRoute' => 'reviews.index',
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Review',
            'indexRoute' => 'books.index',
            'storeRoute' => 'reviews.store',
            'values' => ['book_id' => $request->integer('book_id') ?: ''],
            'fields' => $this->formFields(),
        ]);
    }

    public function store(ReviewRequest $request): RedirectResponse
    {
        $this->reviewService->create(
            (int) Auth::id(),
            $request->validated()
        );

        return redirect()
            ->route('books.show', $request->validated('book_id'))
            ->with('success', 'Review submitted successfully.');
    }

    public function edit(Review $review): Response
    {
        return Inertia::render('Resources/Form', [
            'title' => 'Review',
            'indexRoute' => 'books.index',
            'storeRoute' => 'reviews.store',
            'updateRoute' => 'reviews.update',
            'recordId' => $review->id,
            'values' => $review->only('book_id', 'stars', 'comment'),
            'fields' => $this->formFields(),
        ]);
    }

    public function update(
        ReviewRequest $request,
        Review $review
    ): RedirectResponse {
        $this->reviewService->update(
            $review,
            $request->validated()
        );

        return redirect()
            ->route('books.show', $review->book_id)
            ->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $this->reviewService->delete($review);

        return redirect()
            ->route('books.index')
            ->with('success', 'Review deleted successfully.');
    }

    private function formFields(): array
    {
        return [
            [
                'name' => 'book_id',
                'label' => 'Book',
                'type' => 'select',
                'required' => true,
                'options' => Book::orderBy('title')->get(['id', 'title'])->map(fn ($book) => [
                    'value' => $book->id,
                    'label' => $book->title,
                ]),
            ],
            ['name' => 'stars', 'label' => 'Rating (1–5)', 'type' => 'number', 'required' => true, 'min' => 1, 'max' => 5],
            ['name' => 'comment', 'label' => 'Comment', 'type' => 'textarea'],
        ];
    }
}
