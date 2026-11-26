<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SystemReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'feedback' => ['required', 'string'],
        ];
    }
}
