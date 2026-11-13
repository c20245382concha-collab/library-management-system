<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        $authors = [
            'J.K. Rowling',
            'Robert C. Martin',
            'Paulo Coelho',
            'George Orwell',
            'Jane Austen',
            'Harper Lee',
            'Robert T. Kiyosaki',
            'James Clear',
            'Stephen King',
            'Dan Brown',
        ];

        foreach ($authors as $name) {
            Author::firstOrCreate([
                'name' => $name,
            ]);
        }
    }
}
