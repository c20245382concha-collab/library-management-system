<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\AuthorProfileController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/books', [BookController::class, 'index'])
        ->name('books.index');

    Route::get('/books/{book}', [BookController::class, 'show'])
        ->whereNumber('book')
        ->name('books.show');

    Route::get('/my-borrowing-requests', [BorrowingRequestController::class, 'myRequests'])
        ->middleware('role:Member/Student')
        ->name('borrowing-requests.mine');

    Route::post('/borrowing-requests', [BorrowingRequestController::class, 'store'])
        ->middleware('role:Member/Student')
        ->name('borrowing-requests.store');

    Route::get('/reviews/create', [ReviewController::class, 'create'])
        ->middleware('role:Member/Student')
        ->name('reviews.create');

    Route::post('/reviews', [ReviewController::class, 'store'])
        ->middleware('role:Member/Student')
        ->name('reviews.store');

    Route::get('/reviews/{review}/edit', [ReviewController::class, 'edit'])
        ->middleware(['role:Member/Student', 'can:update,review'])
        ->name('reviews.edit');

    Route::put('/reviews/{review}', [ReviewController::class, 'update'])
        ->middleware(['role:Member/Student', 'can:update,review'])
        ->name('reviews.update');

    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])
        ->middleware(['role:Member/Student', 'can:delete,review'])
        ->name('reviews.destroy');
});

Route::middleware(['auth', 'role:Admin/Librarian'])->group(function () {
    Route::resource('/books', BookController::class)
        ->except(['index', 'show']);
    Route::resource('/authors', AuthorController::class);
    Route::resource('/author-profiles', AuthorProfileController::class);
    Route::resource('/publishers', PublisherController::class);
    Route::resource('/genres', GenreController::class);
    Route::resource('/users', UserController::class);

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

    Route::get('/reviews', [ReviewController::class, 'index'])
        ->name('reviews.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
