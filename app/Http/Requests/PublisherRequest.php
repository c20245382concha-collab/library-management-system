<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PublisherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $publisher = $this->route('publisher');

        return [
            'publisher_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('publishers', 'publisher_name')
                    ->ignore($publisher?->id),
            ],
        ];
    }
}
