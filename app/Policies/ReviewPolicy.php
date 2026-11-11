<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Review $review): bool
    {
        return $user->isAdmin()
            || $review->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isMember();
    }

    public function update(User $user, Review $review): bool
    {
        return $user->isMember()
            && $review->user_id === $user->id;
    }

    public function delete(User $user, Review $review): bool
    {
        return $user->isMember()
            && $review->user_id === $user->id;
    }
}
