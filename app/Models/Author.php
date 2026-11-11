<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Author extends Model
{
    protected $fillable = [
        'name',
    ];

    public function profile(): HasOne
    {
        return $this->hasOne(AuthorProfile::class);
    }

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }
}
