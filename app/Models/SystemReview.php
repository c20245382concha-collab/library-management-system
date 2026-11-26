<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemReview extends Model
{
    protected $fillable = [
        'name',
        'email',
        'rating',
        'feedback',
    ];
}
