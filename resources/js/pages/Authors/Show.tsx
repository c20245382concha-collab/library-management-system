import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

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
            <main className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Link href={route('authors.index')} className="text-sm text-muted-foreground hover:text-foreground">Authors /</Link>
                        <h1 className="mt-2 text-2xl font-semibold">{author.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Link title="Edit author" aria-label="Edit author" href={route('authors.edit', author.id)} className="inline-flex size-10 items-center justify-center rounded-md border hover:bg-muted"><Pencil className="size-4" /></Link>
                        <button title="Delete author" aria-label="Delete author" onClick={deleteAuthor} className="inline-flex size-10 items-center justify-center rounded-md border text-destructive hover:bg-muted"><Trash2 className="size-4" /></button>
                    </div>
                </header>

                <section className="space-y-2 rounded-md border bg-card p-5">
                    <h2 className="text-lg font-semibold">Biography</h2>
                    <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {author.profile?.bio || 'No biography has been added.'}
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Books by {author.name}</h2>
                    {author.books.length ? (
                        <ul className="divide-y rounded-md border bg-card">
                            {author.books.map((book) => (
                                <li key={book.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                                    <Link href={route('books.show', book.id)} className="font-medium hover:underline">{book.title}</Link>
                                    {book.publication_year && <span className="text-sm text-muted-foreground">{book.publication_year}</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="rounded-md border bg-card px-4 py-6 text-sm text-muted-foreground">No books have been added for this author.</p>
                    )}
                </section>
            </main>
        </AppLayout>
    );
}
