<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Publisher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'author' => 'J.K. Rowling',
                'publisher' => 'Bloomsbury Publishing',
                'title' => "Harry Potter and the Philosopher's Stone",
                'isbn' => '9780747532699',
                'edition' => '1st Edition',
                'publication_year' => 1997,
                'language' => 'English',
                'description' => 'The first book in the Harry Potter fantasy series, following a young wizard as he discovers his magical identity.',
                'total_copies' => 10,
                'available_copies' => 10,
            ],
            [
                'author' => 'Robert C. Martin',
                'publisher' => 'Prentice Hall',
                'title' => 'Clean Code',
                'isbn' => '9780132350884',
                'edition' => '1st Edition',
                'publication_year' => 2008,
                'language' => 'English',
                'description' => 'A practical guide to writing readable, maintainable, and efficient software code.',
                'total_copies' => 8,
                'available_copies' => 8,
            ],
            [
                'author' => 'Paulo Coelho',
                'publisher' => 'HarperOne',
                'title' => 'The Alchemist',
                'isbn' => '9780062315007',
                'edition' => '25th Anniversary Edition',
                'publication_year' => 2014,
                'language' => 'English',
                'description' => 'A philosophical novel about a young shepherd pursuing his personal legend.',
                'total_copies' => 12,
                'available_copies' => 12,
            ],
            [
                'author' => 'George Orwell',
                'publisher' => 'Signet Classics',
                'title' => '1984',
                'isbn' => '9780451524935',
                'edition' => 'Reprint Edition',
                'publication_year' => 1950,
                'language' => 'English',
                'description' => 'A dystopian novel about surveillance, authoritarianism, and individual freedom.',
                'total_copies' => 7,
                'available_copies' => 7,
            ],
            [
                'author' => 'Jane Austen',
                'publisher' => 'Penguin Books',
                'title' => 'Pride and Prejudice',
                'isbn' => '9780141439518',
                'edition' => 'Reprint Edition',
                'publication_year' => 1813,
                'language' => 'English',
                'description' => 'A classic novel exploring love, social class, and personal growth.',
                'total_copies' => 6,
                'available_copies' => 6,
            ],
            [
                'author' => 'Harper Lee',
                'publisher' => 'Harper Perennial',
                'title' => 'To Kill a Mockingbird',
                'isbn' => '9780061120084',
                'edition' => 'Reprint Edition',
                'publication_year' => 1960,
                'language' => 'English',
                'description' => 'A novel exploring justice, morality, and racial inequality through the eyes of a young girl.',
                'total_copies' => 9,
                'available_copies' => 9,
            ],
            [
                'author' => 'James Clear',
                'publisher' => 'Random House',
                'title' => 'Atomic Habits',
                'isbn' => '9780735211292',
                'edition' => '1st Edition',
                'publication_year' => 2018,
                'language' => 'English',
                'description' => 'A practical guide to building good habits and breaking bad ones through small improvements.',
                'total_copies' => 10,
                'available_copies' => 10,
            ],
            [
                'author' => 'Dan Brown',
                'publisher' => 'Doubleday',
                'title' => 'The Da Vinci Code',
                'isbn' => '9780385504201',
                'edition' => '1st Edition',
                'publication_year' => 2003,
                'language' => 'English',
                'description' => 'A mystery thriller involving secret societies, historical puzzles, and religious symbolism.',
                'total_copies' => 5,
                'available_copies' => 5,
            ],
        ];

        foreach ($books as $data) {
            $author = Author::firstOrCreate([
                'name' => $data['author'],
            ]);

            $publisher = Publisher::firstOrCreate([
                'publisher_name' => $data['publisher'],
            ]);

            // Retrieve an actual book-cover URL from Google Books.
            $coverImage = $this->getGoogleBooksCover($data['isbn']);

            Book::updateOrCreate(
                ['isbn' => $data['isbn']],
                [
                    'author_id' => $author->id,
                    'publisher_id' => $publisher->id,
                    'title' => $data['title'],
                    'edition' => $data['edition'],
                    'publication_year' => $data['publication_year'],
                    'language' => $data['language'],
                    'description' => $data['description'],
                    'cover_image' => $coverImage,
                    'total_copies' => $data['total_copies'],
                    'available_copies' => $data['available_copies'],
                ]
            );
        }
    }

    private function getGoogleBooksCover(string $isbn): ?string
    {
        try {
            $response = Http::timeout(15)
                ->get('https://www.googleapis.com/books/v1/volumes', [
                    'q' => 'isbn:' . $isbn,
                ]);

            if (!$response->successful()) {
                return null;
            }

            $imageUrl = $response->json(
                'items.0.volumeInfo.imageLinks.thumbnail'
            );

            if (!$imageUrl) {
                return null;
            }

            return str_replace('http://', 'https://', $imageUrl);

        } catch (\Throwable $exception) {
            return null;
        }
    }
}
