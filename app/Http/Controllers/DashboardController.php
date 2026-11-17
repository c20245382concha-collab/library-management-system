<?php

namespace App\Http\Controllers;

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
        $user = $this->dashboardService->getUserForDashboard((int) Auth::id());
        $isAdmin = $user->isAdmin();
        $stats = $isAdmin
            ? $this->dashboardService->getAdminStats()
            : $this->dashboardService->getMemberStats($user->id);

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'isAdmin' => $isAdmin,
            'userName' => $user->name,
        ]);
    }
}
