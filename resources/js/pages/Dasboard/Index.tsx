
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Users,
    UserRound,
    ClipboardList,
    Clock,
    BookCheck,
    Star,
} from 'lucide-react';

type Props = {
    isAdmin: boolean;
    stats: {
        totalBooks?: number;
        totalMembers?: number;
        totalAuthors?: number;
        totalBorrowingRequests?: number;
        pendingRequests?: number;
        borrowedBooks?: number;
        totalReviews?: number;

        totalRequests?: number;
    };
};

export default function Dashboard({ isAdmin, stats }: Props) {
    const adminCards = [
        {
            title: 'Total Books',
            value: stats.totalBooks ?? 0,
            icon: BookOpen,
            description: 'Books registered in the library',
        },
        {
            title: 'Total Members',
            value: stats.totalMembers ?? 0,
            icon: Users,
            description: 'Registered student accounts',
        },
        {
            title: 'Total Authors',
            value: stats.totalAuthors ?? 0,
            icon: UserRound,
            description: 'Authors in the collection',
        },
        {
            title: 'Borrowing Requests',
            value: stats.totalBorrowingRequests ?? 0,
            icon: ClipboardList,
            description: 'All borrowing requests',
        },
        {
            title: 'Pending Requests',
            value: stats.pendingRequests ?? 0,
            icon: Clock,
            description: 'Requests awaiting approval',
        },
        {
            title: 'Books Borrowed',
            value: stats.borrowedBooks ?? 0,
            icon: BookCheck,
            description: 'Currently borrowed books',
        },
        {
            title: 'Total Reviews',
            value: stats.totalReviews ?? 0,
            icon: Star,
            description: 'Reviews submitted by members',
        },
    ];

    const memberCards = [
        {
            title: 'My Requests',
            value: stats.totalRequests ?? 0,
            icon: ClipboardList,
            description: 'Your borrowing requests',
        },
        {
            title: 'Pending Requests',
            value: stats.pendingRequests ?? 0,
            icon: Clock,
            description: 'Requests awaiting approval',
        },
        {
            title: 'Books Borrowed',
            value: stats.borrowedBooks ?? 0,
            icon: BookCheck,
            description: 'Your currently borrowed books',
        },
        {
            title: 'My Reviews',
            value: stats.totalReviews ?? 0,
            icon: Star,
            description: 'Reviews you have submitted',
        },
    ];

    const cards = isAdmin ? adminCards : memberCards;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {isAdmin
                            ? 'Overview of the ABCL Library Management System.'
                            : 'Welcome to the ABCL Library Management System.'}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="rounded-xl border bg-card p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </p>

                                    <Icon className="size-5 text-muted-foreground" />
                                </div>

                                <div className="mt-3 text-3xl font-bold">
                                    {card.value}
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-xl border bg-card p-6">
                    <h2 className="text-lg font-semibold">
                        {isAdmin ? 'Library Overview' : 'Explore the Library'}
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {isAdmin
                            ? 'Manage the library collection, monitor borrowing activity, and keep track of member accounts.'
                            : 'Browse the available books, submit borrowing requests, and keep track of your borrowed books.'}
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

