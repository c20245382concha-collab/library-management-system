
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    Clock3,
    Library,
    RotateCcw,
} from 'lucide-react';

interface RequestItem {
    id: number;
    status: string;
    requested_at?: string;
    due_date?: string | null;
    book?: {
        id: number;
        title: string;
        author?: { name: string };
        publisher?: { publisher_name: string };
    };
}

interface RequestPage {
    data: RequestItem[];
    links?: Array<{ url: string | null; label: string; active: boolean }>;
}

function dateLabel(value?: string | null): string {
    if (!value) return '—';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
}

function statusStyle(status: string) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300';
        case 'approved':
            return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300';
        case 'borrowed':
            return 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300';
        case 'returned':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300';
        case 'rejected':
            return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300';
        default:
            return 'border-border bg-muted text-muted-foreground';
    }
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${statusStyle(status)}`}
        >
            <span className="mr-2 size-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}

export default function MyBorrowingRequests({
    requests,
}: {
    requests: RequestPage;
}) {
    const pendingCount = requests.data.filter(
        (item) => item.status === 'pending',
    ).length;

    const borrowedCount = requests.data.filter(
        (item) => item.status === 'borrowed',
    ).length;

    const returnedCount = requests.data.filter(
        (item) => item.status === 'returned',
    ).length;

    const statistics = [
        {
            label: 'Total Requests',
            value: requests.data.length,
            icon: BookOpen,
            style: 'bg-primary/10 text-primary',
        },
        {
            label: 'Pending Requests',
            value: pendingCount,
            icon: Clock3,
            style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        },
        {
            label: 'Currently Borrowed',
            value: borrowedCount,
            icon: Library,
            style: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
        },
        {
            label: 'Returned Books',
            value: returnedCount,
            icon: RotateCcw,
            style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        },
    ];

    return (
        <AppLayout>
            <Head title="My Borrowing Requests" />

            <main className="min-h-screen bg-background px-4 py-7 text-foreground md:px-8 md:py-10">
                <div className="mx-auto max-w-6xl space-y-8">
                    {/* Hero */}
                    <header className="relative overflow-hidden rounded-3xl bg-[#762f43] px-6 py-8 text-white shadow-lg shadow-[#762f43]/10 md:px-9 md:py-10">
                        <div className="absolute -right-10 -top-20 size-64 rounded-full border-[35px] border-white/5" />
                        <div className="absolute -bottom-24 right-48 size-52 rounded-full bg-[#a65c70]/20 blur-2xl" />

                        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8c5ce]">
                                    <Library className="size-4" />
                                    ABCL Library
                                </div>

                                <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
                                    My Borrowing Requests
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                                    Keep track of your book requests, borrowing
                                    progress, and return schedules all in one place.
                                </p>
                            </div>

                            <Link
                                href={route('books.index')}
                                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f4e7e4] px-5 text-sm font-semibold text-[#762f43] transition hover:bg-white"
                            >
                                <BookOpen className="size-4" />
                                Browse Books
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </header>

                    {/* Statistics */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statistics.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </p>

                                    <div
                                        className={`flex size-11 items-center justify-center rounded-xl ${stat.style}`}
                                    >
                                        <stat.icon className="size-5" />
                                    </div>
                                </div>

                                <p className="mt-3 font-serif text-3xl font-bold text-card-foreground">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* Request history */}
                    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5 md:p-7">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Your Library Activity
                                </p>

                                <h2 className="mt-1 font-serif text-2xl font-bold text-card-foreground">
                                    Request History
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    View the details and current status of your requests.
                                </p>
                            </div>

                            <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                                {requests.data.length} Records
                            </span>
                        </div>

                        {requests.data.length > 0 ? (
                            <div className="divide-y divide-border">
                                {requests.data.map((item) => (
                                    <article
                                        key={item.id}
                                        className="p-5 transition hover:bg-muted/50 md:p-7"
                                    >
                                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                            {/* Book information */}
                                            <div className="flex min-w-0 gap-4">
                                                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                    <BookOpen className="size-7" />
                                                </div>

                                                <div className="min-w-0">
                                                    {item.book ? (
                                                        <Link
                                                            href={route('books.show', item.book.id)}
                                                            className="font-serif text-lg font-bold text-card-foreground transition hover:text-primary"
                                                        >
                                                            {item.book.title}
                                                        </Link>
                                                    ) : (
                                                        <h3 className="font-serif text-lg font-bold text-card-foreground">
                                                            Unknown Book
                                                        </h3>
                                                    )}

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {item.book?.author?.name ?? 'Unknown author'}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {item.book?.publisher?.publisher_name ?? 'Unknown publisher'}
                                                    </p>

                                                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                                                        Request #{item.id}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Request details */}
                                            <div className="flex flex-wrap items-center gap-5 md:justify-end">
                                                <div className="min-w-[110px]">
                                                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <CalendarDays className="size-3.5" />
                                                        Requested
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                                        {dateLabel(item.requested_at)}
                                                    </p>
                                                </div>

                                                <div className="min-w-[110px]">
                                                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Clock3 className="size-3.5" />
                                                        Due Date
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                                        {dateLabel(item.due_date)}
                                                    </p>
                                                </div>

                                                <div className="md:min-w-[110px]">
                                                    <p className="mb-2 text-xs text-muted-foreground">
                                                        Current Status
                                                    </p>
                                                    <StatusBadge status={item.status} />
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <BookOpen className="size-7" />
                                </div>

                                <h3 className="mt-5 font-serif text-xl font-bold text-card-foreground">
                                    No Borrowing Requests Yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                                    You haven't requested any books yet. Explore
                                    the library catalogue and find something to read.
                                </p>

                                <Link
                                    href={route('books.index')}
                                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                                >
                                    Explore the Collection
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {requests.links && requests.data.length > 0 && (
                            <nav
                                aria-label="Pagination"
                                className="flex flex-wrap gap-2 border-t border-border px-5 py-4 md:px-7"
                            >
                                {requests.links.map((link, index) => (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? route('borrowing-requests.mine')}
                                        preserveScroll
                                        className={`rounded-lg border px-3 py-2 text-sm transition ${link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border text-muted-foreground hover:bg-muted'
                                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    >
                                        {link.label.replace(/&laquo;|&raquo;/g, '').trim()}
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
