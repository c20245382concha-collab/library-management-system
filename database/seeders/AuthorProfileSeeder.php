<?php

namespace Database\Seeders;

use App\Models\AuthorProfile;
use Illuminate\Database\Seeder;

class AuthorProfileSeeder extends Seeder
{
    public function run(): void
    {
        $profiles = [
            [
                'author_id' => 1,
                'bio' => 'British author best known for creating the Harry Potter fantasy book series.',
            ],
            [
                'author_id' => 2,
                'bio' => 'American software engineer and author known for Clean Code and software architecture.',
            ],
            [
                'author_id' => 3,
                'bio' => 'Brazilian novelist known for philosophical and inspirational works, particularly The Alchemist.',
            ],
            [
                'author_id' => 4,
                'bio' => 'English novelist and essayist known for influential works such as 1984 and Animal Farm.',
            ],
            [
                'author_id' => 5,
                'bio' => 'English novelist celebrated for literary works exploring love, society, and human relationships.',
            ],
            [
                'author_id' => 6,
                'bio' => 'American novelist best known for To Kill a Mockingbird.',
            ],
            [
                'author_id' => 7,
                'bio' => 'American author and entrepreneur known for Rich Dad Poor Dad.',
            ],
            [
                'author_id' => 8,
                'bio' => 'American author known for Atomic Habits and his work on habit formation.',
            ],
            [
                'author_id' => 9,
                'bio' => 'American author widely recognized for horror, supernatural fiction, suspense, and fantasy novels.',
            ],
            [
                'author_id' => 10,
                'bio' => 'American author known for mystery and thriller novels, including The Da Vinci Code.',
            ],
        ];

        foreach ($profiles as $profile) {
            AuthorProfile::updateOrCreate(
                ['author_id' => $profile['author_id']],
                ['bio' => $profile['bio']]
            );
        }
    }
}
