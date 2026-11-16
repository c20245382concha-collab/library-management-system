<?php

namespace App\Http\Controllers;

use App\Http\Requests\BorrowingRequest as BorrowingRequestForm;
use App\Http\Requests\SearchRequest;
use App\Models\BorrowingRequest;
use App\Presenters\BorrowingRequestPresenter;
use App\Services\BorrowingRequestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class BorrowingRequestController extends Controller
{
    public function __construct(
        private BorrowingRequestService $borrowingService,
        private BorrowingRequestPresenter $presenter
    ) {}

    public function index(SearchRequest $request): Response
    {
        $requests = $this->borrowingService->getAll(
            search: $request->validated('search')
        );

        return $this->presenter->index(
            $requests,
            $request->safe()->only('search')
        );
    }

    public function myRequests(): Response
    {
        return $this->presenter->myRequests(
            $this->borrowingService->getUserRequests((int) Auth::id())
        );
    }

    public function store(
        BorrowingRequestForm $request
    ): RedirectResponse {
        $this->borrowingService->submit(
            (int) Auth::id(),
            $request->validated()
        );

        return $this->presenter->submitted();
    }

    public function approve(
        BorrowingRequest $borrowingRequest
    ): RedirectResponse {
        $this->borrowingService->approve(
            $borrowingRequest,
            (int) Auth::id()
        );

        return $this->presenter->approved();
    }

    public function reject(
        BorrowingRequest $borrowingRequest
    ): RedirectResponse {
        $this->borrowingService->reject(
            $borrowingRequest,
            (int) Auth::id()
        );

        return $this->presenter->rejected();
    }

    public function issue(
        BorrowingRequest $borrowingRequest
    ): RedirectResponse {
        $this->borrowingService->issue($borrowingRequest);

        return $this->presenter->issued();
    }

    public function returnBook(
        BorrowingRequest $borrowingRequest
    ): RedirectResponse {
        $this->borrowingService->returnBook($borrowingRequest);

        return $this->presenter->returned();
    }
}
