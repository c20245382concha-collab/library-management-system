<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $review = $this->route('review');

        return [
            'book_id' => [
                'required',
                'integer',
                'exists:books,id',
                Rule::unique('reviews', 'book_id')
                    ->where('user_id', $this->user()?->id)
                    ->ignore($review?->id),
            ],
            'stars' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
