
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import {
    BookOpen,
    CalendarDays,
    Check,
    Clock3,
    RotateCcw,
    Search,
    Send,
    Users,
    X,
} from 'lucide-react';

interface BorrowingItem {
    id: number;
    status: string;
    requested_at?: string;
    due_date?: string | null;
    user?: { name: string; email: string };
    book?: { title: string };
}

interface BorrowingPage {
    data: BorrowingItem[];
    links?: Array<{ url: string | null; label: string; active: boolean }>;
}

interface BorrowingFilters {
    search?: string | null;
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

export default function BorrowingRequestsIndex({
    requests,
    filters,
}: {
    requests: BorrowingPage;
    filters?: BorrowingFilters;
}) {
    const [search, setSearch] = useState(filters?.search ?? '');

    function searchRequests(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            route('borrowing-requests.index'),
            { search: search.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function clearSearch() {
        setSearch('');

        router.get(
            route('borrowing-requests.index'),
            {},
            { preserveState: true, replace: true },
        );
    }

    function transition(
        id: number,
        action: 'approve' | 'reject' | 'issue' | 'return',
    ) {
        const messages = {
            approve: 'Approve this borrowing request?',
            reject: 'Reject this borrowing request?',
            issue: 'Confirm that this book has been issued?',
            return: 'Mark this book as returned?',
        };

        if (window.confirm(messages[action])) {
            router.patch(route(`borrowing-requests.${action}`, id));
        }
    }

    const counts = {
        pending: requests.data.filter((item) => item.status === 'pending').length,
        approved: requests.data.filter((item) => item.status === 'approved').length,
        borrowed: requests.data.filter((item) => item.status === 'borrowed').length,
        returned: requests.data.filter((item) => item.status === 'returned').length,
    };

    const statistics = [
        {
            label: 'Pending Requests',
            value: counts.pending,
            icon: Clock3,
            iconStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
            accent: 'border-l-amber-400',
        },
        {
            label: 'Approved Requests',
            value: counts.approved,
            icon: Check,
            iconStyle: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
            accent: 'border-l-sky-400',
        },
        {
            label: 'Currently Borrowed',
            value: counts.borrowed,
            icon: BookOpen,
            iconStyle: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
            accent: 'border-l-violet-400',
        },
        {
            label: 'Returned Books',
            value: counts.returned,
            icon: RotateCcw,
            iconStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
            accent: 'border-l-emerald-400',
        },
    ];

    function RequestActions({ item }: { item: BorrowingItem }) {
        return (
            <div className="flex items-center gap-2">
                {item.status === 'pending' && (
                    <>
                        <button
                            type="button"
                            title="Approve request"
                            aria-label="Approve request"
                            onClick={() => transition(item.id, 'approve')}
                            className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                        >
                            <Check className="size-4" />
                        </button>

                        <button
                            type="button"
                            title="Reject request"
                            aria-label="Reject request"
                            onClick={() => transition(item.id, 'reject')}
                            className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
                        >
                            <X className="size-4" />
                        </button>
                    </>
                )}

                {item.status === 'approved' && (
                    <button
                        type="button"
                        title="Issue book"
                        aria-label="Issue book"
                        onClick={() => transition(item.id, 'issue')}
                        className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition hover:bg-primary/20"
                    >
                        <Send className="size-4" />
                    </button>
                )}

                {item.status === 'borrowed' && (
                    <button
                        type="button"
                        title="Mark returned"
                        aria-label="Mark returned"
                        onClick={() => transition(item.id, 'return')}
                        className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                    >
                        <RotateCcw className="size-4" />
                    </button>
                )}

                {!['pending', 'approved', 'borrowed'].includes(item.status) && (
                    <span className="text-xs text-muted-foreground">No actions</span>
                )}
            </div>
        );
    }

    return (
        <AppLayout>
            <Head title="Borrowing Requests" />

            <main className="min-h-screen bg-background px-4 py-7 text-foreground md:px-8 md:py-10">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Page heading */}
                    <header className="relative overflow-hidden rounded-3xl bg-[#762f43] px-6 py-8 text-white shadow-lg shadow-[#762f43]/10 md:px-9 md:py-10">
                        <div className="absolute -right-10 -top-20 size-64 rounded-full border-[35px] border-white/5" />
                        <div className="absolute -bottom-24 right-48 size-52 rounded-full bg-[#a65c70]/20 blur-2xl" />

                        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8c5ce]">
                                    <BookOpen className="size-4" />
                                    ABCL Library Management
                                </div>

                                <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
                                    Borrowing Requests
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                                    Review member requests, manage book circulation,
                                    and keep track of borrowing transactions.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                                    <Users className="size-5 text-[#f4dce0]" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {requests.data.length}
                                    </p>
                                    <p className="text-xs text-white/70">
                                        Records on this page
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>


                    {/* Statistics */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statistics.map((stat) => (
                            <div
                                key={stat.label}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(40, 20, 28, 0.78), rgba(40, 20, 28, 0.88)), url('/images/statBg.png')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-white/80">
                                            {stat.label}
                                        </p>

                                        <div
                                            className={`flex size-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                                        >
                                            <stat.icon className="size-5" />
                                        </div>
                                    </div>

                                    <p className="mt-3 font-serif text-3xl font-bold text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </section>


                    {/* Request records */}
                    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        <div className="flex flex-col gap-5 border-b border-border p-5 md:flex-row md:items-center md:justify-between md:p-7">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Circulation Management
                                </p>
                                <h2 className="mt-1 font-serif text-2xl font-bold text-card-foreground">
                                    Request Records
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Review and process borrowing transactions.
                                </p>
                            </div>

                            <form
                                onSubmit={searchRequests}
                                className="flex w-full flex-wrap gap-2 md:max-w-xl"
                            >
                                <label className="relative min-w-0 flex-1">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search member, book, status, or ID..."
                                        aria-label="Search borrowing requests"
                                        className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                                    />
                                </label>

                                <button
                                    type="submit"
                                    className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                                >
                                    Search
                                </button>

                                {filters?.search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="h-11 rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted"
                                    >
                                        Clear
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto lg:block">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Member</th>
                                        <th className="px-6 py-4 font-semibold">Book</th>
                                        <th className="px-6 py-4 font-semibold">Requested</th>
                                        <th className="px-6 py-4 font-semibold">Due Date</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {requests.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-muted/60"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <Users className="size-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-card-foreground">
                                                            {item.user?.name ?? 'Unknown member'}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {item.user?.email ?? '—'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="max-w-[230px] px-6 py-4">
                                                <p className="line-clamp-2 font-medium text-card-foreground">
                                                    {item.book?.title ?? 'Unknown book'}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Request #{item.id}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                                                {dateLabel(item.requested_at)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                                                {dateLabel(item.due_date)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge status={item.status} />
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end">
                                                    <RequestActions item={item} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {requests.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                    <BookOpen className="size-6" />
                                                </div>
                                                <h3 className="mt-4 font-serif text-lg font-semibold text-card-foreground">
                                                    No borrowing requests found
                                                </h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    There are no records matching your search.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile and tablet cards */}
                        <div className="grid gap-3 p-4 lg:hidden">
                            {requests.data.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-2xl border border-border bg-muted/30 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Users className="size-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-card-foreground">
                                                    {item.user?.name ?? 'Unknown member'}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {item.user?.email ?? '—'}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>

                                    <div className="my-4 border-t border-border" />

                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Requested Book
                                    </p>
                                    <p className="mt-1 font-serif text-lg font-semibold text-card-foreground">
                                        {item.book?.title ?? 'Unknown book'}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Request #{item.id}
                                    </p>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <CalendarDays className="size-3.5" />
                                                Requested
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-foreground">
                                                {dateLabel(item.requested_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <CalendarDays className="size-3.5" />
                                                Due Date
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-foreground">
                                                {dateLabel(item.due_date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Request Actions
                                        </span>
                                        <RequestActions item={item} />
                                    </div>
                                </article>
                            ))}

                            {requests.data.length === 0 && (
                                <div className="px-4 py-12 text-center">
                                    <BookOpen className="mx-auto size-9 text-muted-foreground" />
                                    <h3 className="mt-3 font-serif text-lg font-semibold text-card-foreground">
                                        No borrowing requests found
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        There are no records matching your search.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {requests.links && (
                            <nav
                                aria-label="Pagination"
                                className="flex flex-wrap gap-2 border-t border-border px-5 py-4 md:px-6"
                            >
                                {requests.links.map((link, index) => (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? route('borrowing-requests.index')}
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
