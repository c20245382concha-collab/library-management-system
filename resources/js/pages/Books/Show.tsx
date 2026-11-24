
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    BookMarked,
    CalendarDays,
    CheckCircle2,
    Globe,
    Hash,
    Pencil,
    Star,
    Trash2,
    UserRound,
} from 'lucide-react';
import type { FormEvent } from 'react';

interface BookDetails {
    id: number;
    title: string;
    isbn?: string | null;
    edition?: string | null;
    publication_year?: number | null;
    language: string;
    description?: string | null;
    cover_image?: string | null;
    available_copies: number;
    total_copies: number;
    author?: { name: string };
    publisher?: { publisher_name: string };
    genres: Array<{ id: number; genre_name: string }>;
    reviews: Array<{
        id: number;
        user_id: number;
        stars: number;
        comment?: string | null;
        user?: { name: string };
    }>;
}

type Props = {
    book: BookDetails;
    canRequest: boolean;
    canReview: boolean;
    currentUserId: number | null;
};

function getCoverImage(value?: string | null) {
    if (!value) return null;

    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
        return value;
    }

    return `/storage/${value}`;
}

function DetailItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Hash;
    label: string;
    value: string | number;
}) {
    return (
        <div className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                </dt>
                <dd className="mt-1 break-words text-sm font-medium text-card-foreground">
                    {value}
                </dd>
            </div>
        </div>
    );
}

