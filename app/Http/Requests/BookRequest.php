<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $book = $this->route('book');

        return [
            'author_id' => [
                'required',
                'integer',
                'exists:authors,id',
            ],
            'publisher_id' => [
                'required',
                'integer',
                'exists:publishers,id',
            ],
            'title' => ['required', 'string', 'max:255'],
            'isbn' => [
                'nullable',
                'string',
                'max:20',
                'regex:/\A[0-9Xx -]+\z/',
                Rule::unique('books', 'isbn')->ignore($book?->id),
            ],
            'edition' => ['nullable', 'string', 'max:50'],
            'publication_year' => [
                'nullable',
                'integer',
                'min:1000',
                'max:'.now()->year,
            ],
            'language' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:10000'],
            'cover_image' => ['nullable', 'url:http,https', 'max:2048'],
            'total_copies' => ['required', 'integer', 'min:1', 'max:2147483647'],
            'genre_ids' => ['nullable', 'array'],
            'genre_ids.*' => [
                'integer',
                'distinct',
                'exists:genres,id',
            ],
        ];
    }
}
