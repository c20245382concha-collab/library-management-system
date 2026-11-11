import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';

type Row = Record<string, unknown>;

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface IndexProps {
    title: string;
    description?: string;
    items: Row[] | { data: Row[]; links?: PaginationLink[] };
    columns: Array<{ key: string; label: string }>;
    indexRoute: string;
    createRoute?: string;
    editRoute?: string;
    showRoute?: string;
    deleteRoute?: string;
    filters?: { search?: string };
}

function rowsFrom(items: IndexProps['items']): Row[] {
    return Array.isArray(items) ? items : items.data;
}

function linksFrom(items: IndexProps['items']): PaginationLink[] {
    return Array.isArray(items) ? [] : (items.links ?? []);
}

function cellValue(row: Row, path: string): string {
    const value = path.split('.').reduce<unknown>((current, key) => {
        if (typeof current !== 'object' || current === null) return undefined;
        return (current as Record<string, unknown>)[key];
    }, row);

    if (value === null || value === undefined || value === '') return '—';
    if (Array.isArray(value)) return value.map(String).join(', ');
    if (typeof value === 'object') return '—';
    return String(value);
}

export default function ResourceIndex({
    title,
    description,
    items,
    columns,
    indexRoute,
    createRoute,
    editRoute,
    showRoute,
    deleteRoute,
    filters,
}: IndexProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const rows = rowsFrom(items);
    const links = linksFrom(items);

    function searchItems(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(route(indexRoute), { search }, { preserveState: true, replace: true });
    }

    function deleteItem(id: unknown) {
        if (typeof id !== 'string' && typeof id !== 'number') return;
        if (deleteRoute && window.confirm(`Delete this ${title.toLowerCase().replace(/s$/, '')}?`)) {
            router.delete(route(deleteRoute, id));
        }
    }

    return (
        <AppLayout>
            <Head title={title} />
            <main className="space-y-6 p-4 md:p-6">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">{title}</h1>
                        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                    </div>
                    {createRoute && (
                        <Link href={route(createRoute)} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                            <Plus className="size-4" /> Add {title.replace(/s$/, '')}
                        </Link>
                    )}
                </header>

                <form onSubmit={searchItems} className="flex max-w-md gap-2">
                    <label className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={`Search ${title.toLowerCase()}`}
                            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
                        />
                    </label>
                    <button className="h-10 rounded-md border px-4 text-sm font-medium" type="submit">Search</button>
                </form>

                <div className="overflow-x-auto rounded-md border bg-card">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="border-b bg-muted/40 text-muted-foreground">
                            <tr>
                                {columns.map((column) => <th key={column.key} className="px-4 py-3 font-medium">{column.label}</th>)}
                                {(showRoute || editRoute || deleteRoute) && <th className="px-4 py-3 text-right font-medium">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rows.map((row, index) => (
                                <tr key={String(row.id ?? index)} className="hover:bg-muted/20">
                                    {columns.map((column) => <td key={column.key} className="px-4 py-3">{cellValue(row, column.key)}</td>)}
                                    {(showRoute || editRoute || deleteRoute) && (
                                        <td className="px-4 py-2">
                                            <div className="flex justify-end gap-1">
                                                {showRoute && <Link aria-label={`View ${title}`} title="View" href={route(showRoute, row.id as string | number)} className="rounded p-2 hover:bg-muted"><Eye className="size-4" /></Link>}
                                                {editRoute && <Link aria-label={`Edit ${title}`} title="Edit" href={route(editRoute, row.id as string | number)} className="rounded p-2 hover:bg-muted"><Pencil className="size-4" /></Link>}
                                                {deleteRoute && <button aria-label={`Delete ${title}`} title="Delete" onClick={() => deleteItem(row.id)} className="rounded p-2 text-destructive hover:bg-muted"><Trash2 className="size-4" /></button>}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-muted-foreground">No records found.</td></tr>}
                        </tbody>
                    </table>
                </div>

                {links.length > 0 && (
                    <nav aria-label="Pagination" className="flex flex-wrap gap-1">
                        {links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? route(indexRoute)}
                                preserveScroll
                                className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                {link.label.replace(/&laquo;|&raquo;/g, '').trim()}
                            </Link>
                        ))}
                    </nav>
                )}
            </main>
        </AppLayout>
    );
}
