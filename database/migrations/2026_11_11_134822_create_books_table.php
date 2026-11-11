<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();

            $table->foreignId('author_id')
                ->constrained('authors')
                ->restrictOnDelete();

            $table->foreignId('publisher_id')
                ->constrained('publishers')
                ->restrictOnDelete();

            $table->string('title');
            $table->string('isbn', 20)->nullable()->unique();
            $table->string('edition', 50)->nullable();
            $table->unsignedSmallInteger('publication_year')->nullable();
            $table->string('language', 50)->default('English');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();

            $table->unsignedInteger('total_copies')->default(1);
            $table->unsignedInteger('available_copies')->default(1);

            $table->timestamps();

            $table->index('title');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
