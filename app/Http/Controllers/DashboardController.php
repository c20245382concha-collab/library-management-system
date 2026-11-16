<?php

namespace App\Http\Controllers;

use App\Presenters\DashboardPresenter;
use App\Services\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService,
        private DashboardPresenter $presenter
    ) {}

    public function index(): Response
    {
        $user = $this->dashboardService->getUserForDashboard((int) Auth::id());

        $stats = $user->isAdmin()
            ? $this->dashboardService->getAdminStats()
            : $this->dashboardService->getMemberStats($user->id);

        return $this->presenter->show($stats, $user->isAdmin(), $user->name);
    }
}
