<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => mb_strtolower(trim($this->input('email')))]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\pL\s]+$/u',
            ],
            'email' => [
                'required',
                'email',
                'lowercase',
                'max:255',
                Rule::unique('users', 'email')->ignore($user?->id),
            ],
            'role_id' => [
                'required',
                'integer',
                'exists:roles,id',
            ],
            'password' => [
                $user ? 'nullable' : 'required',
                'string',
                'min:8',
                'max:255',
                'confirmed',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'The name may only contain letters and spaces.',
        ];
    }
}
