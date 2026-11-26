<?php

namespace App\Http\Controllers;

use App\Http\Requests\SystemReviewRequest;
use App\Models\SystemReview;
use App\Services\SystemReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemReviewController extends Controller
{
    protected $systemReviewService;

    public function __construct(SystemReviewService $systemReviewService)
    {
        $this->systemReviewService = $systemReviewService;
    }

    public function index(Request $request)
    {
        $reviews = $this->systemReviewService->paginate(
            $request->input('search')
        );

        return Inertia::render('SystemReview/Index', [
            'reviews' => $reviews,
            'averageRating' => round(SystemReview::avg('rating') ?? 0, 2),
            'totalReviews' => SystemReview::count(),
            'filters' => $request->only('search'),
            'canManage' => $request->user()->isAdmin(),
        ]);
    }

    public function create()
    {
        return Inertia::render('SystemReview/Create');
    }

    public function store(SystemReviewRequest $request)
    {
        $this->systemReviewService->create(
            $request->validated()
        );

        return redirect()
            ->route('system-reviews.index')
            ->with('success', 'System review created successfully.');
    }

    public function show(SystemReview $systemReview)
    {
        return Inertia::render('SystemReview/Show', [
            'review' => $systemReview,
        ]);
    }

    public function edit(SystemReview $systemReview)
    {
        return Inertia::render('SystemReview/Edit', [
            'review' => $systemReview,
        ]);
    }

    public function update(
        SystemReviewRequest $request,
        SystemReview $systemReview
    ) {
        $this->systemReviewService->update(
            $systemReview,
            $request->validated()
        );

        return redirect()
            ->route('system-reviews.index')
            ->with('success', 'System review updated successfully.');
    }

    public function destroy(SystemReview $systemReview)
    {
        $this->systemReviewService->delete($systemReview);

        return redirect()
            ->route('system-reviews.index')
            ->with('success', 'System review deleted successfully.');
    }
}
