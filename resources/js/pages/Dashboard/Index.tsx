
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookCheck,
    BookOpen,
    ClipboardList,
    Clock3,
    Plus,
    Star,
    Users,
} from 'lucide-react';

interface DashboardStats {
    totalBooks?: number;
    totalMembers?: number;
    totalAuthors?: number;
    totalBorrowingRequests?: number;
    pendingRequests?: number;
    borrowedBooks?: number;
    totalReviews?: number;
    totalRequests?: number;
}

interface DashboardProps {
    isAdmin: boolean;
    userName: string;
    stats: DashboardStats;
}

export default function Dashboard({
    isAdmin,
    userName,
    stats,
}: DashboardProps) {
    const metrics = isAdmin
        ? [
            {
                label: 'Books in catalogue',
                value: stats.totalBooks,
                icon: BookOpen,
                note: 'Available library titles',
            },
            {
                label: 'Library members',
                value: stats.totalMembers,
                icon: Users,
                note: 'Registered accounts',
            },
            {
                label: 'Pending requests',
                value: stats.pendingRequests,
                icon: Clock3,
                note: 'Waiting for review',
            },
            {
                label: 'Books borrowed',
                value: stats.borrowedBooks,
                icon: BookCheck,
                note: 'Currently on loan',
            },
        ]
        : [
            {
                label: 'My requests',
                value: stats.totalRequests,
                icon: ClipboardList,
                note: 'Your borrowing activity',
            },
            {
                label: 'Awaiting approval',
                value: stats.pendingRequests,
                icon: Clock3,
                note: 'Requests under review',
            },
            {
                label: 'Books borrowed',
                value: stats.borrowedBooks,
                icon: BookCheck,
                note: 'Currently on loan',
            },
            {
                label: 'Reviews written',
                value: stats.totalReviews,
                icon: Star,
                note: 'Your shared feedback',
            },
        ];

    const actions = isAdmin
        ? [
            {
                title: 'Review borrowing requests',
                description: `${stats.pendingRequests ?? 0} requests waiting for review`,
                href: route('borrowing-requests.index'),
                icon: ClipboardList,
                label: 'Manage requests',
            },
            {
                title: 'Add a new book',
                description: 'Expand your library collection',
                href: route('books.create'),
                icon: Plus,
                label: 'Add book',
            },
            {
                title: 'Manage members',
                description: 'View and update user accounts',
                href: route('users.index'),
                icon: Users,
                label: 'View members',
            },
            {
                title: 'Member reviews',
                description: 'Read feedback from your readers',
                href: route('reviews.index'),
                icon: Star,
                label: 'View reviews',
            },
        ]
        : [
            {
                title: 'My borrowing requests',
                description: 'Check your request status and due dates',
                href: route('borrowing-requests.mine'),
                icon: ClipboardList,
                label: 'View requests',
            },
            {
                title: 'Explore the catalogue',
                description: 'Discover a book for your next read',
                href: route('books.index'),
                icon: BookOpen,
                label: 'Browse books',
            },
        ];

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <main className="min-h-screen space-y-8 bg-[#FFF9F6] p-4 text-[#481D2A] sm:p-6 lg:p-8">
                {/* Welcome banner */}
                <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#541F32] px-6 py-9 text-white shadow-sm sm:px-9 sm:py-11">
                    <div className="absolute -right-12 -top-20 -z-10 size-64 rounded-full border-[35px] border-white/5" />
                    <div className="absolute -bottom-28 right-36 -z-10 size-64 rounded-full bg-[#A3264B]/30 blur-2xl" />

                    <div className="relative max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F4C9D2]">
                            ABCL Library Management System
                        </p>

                        <h1 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                            Welcome back, {userName}.
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                            {isAdmin
                                ? 'Keep your library running smoothly. Here is an overview of your collection and daily operations.'
                                : 'Your next great read might be waiting for you. Keep track of your borrowing activity and explore the collection.'}
                        </p>

                        <Link
                            href={route('books.index')}
                            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FCE9ED] px-5 py-3 text-sm font-semibold text-[#541F32] transition hover:bg-white"
                        >
                            <BookOpen className="size-4" />
                            Explore the catalogue
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="absolute bottom-0 right-8 hidden h-52 w-36 rotate-6 rounded-t-xl border border-white/20 bg-[#FCE9ED] p-3 shadow-2xl sm:block lg:right-24">
                        <div className="flex h-full flex-col justify-between border border-[#A3264B]/20 p-3 text-[#541F32]">
                            <div>
                                <div className="h-1 w-8 bg-[#A3264B]" />
                                <p className="mt-4 font-serif text-xl leading-tight">
                                    Stories
                                    <br />
                                    live here.
                                </p>
                            </div>
                            <div>
                                <div className="h-px w-full bg-[#A3264B]/30" />
                                <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.2em]">
                                    ABCL Library
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section aria-labelledby="overview-heading" className="space-y-4">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A3264B]">
                                At a glance
                            </p>
                            <h2
                                id="overview-heading"
                                className="mt-1 font-serif text-2xl sm:text-3xl"
                            >
                                {isAdmin ? 'Library overview' : 'Your activity'}
                            </h2>
                        </div>
                        <p className="text-sm text-[#8D7078]">
                            {isAdmin ? 'Your library statistics' : 'Your reading summary'}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon;

                            return (
                                <article
                                    key={metric.label}
                                    className="group rounded-2xl border border-[#F0DDE1] bg-white p-5 shadow-[0_4px_20px_rgba(84,31,50,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(84,31,50,0.09)]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-[#8D7078]">
                                                {metric.label}
                                            </p>
                                            <p className="mt-3 font-serif text-4xl text-[#481D2A]">
                                                {metric.value ?? 0}
                                            </p>
                                        </div>

                                        <span
                                            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${index % 2 === 0
                                                ? 'bg-[#FCE9ED] text-[#A3264B]'
                                                : 'bg-[#F8F0E9] text-[#805A43]'
                                                }`}
                                        >
                                            <Icon className="size-5" />
                                        </span>
                                    </div>

                                    <p className="mt-4 border-t border-[#F3E8E9] pt-3 text-xs text-[#A18A90]">
                                        {metric.note}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Quick actions */}
                <section aria-labelledby="actions-heading" className="space-y-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A3264B]">
                            Make it happen
                        </p>
                        <h2
                            id="actions-heading"
                            className="mt-1 font-serif text-2xl sm:text-3xl"
                        >
                            Quick actions
                        </h2>
                        <p className="mt-1 text-sm text-[#8D7078]">
                            {isAdmin
                                ? 'Manage your library from one convenient place.'
                                : 'Pick up where you left off.'}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {actions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="group flex items-center justify-between gap-4 rounded-2xl border border-[#F0DDE1] bg-white p-5 shadow-[0_4px_20px_rgba(84,31,50,0.03)] transition hover:border-[#D8AAB6] hover:bg-[#FFFCFB] hover:shadow-md"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FCE9ED] text-[#A3264B] transition group-hover:bg-[#541F32] group-hover:text-white">
                                            <Icon className="size-5" />
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block font-semibold text-[#541F32]">
                                                {action.title}
                                            </span>
                                            <span className="mt-1 block text-sm text-[#9A8289]">
                                                {action.description}
                                            </span>
                                        </span>
                                    </div>

                                    <ArrowRight className="size-5 shrink-0 text-[#B98A98] transition group-hover:translate-x-1 group-hover:text-[#A3264B]" />
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Closing note */}
                <section className="rounded-2xl border border-[#EBD5D9] bg-[#FCEFF1] px-6 py-5">
                    <p className="font-serif text-lg text-[#541F32]">
                        “A library is a place where stories find their readers.”
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[#A17D87]">
                        ABCL Library
                    </p>
                </section>
            </main>
        </AppLayout>
    );
}
