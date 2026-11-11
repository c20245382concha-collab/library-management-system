<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $genre = $this->route('genre');

        return [
            'genre_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('genres', 'genre_name')
                    ->ignore($genre?->id),
            ],
        ];
    }
}
