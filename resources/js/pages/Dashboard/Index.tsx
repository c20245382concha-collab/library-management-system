import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BookCheck, BookOpen, ClipboardList, Clock3, Star, Users } from 'lucide-react';

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

export default function Dashboard({ isAdmin, userName, stats }: DashboardProps) {
    const metrics = isAdmin
        ? [
              { label: 'Books in catalogue', value: stats.totalBooks, icon: BookOpen },
              { label: 'Library members', value: stats.totalMembers, icon: Users },
              { label: 'Pending requests', value: stats.pendingRequests, icon: Clock3 },
              { label: 'Books currently borrowed', value: stats.borrowedBooks, icon: BookCheck },
          ]
        : [
              { label: 'My requests', value: stats.totalRequests, icon: ClipboardList },
              { label: 'Awaiting approval', value: stats.pendingRequests, icon: Clock3 },
              { label: 'Books currently borrowed', value: stats.borrowedBooks, icon: BookCheck },
              { label: 'Reviews written', value: stats.totalReviews, icon: Star },
          ];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <main className="space-y-8 p-4 md:p-6">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
                    <div>
                        <p className="text-sm font-medium uppercase text-muted-foreground">Library management</p>
                        <h1 className="mt-2 text-3xl font-semibold">Welcome, {userName}</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {isAdmin ? 'Your library operations at a glance.' : 'Your reading and borrowing activity at a glance.'}
                        </p>
                    </div>
                    <Link href={route('books.index')} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                        <BookOpen className="size-4" /> Browse books
                    </Link>
                </header>

                <section aria-labelledby="activity-heading" className="space-y-4">
                    <h2 id="activity-heading" className="text-lg font-semibold">Activity</h2>
                    <div className="grid gap-0 border-y sm:grid-cols-2 xl:grid-cols-4">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <div key={metric.label} className={`flex min-h-28 items-center gap-4 py-5 ${index > 0 ? 'border-t sm:border-l sm:border-t-0' : ''} ${index > 1 ? 'xl:border-t-0' : ''} px-4`}>
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"><Icon className="size-5 text-muted-foreground" /></span>
                                    <div className="min-w-0">
                                        <p className="text-2xl font-semibold tabular-nums">{metric.value ?? 0}</p>
                                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section aria-labelledby="actions-heading" className="space-y-4">
                    <h2 id="actions-heading" className="text-lg font-semibold">Quick actions</h2>
                    <div className="grid gap-x-8 sm:grid-cols-2">
                        {isAdmin ? (
                            <>
                                <Link href={route('borrowing-requests.index')} className="flex items-center justify-between border-t py-4 text-sm hover:text-primary">
                                    <span><span className="block font-medium">Review borrowing requests</span><span className="mt-1 block text-muted-foreground">{stats.pendingRequests ?? 0} waiting for review</span></span>
                                    <ClipboardList className="size-5" />
                                </Link>
                                <Link href={route('books.create')} className="flex items-center justify-between border-t py-4 text-sm hover:text-primary">
                                    <span><span className="block font-medium">Add a book</span><span className="mt-1 block text-muted-foreground">Expand the library catalogue</span></span>
                                    <BookOpen className="size-5" />
                                </Link>
                                <Link href={route('users.index')} className="flex items-center justify-between border-t py-4 text-sm hover:text-primary">
                                    <span><span className="block font-medium">Manage members</span><span className="mt-1 block text-muted-foreground">View and update accounts</span></span>
                                    <Users className="size-5" />
                                </Link>
                                <Link href={route('reviews.index')} className="flex items-center justify-between border-t py-4 text-sm hover:text-primary">
                                    <span><span className="block font-medium">Review feedback</span><span className="mt-1 block text-muted-foreground">Read member reviews</span></span>
                                    <Star className="size-5" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('borrowing-requests.mine')} className="flex items-center justify-between border-t py-4 text-sm hover:text-primary">
                                    <span><span className="block font-medium">View my requests</span><span className="mt-1 block text-muted-foreground">Check status and due dates</span></span>
                                    <ClipboardList className="size-5" />
                                </Link>
                                <Link href={route('books.index')} className="flex items-center justify-between border-t py-4 text-sm hover:text-primary">
                                    <span><span className="block font-medium">Explore the catalogue</span><span className="mt-1 block text-muted-foreground">Find your next book</span></span>
                                    <BookOpen className="size-5" />
                                </Link>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
