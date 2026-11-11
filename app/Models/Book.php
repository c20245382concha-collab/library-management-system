<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'author_id',
        'publisher_id',
        'title',
        'isbn',
        'edition',
        'publication_year',
        'language',
        'description',
        'cover_image',
        'total_copies',
        'available_copies',
    ];

    protected function casts(): array
    {
        return [
            'publication_year' => 'integer',
            'total_copies' => 'integer',
            'available_copies' => 'integer',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(Publisher::class);
    }

    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class)
            ->withTimestamps();
    }

    public function borrowingRequests(): HasMany
    {
        return $this->hasMany(BorrowingRequest::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
