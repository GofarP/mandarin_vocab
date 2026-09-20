<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVocabRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'hanzi' => ['required', 'string', 'max:100'],
            'pinyin' => ['required', 'string', 'max:150'],
            'dibaca' => ['nullable', 'string', 'max:150'],
            'meaning' => ['required', 'string', 'max:1000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Custom validation messages in Indonesian.
     */
    public function messages(): array
    {
        return [
            'hanzi.required' => 'Karakter Hanzi (汉字) wajib diisi.',
            'hanzi.max' => 'Karakter Hanzi maksimal 100 karakter.',
            'pinyin.required' => 'Pinyin (拼音) wajib diisi.',
            'pinyin.max' => 'Pinyin maksimal 150 karakter.',
            'meaning.required' => 'Arti / makna kata wajib diisi.',
            'meaning.max' => 'Arti maksimal 1000 karakter.',
        ];
    }
}
