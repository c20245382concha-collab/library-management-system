<?php

namespace Database\Seeders;

use App\Models\Publisher;
use Illuminate\Database\Seeder;

class PublisherSeeder extends Seeder
{
    public function run(): void
    {
        $publishers = [
            'Bloomsbury Publishing',
            'Prentice Hall',
            'HarperOne',
            'Penguin Books',
            'Signet Classics',
            'Harper Perennial',
            'Plata Publishing',
            'Random House',
            'Scribner',
            'Doubleday',
        ];

        foreach ($publishers as $publisherName) {
            Publisher::firstOrCreate([
                'publisher_name' => $publisherName,
            ]);
        }
    }
}
