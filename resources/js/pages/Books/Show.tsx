import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, Pencil, Star, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';

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

export default function BookShow({ book, canRequest, canReview, currentUserId }: { book: BookDetails; canRequest: boolean; canReview: boolean; currentUserId: number | null }) {
    const requestForm = useForm({ book_id: book.id });
    const ownReview = book.reviews.find((review) => review.user_id === currentUserId);

    function requestBook(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        requestForm.post(route('borrowing-requests.store'));
    }

    return (
        <AppLayout>
            <Head title={book.title} />
            <main className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
                <Link href={route('books.index')} className="text-sm text-muted-foreground hover:text-foreground">Books /</Link>
                <section className="grid gap-8 md:grid-cols-[220px_1fr]">
                    <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md border bg-muted/40">
                        {book.cover_image ? <img src={book.cover_image} alt={`Cover of ${book.title}`} className="size-full object-cover" /> : <BookOpen className="size-12 text-muted-foreground" />}
                    </div>
                    <div className="space-y-5">
                        <div>
                            <h1 className="text-3xl font-semibold">{book.title}</h1>
                            <p className="mt-2 text-muted-foreground">{book.author?.name ?? 'Unknown author'} · {book.publisher?.publisher_name ?? 'Unknown publisher'}</p>
                        </div>
                        <dl className="grid grid-cols-2 gap-4 border-y py-4 text-sm sm:grid-cols-3">
                            <div><dt className="text-muted-foreground">ISBN</dt><dd className="mt-1">{book.isbn || '—'}</dd></div>
                            <div><dt className="text-muted-foreground">Edition</dt><dd className="mt-1">{book.edition || '—'}</dd></div>
                            <div><dt className="text-muted-foreground">Published</dt><dd className="mt-1">{book.publication_year || '—'}</dd></div>
                            <div><dt className="text-muted-foreground">Language</dt><dd className="mt-1">{book.language}</dd></div>
                            <div><dt className="text-muted-foreground">Availability</dt><dd className="mt-1">{book.available_copies} of {book.total_copies}</dd></div>
                            <div><dt className="text-muted-foreground">Genres</dt><dd className="mt-1">{book.genres.map((genre) => genre.genre_name).join(', ') || '—'}</dd></div>
                        </dl>
                        {book.description && <p className="whitespace-pre-line text-sm leading-6">{book.description}</p>}
                        {canRequest && (
                            <form onSubmit={requestBook} className="flex flex-wrap items-center gap-3">
                                <button disabled={requestForm.processing || book.available_copies < 1} className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50">
                                    {book.available_copies > 0 ? 'Request to borrow' : 'Currently unavailable'}
                                </button>
                                {requestForm.errors.book_id && <p className="text-sm text-destructive">{requestForm.errors.book_id}</p>}
                            </form>
                        )}
                    </div>
                </section>

                <section className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold">Reviews</h2>
                        {canReview && !ownReview && <Link href={route('reviews.create', { book_id: book.id })} className="rounded-md border px-3 py-2 text-sm">Write a review</Link>}
                    </div>
                    {book.reviews.length ? book.reviews.map((review) => (
                        <article key={review.id} className="border-b py-4 last:border-b-0">
                            <div className="flex items-center gap-2 text-sm font-medium"><Star className="size-4 text-amber-500" /> {review.stars}/5 <span className="font-normal text-muted-foreground">by {review.user?.name ?? 'Member'}</span></div>
                            {review.comment && <p className="mt-2 whitespace-pre-line text-sm">{review.comment}</p>}
                            {canReview && review.user_id === currentUserId && <div className="mt-2 flex gap-2">
                                <Link title="Edit review" aria-label="Edit review" href={route('reviews.edit', review.id)} className="rounded p-2 hover:bg-muted"><Pencil className="size-4" /></Link>
                                <button title="Delete review" aria-label="Delete review" onClick={() => window.confirm('Delete your review?') && router.delete(route('reviews.destroy', review.id))} className="rounded p-2 text-destructive hover:bg-muted"><Trash2 className="size-4" /></button>
                            </div>}
                        </article>
                    )) : <p className="text-sm text-muted-foreground">No reviews yet.</p>}
                </section>
            </main>
        </AppLayout>
    );
}
