<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewCreateRequest;
use App\Http\Requests\ReviewRequest;
use App\Models\Review;
use App\Presenters\ReviewPresenter;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(
        private ReviewService $reviewService,
        private ReviewPresenter $presenter
    ) {}

    public function index(): Response
    {
        return $this->presenter->index($this->reviewService->getAll());
    }

    public function create(ReviewCreateRequest $request): Response
    {
        return $this->presenter->create(
            $this->reviewService->getBookOptions(),
            $request->validated('book_id')
        );
    }

    public function store(ReviewRequest $request): RedirectResponse
    {
        $this->reviewService->create(
            (int) Auth::id(),
            $request->validated()
        );

        return $this->presenter->created((int) $request->validated('book_id'));
    }

    public function edit(Review $review): Response
    {
        return $this->presenter->edit(
            $review,
            $this->reviewService->getBookOptions()
        );
    }

    public function update(
        ReviewRequest $request,
        Review $review
    ): RedirectResponse {
        $this->reviewService->update(
            $review,
            $request->validated()
        );

        return $this->presenter->updated($review->book_id);
    }

    public function destroy(Review $review): RedirectResponse
    {
        $this->reviewService->delete($review);

        return $this->presenter->deleted();
    }
}
