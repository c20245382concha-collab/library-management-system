import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

type RecordData = Record<string, unknown>;

export interface ResourceShowProps {
    title: string;
    item: RecordData;
    columns: Array<{ key: string; label: string }>;
    indexRoute: string;
    editRoute?: string;
    deleteRoute?: string;
}

function valueAt(record: RecordData, path: string): string {
    const value = path.split('.').reduce<unknown>((current, key) => {
        if (typeof current !== 'object' || current === null) return undefined;
        return (current as Record<string, unknown>)[key];
    }, record);

    if (value === null || value === undefined || value === '') return '—';
    if (Array.isArray(value)) return value.map(String).join(', ');
    if (typeof value === 'object') return '—';
    return String(value);
}

export default function ResourceShow({ title, item, columns, indexRoute, editRoute, deleteRoute }: ResourceShowProps) {
    function deleteRecord() {
        if (deleteRoute && window.confirm(`Delete this ${title.toLowerCase()}?`)) {
            router.delete(route(deleteRoute, item.id as string | number));
        }
    }

    return (
        <AppLayout>
            <Head title={title} />
            <main className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Link href={route(indexRoute)} className="text-sm text-muted-foreground hover:text-foreground">{title} /</Link>
                        <h1 className="mt-2 text-2xl font-semibold">{title} details</h1>
                    </div>
                    <div className="flex gap-2">
                        {editRoute && <Link title="Edit" aria-label={`Edit ${title}`} href={route(editRoute, item.id as string | number)} className="inline-flex size-10 items-center justify-center rounded-md border hover:bg-muted"><Pencil className="size-4" /></Link>}
                        {deleteRoute && <button title="Delete" aria-label={`Delete ${title}`} onClick={deleteRecord} className="inline-flex size-10 items-center justify-center rounded-md border text-destructive hover:bg-muted"><Trash2 className="size-4" /></button>}
                    </div>
                </header>
                <dl className="grid gap-x-8 rounded-md border bg-card p-5 sm:grid-cols-2">
                    {columns.map((column) => (
                        <div key={column.key} className="border-b py-4 last:border-b-0 sm:even:border-b-0">
                            <dt className="text-sm text-muted-foreground">{column.label}</dt>
                            <dd className="mt-1 whitespace-pre-line break-words text-sm">{valueAt(item, column.key)}</dd>
                        </div>
                    ))}
                </dl>
            </main>
        </AppLayout>
    );
}
