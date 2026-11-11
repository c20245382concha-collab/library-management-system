<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BorrowingRequest;
use App\Models\Review;
use App\Models\User;

class DashboardService
{
    public function getAdminStats(): array
    {
        return [
            'totalBooks' => Book::count(),
            'totalMembers' => User::whereHas('role', function ($query) {
                $query->where('role_name', 'Member/Student');
            })->count(),
            'totalAuthors' => \App\Models\Author::count(),
            'totalBorrowingRequests' => BorrowingRequest::count(),
            'pendingRequests' => BorrowingRequest::where('status', 'pending')->count(),
            'borrowedBooks' => BorrowingRequest::where('status', 'borrowed')->count(),
            'totalReviews' => Review::count(),
        ];
    }

    public function getMemberStats(int $userId): array
    {
        return [
            'totalRequests' => BorrowingRequest::where('user_id', $userId)->count(),

            'pendingRequests' => BorrowingRequest::where('user_id', $userId)
                ->where('status', 'pending')
                ->count(),

            'borrowedBooks' => BorrowingRequest::where('user_id', $userId)
                ->where('status', 'borrowed')
                ->count(),

            'totalReviews' => Review::where('user_id', $userId)->count(),
        ];
    }
}
