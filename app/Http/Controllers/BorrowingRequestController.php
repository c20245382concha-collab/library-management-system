<?php

namespace App\Http\Controllers;

use App\Http\Requests\BorrowingRequest as BorrowingRequestForm;
use App\Http\Requests\SearchRequest;
use App\Models\BorrowingRequest;
use App\Services\BorrowingRequestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BorrowingRequestController extends Controller
{
    public function __construct(
        private BorrowingRequestService $borrowingService
    ) {}

    public function index(SearchRequest $request): Response
    {
        $search = $request->validated('search');
        $search = $search !== null ? trim($search) : null;

        return Inertia::render('BorrowingRequests/Index', [
            'requests' => $this->borrowingService->getAll(search: $search),
            'filters' => ['search' => $search],
        ]);
    }

    public function myRequests(): Response
    {
        return Inertia::render('BorrowingRequests/MyRequests', [
            'requests' => $this->borrowingService->getUserRequests(
                (int) Auth::id()
            ),
        ]);
    }

    public function store(
        BorrowingRequestForm $request
    ): RedirectResponse {
        $this->borrowingService->submit(
            (int) Auth::id(),
            $request->validated()
        );

        return back()->with(
            'success',
            'Borrowing request submitted successfully.'
        );
    }

    public function approve(
        BorrowingRequest $borrowingRequest
    ): RedirectResponse {
        $this->borrowingService->approve(
            $borrowingRequest,
            (int) Auth::id()
        );

        return back()->with(
            'success',
            'Borrowing request approved successfully.'
        );
    }

    public function reject(
        BorrowingRequest $borrowingRequest
    ): RedirectResponse {
        $this->borrowingService->reject(
            $borrowingRequest,
            (int) Auth::id()
        );

        return back()->with(
            'success',
            'Borrowing request rejected successfully.'
        );
    }

    public function issue(
        BorrowingRequest $borrowingRequest
    ): RedirectResponse {
        $this->borrowingService->issue($borrowingRequest);

        return back()->with(
            'success',
            'Book issued successfully.'
        );
    }

    public function returnBook(
        BorrowingRequest $borrowingRequest
    ): RedirectResponse {
        $this->borrowingService->returnBook($borrowingRequest);

        return back()->with(
            'success',
            'Book returned successfully.'
        );
    }
}
