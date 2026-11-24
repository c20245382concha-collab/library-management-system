
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, CalendarDays, Pencil, Trash2, UserRound } from 'lucide-react';

interface Author {
    id: number;
    name: string;
    profile?: { bio: string | null } | null;
    books: Array<{
        id: number;
        title: string;
        publication_year: number | null;
    }>;
}

export default function AuthorShow({ author }: { author: Author }) {
    function deleteAuthor() {
        if (window.confirm(`Delete ${author.name}?`)) {
            router.delete(route('authors.destroy', author.id));
        }
    }

    return (
        <AppLayout>
            <Head title={author.name} />

            <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8">
                <div className="mx-auto max-w-5xl space-y-8">
                    <Link
                        href={route('authors.index')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Authors
                    </Link>

                    {/* Author header */}
                    <section className="relative overflow-hidden rounded-3xl bg-[#762f43] p-7 text-white shadow-lg shadow-[#762f43]/10 md:p-10">
                        <div className="absolute -right-12 -top-16 size-64 rounded-full border-[35px] border-white/5" />
                        <div className="absolute -bottom-24 right-32 size-56 rounded-full bg-[#a65c70]/20 blur-2xl" />

                        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
                            <div className="flex items-center gap-5">
                                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 md:size-24">
                                    <UserRound className="size-10 text-[#f4dce0] md:size-12" />
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#e8c5ce]">
                                        Author Profile
                                    </p>
                                    <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-5xl">
                                        {author.name}
                                    </h1>
                                    <p className="mt-2 text-sm text-white/70">
                                        Author in the ABCL Library collection
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={route('authors.edit', author.id)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#f4e7e4] px-4 py-2.5 text-sm font-semibold text-[#762f43] transition hover:bg-white"
                                >
                                    <Pencil className="size-4" />
                                    Edit
                                </Link>

                                <button
                                    type="button"
                                    onClick={deleteAuthor}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Overview */}
                    <div className="grid gap-6 md:grid-cols-[1fr_280px]">
                        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
                                    <UserRound className="size-5" />
                                </div>
                                <div>
                                    <h2 className="font-serif text-xl font-semibold text-card-foreground">
                                        About the Author
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Biography and background
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-muted p-5">
                                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                                    {author.profile?.bio ||
                                        'No biography has been added for this author yet.'}
                                </p>
                            </div>
                        </section>

                        <section className="flex flex-col justify-between rounded-2xl border border-border bg-muted p-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Library Collection
                                </p>
                                <div className="mt-5 flex items-center gap-3">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                                        <BookOpen className="size-6" />
                                    </div>
                                    <div>
                                        <p className="font-serif text-3xl font-bold text-primary">
                                            {author.books.length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {author.books.length === 1 ? 'Book listed' : 'Books listed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-sm leading-6 text-muted-foreground">
                                Explore the books written by this author and available in the library catalogue.
                            </p>
                        </section>
                    </div>

                    {/* Books */}
                    <section className="space-y-4">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Author's Collection
                                </p>
                                <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                                    Books by {author.name}
                                </h2>
                            </div>

                            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-primary">
                                {author.books.length} {author.books.length === 1 ? 'Book' : 'Books'}
                            </span>
                        </div>

                        {author.books.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {author.books.map((book, index) => (
                                    <Link
                                        key={book.id}
                                        href={route('books.show', book.id)}
                                        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                                    >
                                        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#762f43] text-white shadow-sm">
                                            <BookOpen className="size-7" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                                Book {String(index + 1).padStart(2, '0')}
                                            </p>
                                            <h3 className="line-clamp-2 font-serif text-lg font-semibold text-card-foreground transition group-hover:text-primary">
                                                {book.title}
                                            </h3>

                                            {book.publication_year && (
                                                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <CalendarDays className="size-3.5" />
                                                    {book.publication_year}
                                                </p>
                                            )}
                                        </div>

                                        <span className="text-xl text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary">
                                            →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                    <BookOpen className="size-7" />
                                </div>
                                <h3 className="mt-4 font-serif text-lg font-semibold text-card-foreground">
                                    No books yet
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    No books have been added for this author.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
