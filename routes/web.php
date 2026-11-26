
<?php

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\AuthorProfileController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SystemReviewController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Books - View only
    Route::get('/books', [BookController::class, 'index'])
        ->name('books.index');

    Route::get('/books/{book}', [BookController::class, 'show'])
        ->whereNumber('book')
        ->name('books.show');

    /*
    |--------------------------------------------------------------------------
    | System Reviews
    |--------------------------------------------------------------------------
    | Admin, Member, and Student can view and add reviews.
    */

    Route::get('/system-reviews', [SystemReviewController::class, 'index'])
        ->name('system-reviews.index');

    Route::get('/system-reviews/create', [SystemReviewController::class, 'create'])
        ->name('system-reviews.create');

    Route::get('/system-reviews/{systemReview}', [SystemReviewController::class, 'show'])
        ->whereNumber('systemReview')
        ->name('system-reviews.show');

    Route::post('/system-reviews', [SystemReviewController::class, 'store'])
        ->name('system-reviews.store');

    /*
    |--------------------------------------------------------------------------
    | Member / Student Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware(['role:Member/Student'])->group(function () {

        Route::get('/my-borrowing-requests', [BorrowingRequestController::class, 'myRequests'])
            ->name('borrowing-requests.mine');

        Route::post('/borrowing-requests', [BorrowingRequestController::class, 'store'])
            ->name('borrowing-requests.store');

        Route::get('/reviews/create', [ReviewController::class, 'create'])
            ->name('reviews.create');

        Route::post('/reviews', [ReviewController::class, 'store'])
            ->name('reviews.store');

        Route::get('/reviews/{review}/edit', [ReviewController::class, 'edit'])
            ->middleware('can:update,review')
            ->name('reviews.edit');

        Route::put('/reviews/{review}', [ReviewController::class, 'update'])
            ->middleware('can:update,review')
            ->name('reviews.update');

        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])
            ->middleware('can:delete,review')
            ->name('reviews.destroy');
    });
});

/*
|--------------------------------------------------------------------------
| Admin / Librarian Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:Admin/Librarian'])->group(function () {

    // System Reviews - Admin/Librarian management only
    // View and add routes are available to all authenticated users.
    Route::resource('/system-reviews', SystemReviewController::class)
        ->except(['index', 'show', 'create', 'store']);

    // Books - Create, Store, Edit, Update, Delete
    Route::resource('/books', BookController::class)
        ->except(['index', 'show']);

    // Authors
    Route::resource('/authors', AuthorController::class);

    // Author Profiles
    Route::resource('/author-profiles', AuthorProfileController::class);

    // Publishers
    Route::resource('/publishers', PublisherController::class);

    // Genres
    Route::resource('/genres', GenreController::class);

    // Users
    Route::resource('/users', UserController::class);

    /*
    |--------------------------------------------------------------------------
    | Borrowing Requests Management
    |--------------------------------------------------------------------------
    */

    Route::get('/borrowing-requests', [BorrowingRequestController::class, 'index'])
        ->name('borrowing-requests.index');

    Route::patch('/borrowing-requests/{borrowingRequest}/approve', [BorrowingRequestController::class, 'approve'])
        ->name('borrowing-requests.approve');

    Route::patch('/borrowing-requests/{borrowingRequest}/reject', [BorrowingRequestController::class, 'reject'])
        ->name('borrowing-requests.reject');

    Route::patch('/borrowing-requests/{borrowingRequest}/issue', [BorrowingRequestController::class, 'issue'])
        ->name('borrowing-requests.issue');

    Route::patch('/borrowing-requests/{borrowingRequest}/return', [BorrowingRequestController::class, 'returnBook'])
        ->name('borrowing-requests.return');

    // Reviews Management
    Route::get('/reviews', [ReviewController::class, 'index'])
        ->name('reviews.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';