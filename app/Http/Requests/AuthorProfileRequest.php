<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AuthorProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $profile = $this->route('author_profile');

        return [
            'author_id' => [
                'required',
                'integer',
                'exists:authors,id',
                Rule::unique('author_profiles', 'author_id')
                    ->ignore($profile?->id),
            ],
            'bio' => ['nullable', 'string'],
        ];
    }
}
