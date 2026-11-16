<?php

namespace App\Presenters;

use Inertia\Inertia;
use Inertia\Response;

class DashboardPresenter
{
    public function show(array $stats, bool $isAdmin, string $userName): Response
    {
        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'isAdmin' => $isAdmin,
            'userName' => $userName,
        ]);
    }
}
