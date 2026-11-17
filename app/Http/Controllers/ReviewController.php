<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewCreateRequest;
use App\Http\Requests\ReviewRequest;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;
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
        return Inertia::render('Reviews/Index', [
            'title' => 'Reviews',
            'items' => $this->reviewService->getAll(),
            'columns' => [
                ['key' => 'user.name', 'label' => 'Member'],
                ['key' => 'book.title', 'label' => 'Book'],
                ['key' => 'stars', 'label' => 'Rating'],
                ['key' => 'comment', 'label' => 'Comment'],
            ],
        ]);
    }

    public function create(ReviewCreateRequest $request): Response
    {
        return Inertia::render('Reviews/Create', [
            'title' => 'Review',
            'resource' => 'reviews',
            'values' => ['book_id' => $request->validated('book_id') ?? ''],
            'books' => $this->reviewService->getBookOptions(),
        ]);
    }

    public function store(ReviewRequest $request): RedirectResponse
    {
        $this->reviewService->create((int) Auth::id(), $request->validated());
        $bookId = (int) $request->validated('book_id');

        return to_route('books.show', $bookId)->with('success', 'Review submitted successfully.');
    }

    public function edit(Review $review): Response
    {
        return Inertia::render('Reviews/Edit', [
            'title' => 'Review',
            'resource' => 'reviews',
            'recordId' => $review->id,
            'values' => $review->only('book_id', 'stars', 'comment'),
            'books' => $this->reviewService->getBookOptions(),
        ]);
    }

    public function update(ReviewRequest $request, Review $review): RedirectResponse
    {
        $this->reviewService->update($review, $request->validated());

        return to_route('books.show', $review->book_id)->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $this->reviewService->delete($review);

        return to_route('books.index')->with('success', 'Review deleted successfully.');
    }
}
