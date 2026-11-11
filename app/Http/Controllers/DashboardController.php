<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(): Response
    {
        $user = User::query()
            ->with('role')
            ->findOrFail(Auth::id());

        $stats = $user->isAdmin()
            ? $this->dashboardService->getAdminStats()
            : $this->dashboardService->getMemberStats($user->id);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'isAdmin' => $user->isAdmin(),
            'userName' => $user->name,
        ]);
    }
}
