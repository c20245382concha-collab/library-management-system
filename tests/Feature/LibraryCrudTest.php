<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\AuthorProfile;
use App\Models\Book;
use App\Models\BorrowingRequest;
use App\Models\Genre;
use App\Models\Publisher;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LibraryCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_read_update_and_delete_library_records(): void
    {
        $admin = $this->userWithRole('Admin/Librarian');
        $memberRole = Role::query()->firstOrCreate(['role_name' => 'Member/Student']);
        $this->actingAs($admin);

        $this->get(route('books.create'))
            ->assertInertia(fn (Assert $page) => $page->component('Books/Create'));

        $this->post(route('authors.store'), [
            'name' => 'Octavia Butler',
            'bio' => 'American science fiction writer.',
        ])
            ->assertRedirect(route('authors.index'));
        $author = Author::query()->where('name', 'Octavia Butler')->firstOrFail();
        $this->get(route('authors.show', $author))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Authors/Show')
                ->where('author.profile.bio', 'American science fiction writer.')
                ->has('author.books', 0));
        $this->put(route('authors.update', $author), [
            'name' => 'Octavia E. Butler',
            'bio' => 'Award-winning science fiction writer.',
        ])
            ->assertRedirect(route('authors.index'));
        $this->assertDatabaseHas('authors', ['id' => $author->id, 'name' => 'Octavia E. Butler']);
        $this->assertDatabaseHas('author_profiles', [
            'author_id' => $author->id,
            'bio' => 'Award-winning science fiction writer.',
        ]);

        $profileAuthor = Author::query()->create(['name' => 'Profile Test Author']);
        $this->post(route('author-profiles.store'), [
            'author_id' => $profileAuthor->id,
            'bio' => 'American science fiction writer.',
        ])->assertRedirect(route('author-profiles.index'));
        $profile = AuthorProfile::query()->where('author_id', $profileAuthor->id)->firstOrFail();
        $this->get(route('author-profiles.show', $profile))
            ->assertInertia(fn (Assert $page) => $page->component('AuthorProfiles/Show'));
        $this->put(route('author-profiles.update', $profile), [
            'author_id' => $profileAuthor->id,
            'bio' => 'Award-winning science fiction writer.',
        ])->assertRedirect(route('author-profiles.index'));

        $this->post(route('genres.store'), ['genre_name' => 'Science Fiction'])
            ->assertRedirect(route('genres.index'));
        $genre = Genre::query()->where('genre_name', 'Science Fiction')->firstOrFail();
        $this->get(route('genres.show', $genre))
            ->assertInertia(fn (Assert $page) => $page->component('Genres/Show'));
        $this->put(route('genres.update', $genre), ['genre_name' => 'Speculative Fiction'])
            ->assertRedirect(route('genres.index'));

        $this->post(route('publishers.store'), ['publisher_name' => 'Northstar Press'])
            ->assertRedirect(route('publishers.index'));
        $publisher = Publisher::query()->where('publisher_name', 'Northstar Press')->firstOrFail();
        $this->get(route('publishers.show', $publisher))
            ->assertInertia(fn (Assert $page) => $page->component('Publishers/Show'));
        $this->put(route('publishers.update', $publisher), ['publisher_name' => 'Northstar Books'])
            ->assertRedirect(route('publishers.index'));

        $this->post(route('users.store'), [
            'name' => 'Library Assistant',
            'email' => 'assistant@example.test',
            'role_id' => $memberRole->id,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect(route('users.index'));
        $managedUser = User::query()->where('email', 'assistant@example.test')->firstOrFail();
        $this->get(route('users.show', $managedUser))
            ->assertInertia(fn (Assert $page) => $page->component('Users/Show'));
        $this->put(route('users.update', $managedUser), [
            'name' => 'Senior Library Assistant',
            'email' => 'assistant@example.test',
            'role_id' => $memberRole->id,
            'password' => '',
            'password_confirmation' => '',
        ])->assertRedirect(route('users.index'));
        $this->assertDatabaseHas('users', ['id' => $managedUser->id, 'name' => 'Senior Library Assistant']);

        $this->post(route('books.store'), [
            'author_id' => $author->id,
            'publisher_id' => $publisher->id,
            'title' => 'Kindred',
            'isbn' => '9780807083697',
            'edition' => 'First',
            'publication_year' => 1979,
            'language' => 'English',
            'description' => 'A science fiction novel.',
            'total_copies' => 3,
            'genre_ids' => [$genre->id],
        ])->assertRedirect(route('books.index'));
        $book = Book::query()->where('isbn', '9780807083697')->firstOrFail();
        $this->get(route('authors.show', $author))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Authors/Show')
                ->has('author.books', 1)
                ->where('author.books.0.title', 'Kindred'));
        $this->get(route('books.show', $book))
            ->assertInertia(fn (Assert $page) => $page->component('Books/Show'));
        $this->put(route('books.update', $book), [
            'author_id' => $author->id,
            'publisher_id' => $publisher->id,
            'title' => 'Kindred: Revised Edition',
            'isbn' => '9780807083697',
            'language' => 'English',
            'total_copies' => 3,
            'genre_ids' => [$genre->id],
        ])->assertRedirect(route('books.index'));
        $this->assertDatabaseHas('books', ['id' => $book->id, 'title' => 'Kindred: Revised Edition']);

        $this->delete(route('books.destroy', $book))->assertRedirect(route('books.index'));
        $this->delete(route('users.destroy', $managedUser))->assertRedirect(route('users.index'));
        $this->delete(route('publishers.destroy', $publisher))->assertRedirect(route('publishers.index'));
        $this->delete(route('genres.destroy', $genre))->assertRedirect(route('genres.index'));
        $this->delete(route('author-profiles.destroy', $profile))->assertRedirect(route('author-profiles.index'));
        $this->delete(route('authors.destroy', $profileAuthor))->assertRedirect(route('authors.index'));
        $this->delete(route('authors.destroy', $author))->assertRedirect(route('authors.index'));

        $this->assertDatabaseMissing('books', ['id' => $book->id]);
        $this->assertDatabaseMissing('users', ['id' => $managedUser->id]);
    }

    public function test_member_can_manage_own_review_and_complete_borrowing_lifecycle(): void
    {
        $member = $this->userWithRole('Member/Student');
        $admin = $this->userWithRole('Admin/Librarian');
        $book = $this->createBook();

        $this->actingAs($member);
        $this->get(route('books.show', $book))
            ->assertInertia(fn (Assert $page) => $page->component('Books/Show'));
        $this->post(route('reviews.store'), [
            'book_id' => $book->id,
            'stars' => 5,
            'comment' => 'A thoughtful book.',
        ])->assertRedirect(route('books.show', $book));
        $review = $member->reviews()->where('book_id', $book->id)->firstOrFail();
        $this->get(route('reviews.edit', $review))
            ->assertInertia(fn (Assert $page) => $page->component('Reviews/Edit'));
        $this->put(route('reviews.update', $review), [
            'book_id' => $book->id,
            'stars' => 4,
            'comment' => 'Still highly recommended.',
        ])->assertRedirect(route('books.show', $book));
        $this->assertDatabaseHas('reviews', ['id' => $review->id, 'user_id' => $member->id, 'stars' => 4]);

        $this->post(route('borrowing-requests.store'), ['book_id' => $book->id])
            ->assertRedirect();
        $request = BorrowingRequest::query()->where('user_id', $member->id)->where('book_id', $book->id)->firstOrFail();

        $this->actingAs($admin);
        $this->get(route('borrowing-requests.index'))
            ->assertInertia(fn (Assert $page) => $page->component('BorrowingRequests/Index'));
        $this->patch(route('borrowing-requests.approve', $request))->assertRedirect();
        $this->patch(route('borrowing-requests.issue', $request))->assertRedirect();
        $this->assertDatabaseHas('books', ['id' => $book->id, 'available_copies' => 1]);
        $this->patch(route('borrowing-requests.return', $request))->assertRedirect();
        $this->assertDatabaseHas('books', ['id' => $book->id, 'available_copies' => 2]);

        $this->actingAs($member);
        $this->get(route('borrowing-requests.mine'))
            ->assertInertia(fn (Assert $page) => $page->component('BorrowingRequests/MyRequests'));
        $this->delete(route('reviews.destroy', $review))->assertRedirect(route('books.index'));
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_admin_can_search_borrowing_requests_by_member_and_book(): void
    {
        $admin = $this->userWithRole('Admin/Librarian');
        $member = User::factory()->create([
            'role_id' => Role::query()->where('role_name', 'Member/Student')->value('id'),
            'name' => 'Morgan Searchable',
        ]);
        $book = $this->createBook();
        $book->update(['title' => 'Searchable Volume']);
        BorrowingRequest::query()->create([
            'user_id' => $member->id,
            'book_id' => $book->id,
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get(route('borrowing-requests.index', ['search' => 'morgan searchable']))
            ->assertInertia(fn (Assert $page) => $page
                ->component('BorrowingRequests/Index')
                ->where('filters.search', 'morgan searchable')
                ->has('requests.data', 1)
                ->where('requests.data.0.book.title', 'Searchable Volume'));

        $this->get(route('borrowing-requests.index', ['search' => 'searchable volume']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('requests.data', 1)
                ->where('requests.data.0.user.name', 'Morgan Searchable'));
    }

    public function test_deleting_records_with_dependents_returns_a_recoverable_error(): void
    {
        $admin = $this->userWithRole('Admin/Librarian');
        $member = $this->userWithRole('Member/Student');
        $book = $this->createBook();
        $this->actingAs($admin);

        $this->delete(route('authors.destroy', $book->author))
            ->assertRedirect()
            ->assertSessionHas('error');
        $this->delete(route('publishers.destroy', $book->publisher))
            ->assertRedirect()
            ->assertSessionHas('error');

        BorrowingRequest::query()->create([
            'user_id' => $member->id,
            'book_id' => $book->id,
            'status' => 'returned',
            'requested_at' => now(),
        ]);

        $this->delete(route('books.destroy', $book))
            ->assertRedirect()
            ->assertSessionHas('error');
        $this->delete(route('users.destroy', $member))
            ->assertRedirect()
            ->assertSessionHas('error');
    }

    public function test_book_input_is_validated_and_publication_year_cannot_be_in_the_future(): void
    {
        $this->actingAs($this->userWithRole('Admin/Librarian'));
        $author = Author::query()->create(['name' => 'Validation Author']);
        $publisher = Publisher::query()->create(['publisher_name' => 'Validation Publisher']);

        $bookData = [
            'author_id' => $author->id,
            'publisher_id' => $publisher->id,
            'title' => 'Validation Test',
            'isbn' => '978-0-306-40615-7',
            'publication_year' => now()->year,
            'language' => 'English',
            'cover_image' => 'https://example.test/cover.jpg',
            'total_copies' => 1,
        ];

        $this->post(route('books.store'), $bookData)
            ->assertRedirect(route('books.index'));
        $this->assertDatabaseHas('books', [
            'title' => 'Validation Test',
            'publication_year' => now()->year,
        ]);

        $this->post(route('books.store'), [
            ...$bookData,
            'title' => 'Future Publication',
            'publication_year' => now()->year + 1,
        ])->assertSessionHasErrors('publication_year');

        $this->post(route('books.store'), [
            ...$bookData,
            'title' => 'Invalid Cover',
            'cover_image' => 'javascript:alert(1)',
        ])->assertSessionHasErrors('cover_image');

        $this->get(route('books.index', ['search' => ['invalid']]))
            ->assertSessionHasErrors('search');
    }

    private function userWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['role_name' => $roleName]);

        return User::factory()->create(['role_id' => $role->id]);
    }

    private function createBook(): Book
    {
        $author = Author::query()->create(['name' => 'Test Author']);
        $publisher = Publisher::query()->create(['publisher_name' => 'Test Publisher']);

        return Book::query()->create([
            'author_id' => $author->id,
            'publisher_id' => $publisher->id,
            'title' => 'Test Book',
            'language' => 'English',
            'total_copies' => 2,
            'available_copies' => 2,
        ]);
    }
}
