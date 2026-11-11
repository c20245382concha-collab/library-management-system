
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
            return 'border-amber-200 bg-amber-50 text-amber-700';
        case 'approved':
            return 'border-sky-200 bg-sky-50 text-sky-700';
        case 'borrowed':
            return 'border-violet-200 bg-violet-50 text-violet-700';
        case 'returned':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        case 'rejected':
            return 'border-rose-200 bg-rose-50 text-rose-700';
        default:
            return 'border-gray-200 bg-gray-50 text-gray-600';
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
            style: 'bg-[#f7e9e9] text-[#843d4b]',
        },
        {
            label: 'Pending Requests',
            value: pendingCount,
            icon: Clock3,
            style: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Currently Borrowed',
            value: borrowedCount,
            icon: Library,
            style: 'bg-violet-50 text-violet-700',
        },
        {
            label: 'Returned Books',
            value: returnedCount,
            icon: RotateCcw,
            style: 'bg-emerald-50 text-emerald-700',
        },
    ];

    return (
        <AppLayout>
            <Head title="My Borrowing Requests" />

            <main className="min-h-screen bg-[#fbf7f3] px-4 py-7 md:px-8 md:py-10">
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
                                className="rounded-2xl border border-[#eadfda] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-[#927c7c]">
                                        {stat.label}
                                    </p>

                                    <div
                                        className={`flex size-11 items-center justify-center rounded-xl ${stat.style}`}
                                    >
                                        <stat.icon className="size-5" />
                                    </div>
                                </div>

                                <p className="mt-3 font-serif text-3xl font-bold text-[#38252a]">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* Request history */}
                    <section className="overflow-hidden rounded-3xl border border-[#eadfda] bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e7e2] p-5 md:p-7">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b80]">
                                    Your Library Activity
                                </p>

                                <h2 className="mt-1 font-serif text-2xl font-bold text-[#38252a]">
                                    Request History
                                </h2>

                                <p className="mt-1 text-sm text-[#927c7c]">
                                    View the details and current status of your requests.
                                </p>
                            </div>

                            <span className="rounded-full bg-[#f7e9e9] px-4 py-2 text-xs font-semibold text-[#843d4b]">
                                {requests.data.length} Records
                            </span>
                        </div>

                        {requests.data.length > 0 ? (
                            <div className="divide-y divide-[#f0e7e2]">
                                {requests.data.map((item) => (
                                    <article
                                        key={item.id}
                                        className="p-5 transition hover:bg-[#fdfaf8] md:p-7"
                                    >
                                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                            {/* Book information */}
                                            <div className="flex min-w-0 gap-4">
                                                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#f7e9e9] text-[#843d4b]">
                                                    <BookOpen className="size-7" />
                                                </div>

                                                <div className="min-w-0">
                                                    {item.book ? (
                                                        <Link
                                                            href={route('books.show', item.book.id)}
                                                            className="font-serif text-lg font-bold text-[#38252a] transition hover:text-[#843d4b]"
                                                        >
                                                            {item.book.title}
                                                        </Link>
                                                    ) : (
                                                        <h3 className="font-serif text-lg font-bold text-[#38252a]">
                                                            Unknown Book
                                                        </h3>
                                                    )}

                                                    <p className="mt-1 text-sm text-[#927c7c]">
                                                        {item.book?.author?.name ?? 'Unknown author'}
                                                    </p>

                                                    <p className="mt-1 text-xs text-[#a28e8e]">
                                                        {item.book?.publisher?.publisher_name ?? 'Unknown publisher'}
                                                    </p>

                                                    <p className="mt-2 text-xs font-medium text-[#a47b80]">
                                                        Request #{item.id}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Request details */}
                                            <div className="flex flex-wrap items-center gap-5 md:justify-end">
                                                <div className="min-w-[110px]">
                                                    <p className="flex items-center gap-1.5 text-xs text-[#a28e8e]">
                                                        <CalendarDays className="size-3.5" />
                                                        Requested
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-[#493438]">
                                                        {dateLabel(item.requested_at)}
                                                    </p>
                                                </div>

                                                <div className="min-w-[110px]">
                                                    <p className="flex items-center gap-1.5 text-xs text-[#a28e8e]">
                                                        <Clock3 className="size-3.5" />
                                                        Due Date
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-[#493438]">
                                                        {dateLabel(item.due_date)}
                                                    </p>
                                                </div>

                                                <div className="md:min-w-[110px]">
                                                    <p className="mb-2 text-xs text-[#a28e8e]">
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
                                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#f7e9e9] text-[#843d4b]">
                                    <BookOpen className="size-7" />
                                </div>

                                <h3 className="mt-5 font-serif text-xl font-bold text-[#38252a]">
                                    No Borrowing Requests Yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#927c7c]">
                                    You haven't requested any books yet. Explore
                                    the library catalogue and find something to read.
                                </p>

                                <Link
                                    href={route('books.index')}
                                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#843d4b] px-5 text-sm font-semibold text-white transition hover:bg-[#6d303d]"
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
                                className="flex flex-wrap gap-2 border-t border-[#f0e7e2] px-5 py-4 md:px-7"
                            >
                                {requests.links.map((link, index) => (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? route('borrowing-requests.mine')}
                                        preserveScroll
                                        className={`rounded-lg border px-3 py-2 text-sm transition ${link.active
                                            ? 'border-[#843d4b] bg-[#843d4b] text-white'
                                            : 'border-[#eadfda] text-[#725e60] hover:bg-[#fbf7f3]'
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
