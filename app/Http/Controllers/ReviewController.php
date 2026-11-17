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

    public function create(Request $request): Response
    {
        $validated = $request->validate([
            'book_id' => ['sometimes', 'nullable', 'integer', 'exists:books,id'],
        ]);

        return Inertia::render('Reviews/Create', [
            'title' => 'Review',
            'resource' => 'reviews',
            'values' => ['book_id' => $validated['book_id'] ?? ''],
            'books' => $this->bookOptions(),
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
        return Inertia::render('Reviews/Edit', [
            'title' => 'Review',
            'resource' => 'reviews',
            'recordId' => $review->id,
            'values' => $review->only('book_id', 'stars', 'comment'),
            'books' => $this->bookOptions(),
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

    private function bookOptions(): array
    {
        return Book::query()
            ->orderBy('title')
            ->get(['id', 'title'])
            ->map(fn($book) => [
                'value' => $book->id,
                'label' => $book->title,
            ])
            ->all();
    }
}