export default function BookShow({
    book,
    canRequest,
    canReview,
    currentUserId,
}: Props) {
    const requestForm = useForm({ book_id: book.id });
    const ownReview = book.reviews.find(
        (review) => review.user_id === currentUserId,
    );

    const coverImage = getCoverImage(book.cover_image);
    const isAvailable = book.available_copies > 0;

    function requestBook(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        requestForm.post(route('borrowing-requests.store'));
    }

    function deleteReview(reviewId: number) {
        if (window.confirm('Are you sure you want to delete your review?')) {
            router.delete(route('reviews.destroy', reviewId));
        }
    }

    return (
        <AppLayout>
            <Head title={book.title} />

            <main className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
                <div className="mx-auto max-w-6xl space-y-8">
                    {/* Breadcrumb */}
                    <Link
                        href={route('books.index')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
                    >
                        <ArrowLeft className="size-4" />
                        Back to book catalogue
                    </Link>

                    {/* Book details */}
                    <section className="overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
                        <div className="grid md:grid-cols-[320px_1fr]">
                            {/* Book cover */}
                            <div className="flex items-center justify-center bg-muted p-8 md:p-10">
                                <div className="relative w-full max-w-[230px]">
                                    <div className="absolute -right-3 -top-3 size-full rounded-2xl border border-border" />

                                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#843d4b] shadow-xl">
                                        {coverImage ? (
                                            <img
                                                src={coverImage}
                                                alt={`Cover of ${book.title}`}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-[#9b5360] to-[#542936] p-6 text-center text-[#fff8f2]">
                                                <BookOpen className="mb-6 size-12 opacity-80" />
                                                <div className="h-px w-12 bg-[#e8c9c5]" />
                                                <p className="mt-6 font-serif text-xl font-semibold leading-tight">
                                                    {book.title}
                                                </p>
                                                <p className="mt-3 text-xs tracking-widest text-[#e8c9c5]">
                                                    ABCL LIBRARY
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 text-center">
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                            ABCL Library Collection
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Main information */}
                            <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
                                <div className="mb-5 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                                        Book Details
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isAvailable
                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-red-500/10 text-red-700 dark:text-red-400'
                                            }`}
                                    >
                                        <span
                                            className={`size-1.5 rounded-full ${isAvailable
                                                ? 'bg-emerald-600'
                                                : 'bg-red-600'
                                                }`}
                                        />
                                        {isAvailable
                                            ? 'Available'
                                            : 'Currently unavailable'}
                                    </span>
                                </div>

                                <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-card-foreground md:text-4xl lg:text-5xl">
                                    {book.title}
                                </h1>

                                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                                    <p>
                                        By{' '}
                                        <span className="font-semibold text-primary">
                                            {book.author?.name ?? 'Unknown author'}
                                        </span>
                                    </p>
                                    <p>
                                        Published by{' '}
                                        <span className="font-medium text-foreground">
                                            {book.publisher?.publisher_name ??
                                                'Unknown publisher'}
                                        </span>
                                    </p>
                                </div>

                                {/* Genres */}
                                {book.genres.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {book.genres.map((genre) => (
                                            <span
                                                key={genre.id}
                                                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
                                            >
                                                {genre.genre_name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Availability panel */}
                                <div className="mt-8 rounded-2xl border border-border bg-background p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Library availability
                                            </p>
                                            <p className="mt-1 font-serif text-3xl font-bold text-primary">
                                                {book.available_copies}
                                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                    / {book.total_copies} copies
                                                </span>
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Copies currently available
                                            </p>
                                        </div>

                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                                            {isAvailable ? (
                                                <CheckCircle2 className="size-6" />
                                            ) : (
                                                <BookMarked className="size-6" />
                                            )}
                                        </div>
                                    </div>

                                    {canRequest && (
                                        <div className="mt-5 border-t border-border pt-5">
                                            <form onSubmit={requestBook}>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        requestForm.processing ||
                                                        !isAvailable
                                                    }
                                                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#843d4b] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6d303d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                                >
                                                    <BookOpen className="size-4" />
                                                    {requestForm.processing
                                                        ? 'Submitting request...'
                                                        : isAvailable
                                                            ? 'Request to borrow'
                                                            : 'Currently unavailable'}
                                                </button>

                                                {requestForm.errors.book_id && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {requestForm.errors.book_id}
                                                    </p>
                                                )}
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Additional information */}
                    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    About this book
                                </p>
                                <h2 className="mt-2 font-serif text-2xl font-bold text-card-foreground">
                                    Description
                                </h2>
                            </div>

                            {book.description ? (
                                <p className="whitespace-pre-line text-sm leading-8 text-muted-foreground">
                                    {book.description}
                                </p>
                            ) : (
                                <p className="text-sm italic text-muted-foreground">
                                    No description is available for this book.
                                </p>
                            )}
                        </div>

                        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Publication information
                            </p>
                            <h2 className="mt-2 font-serif text-2xl font-bold text-card-foreground">
                                Book specifications
                            </h2>

                            <dl className="mt-7 grid gap-6">
                                <DetailItem
                                    icon={Hash}
                                    label="ISBN"
                                    value={book.isbn || 'Not provided'}
                                />
                                <DetailItem
                                    icon={BookMarked}
                                    label="Edition"
                                    value={book.edition || 'Not specified'}
                                />
                                <DetailItem
                                    icon={CalendarDays}
                                    label="Publication year"
                                    value={book.publication_year || 'Not specified'}
                                />
                                <DetailItem
                                    icon={Globe}
                                    label="Language"
                                    value={book.language}
                                />
                                <DetailItem
                                    icon={UserRound}
                                    label="Author"
                                    value={book.author?.name ?? 'Unknown author'}
                                />
                            </dl>
                        </div>
                    </section>

                    {/* Reviews */}
                    <section className="rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-8">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Reader feedback
                                </p>
                                <h2 className="mt-2 font-serif text-2xl font-bold text-card-foreground">
                                    Reviews
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {book.reviews.length}{' '}
                                    {book.reviews.length === 1
                                        ? 'review'
                                        : 'reviews'}{' '}
                                    from library members
                                </p>
                            </div>

                            {canReview && !ownReview && (
                                <Link
                                    href={route('reviews.create', {
                                        book_id: book.id,
                                    })}
                                    className="inline-flex h-10 items-center justify-center rounded-xl border border-[#843d4b] px-4 text-sm font-semibold text-primary transition hover:bg-primary/10"
                                >
                                    Write a review
                                </Link>
                            )}
                        </div>

                        <div className="mt-6">
                            {book.reviews.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {book.reviews.map((review) => (
                                        <article
                                            key={review.id}
                                            className="py-6 first:pt-2 last:pb-0"
                                        >
                                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from(
                                                            { length: 5 },
                                                            (_, index) => (
                                                                <Star
                                                                    key={index}
                                                                    className={`size-4 ${index < review.stars
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'text-muted-foreground/40'
                                                                        }`}
                                                                />
                                                            ),
                                                        )}
                                                        <span className="ml-2 text-sm font-semibold text-foreground">
                                                            {review.stars}/5
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-card-foreground">
                                                        {review.user?.name ??
                                                            'Library Member'}
                                                    </p>
                                                </div>

                                                {canReview &&
                                                    review.user_id ===
                                                    currentUserId && (
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={route(
                                                                    'reviews.edit',
                                                                    review.id,
                                                                )}
                                                                title="Edit review"
                                                                aria-label="Edit review"
                                                                className="flex size-9 items-center justify-center rounded-lg border border-border text-primary transition hover:bg-primary/10"
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                title="Delete review"
                                                                aria-label="Delete review"
                                                                onClick={() =>
                                                                    deleteReview(
                                                                        review.id,
                                                                    )
                                                                }
                                                                className="flex size-9 items-center justify-center rounded-lg border border-border text-red-600 transition hover:bg-red-500/10"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>

                                            {review.comment && (
                                                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                                                    {review.comment}
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-background px-5 py-10 text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Star className="size-5" />
                                    </div>
                                    <h3 className="mt-4 font-serif text-lg font-semibold text-card-foreground">
                                        No reviews yet
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Be the first to share your thoughts about
                                        this book.
                                    </p>

                                    {canReview && (
                                        <Link
                                            href={route('reviews.create', {
                                                book_id: book.id,
                                            })}
                                            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#843d4b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6d303d]"
                                        >
                                            Write the first review
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Bottom navigation */}
                    <div className="pb-4 text-center">
                        <Link
                            href={route('books.index')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-[#542936]"
                        >
                            <ArrowLeft className="size-4" />
                            Return to book catalogue
                        </Link>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
