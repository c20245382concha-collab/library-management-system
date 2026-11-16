<?php

namespace App\Presenters;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BorrowingRequestPresenter
{
    public function index(LengthAwarePaginator $requests, array $filters): Response
    {
        return Inertia::render('BorrowingRequests/Index', [
            'requests' => $requests,
            'filters' => $filters,
        ]);
    }

    public function myRequests(LengthAwarePaginator $requests): Response
    {
        return Inertia::render('BorrowingRequests/MyRequests', [
            'requests' => $requests,
        ]);
    }

    public function submitted(): RedirectResponse
    {
        return back()->with('success', 'Borrowing request submitted successfully.');
    }

    public function approved(): RedirectResponse
    {
        return back()->with('success', 'Borrowing request approved successfully.');
    }

    public function rejected(): RedirectResponse
    {
        return back()->with('success', 'Borrowing request rejected successfully.');
    }

    public function issued(): RedirectResponse
    {
        return back()->with('success', 'Book issued successfully.');
    }

    public function returned(): RedirectResponse
    {
        return back()->with('success', 'Book returned successfully.');
    }
}
