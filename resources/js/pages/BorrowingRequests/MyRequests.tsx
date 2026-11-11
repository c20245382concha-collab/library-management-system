import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

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
    return value ? new Date(value).toLocaleDateString() : '—';
}

export default function MyBorrowingRequests({ requests }: { requests: RequestPage }) {
    return (
        <AppLayout>
            <Head title="My Borrowing Requests" />
            <main className="space-y-6 p-4 md:p-6">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div><h1 className="text-2xl font-semibold">My Borrowing Requests</h1><p className="mt-1 text-sm text-muted-foreground">Track request and return dates.</p></div>
                    <Link href={route('books.index')} className="rounded-md border px-4 py-2 text-sm">Browse books</Link>
                </header>
                <div className="overflow-x-auto rounded-md border bg-card">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="border-b bg-muted/40 text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Book</th><th className="px-4 py-3 font-medium">Author</th><th className="px-4 py-3 font-medium">Requested</th><th className="px-4 py-3 font-medium">Due</th><th className="px-4 py-3 font-medium">Status</th></tr></thead>
                        <tbody className="divide-y">
                            {requests.data.map((item) => <tr key={item.id}>
                                <td className="px-4 py-3">{item.book ? <Link className="font-medium hover:underline" href={route('books.show', item.book.id)}>{item.book.title}</Link> : '—'}<span className="block text-xs text-muted-foreground">{item.book?.publisher?.publisher_name}</span></td>
                                <td className="px-4 py-3">{item.book?.author?.name ?? '—'}</td>
                                <td className="px-4 py-3">{dateLabel(item.requested_at)}</td>
                                <td className="px-4 py-3">{dateLabel(item.due_date)}</td>
                                <td className="px-4 py-3"><span className="rounded border px-2 py-1 text-xs capitalize">{item.status}</span></td>
                            </tr>)}
                            {requests.data.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">You have no borrowing requests.</td></tr>}
                        </tbody>
                    </table>
                </div>
                {requests.links && <nav aria-label="Pagination" className="flex flex-wrap gap-1">{requests.links.map((link, index) => <Link key={`${link.label}-${index}`} href={link.url ?? route('borrowing-requests.mine')} preserveScroll className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : ''} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}>{link.label.replace(/&laquo;|&raquo;/g, '').trim()}</Link>)}</nav>}
            </main>
        </AppLayout>
    );
}
