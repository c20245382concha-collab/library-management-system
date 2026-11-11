import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Check, RotateCcw, Search, Send, X } from 'lucide-react';

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
    return value ? new Date(value).toLocaleDateString() : '—';
}

export default function BorrowingRequestsIndex({ requests, filters }: { requests: BorrowingPage; filters?: BorrowingFilters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    function searchRequests(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(route('borrowing-requests.index'), { search: search.trim() }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    function transition(id: number, action: 'approve' | 'reject' | 'issue' | 'return') {
        router.patch(route(`borrowing-requests.${action}`, id));
    }

    return (
        <AppLayout>
            <Head title="Borrowing Requests" />
            <main className="space-y-6 p-4 md:p-6">
                <header><h1 className="text-2xl font-semibold">Borrowing Requests</h1><p className="mt-1 text-sm text-muted-foreground">Review requests and track books in circulation.</p></header>
                <form onSubmit={searchRequests} className="flex max-w-xl gap-2">
                    <label className="relative min-w-0 flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Member, book, status, or request ID"
                            aria-label="Search borrowing requests"
                            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
                        />
                    </label>
                    <button type="submit" className="h-10 rounded-md border px-4 text-sm font-medium">Search</button>
                    {filters?.search && <button type="button" onClick={() => {
                        setSearch('');
                        router.get(route('borrowing-requests.index'), {}, { preserveState: true, replace: true });
                    }} className="h-10 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted">Clear</button>}
                </form>
                <div className="overflow-x-auto rounded-md border bg-card">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-b bg-muted/40 text-muted-foreground"><tr>
                            <th className="px-4 py-3 font-medium">Member</th><th className="px-4 py-3 font-medium">Book</th><th className="px-4 py-3 font-medium">Requested</th><th className="px-4 py-3 font-medium">Due</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y">
                            {requests.data.map((item) => <tr key={item.id}>
                                <td className="px-4 py-3">{item.user?.name ?? '—'}<span className="block text-xs text-muted-foreground">{item.user?.email}</span></td>
                                <td className="px-4 py-3">{item.book?.title ?? '—'}</td>
                                <td className="px-4 py-3">{dateLabel(item.requested_at)}</td>
                                <td className="px-4 py-3">{dateLabel(item.due_date)}</td>
                                <td className="px-4 py-3"><span className="rounded border px-2 py-1 text-xs capitalize">{item.status}</span></td>
                                <td className="px-4 py-2"><div className="flex justify-end gap-1">
                                    {item.status === 'pending' && <>
                                        <button title="Approve" aria-label="Approve request" onClick={() => transition(item.id, 'approve')} className="rounded p-2 text-green-700 hover:bg-muted"><Check className="size-4" /></button>
                                        <button title="Reject" aria-label="Reject request" onClick={() => transition(item.id, 'reject')} className="rounded p-2 text-destructive hover:bg-muted"><X className="size-4" /></button>
                                    </>}
                                    {item.status === 'approved' && <button title="Issue book" aria-label="Issue book" onClick={() => transition(item.id, 'issue')} className="rounded p-2 hover:bg-muted"><Send className="size-4" /></button>}
                                    {item.status === 'borrowed' && <button title="Mark returned" aria-label="Mark returned" onClick={() => transition(item.id, 'return')} className="rounded p-2 hover:bg-muted"><RotateCcw className="size-4" /></button>}
                                </div></td>
                            </tr>)}
                            {requests.data.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No borrowing requests yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
                {requests.links && <nav aria-label="Pagination" className="flex flex-wrap gap-1">{requests.links.map((link, index) => <Link key={`${link.label}-${index}`} href={link.url ?? route('borrowing-requests.index')} preserveScroll className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : ''} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}>{link.label.replace(/&laquo;|&raquo;/g, '').trim()}</Link>)}</nav>}
            </main>
        </AppLayout>
    );
}
