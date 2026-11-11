<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuthorProfile extends Model
{
    protected $fillable = [
        'author_id',
        'bio',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }
}
