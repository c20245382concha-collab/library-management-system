
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    FileText,
    Pencil,
    Trash2,
} from 'lucide-react';

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

    if (Array.isArray(value)) {
        return value
            .map((entry) => {
                if (typeof entry === 'object' && entry !== null) {
                    const object = entry as Record<string, unknown>;
                    return String(
                        object.name ??
                        object.title ??
                        object.genre_name ??
                        object.publisher_name ??
                        object.id ??
                        '',
                    );
                }

                return String(entry);
            })
            .filter(Boolean)
            .join(', ') || '—';
    }

    if (typeof value === 'object') return '—';

    return String(value);
}

function formatLabel(label: string) {
    return label.replace(/_/g, ' ');
}

export default function ResourceShow({
    title,
    item,
    columns,
    indexRoute,
    editRoute,
    deleteRoute,
}: ResourceShowProps) {
    const recordId = item.id as string | number;

    function deleteRecord() {
        if (
            deleteRoute &&
            window.confirm(`Delete this ${title.toLowerCase()}?`)
        ) {
            router.delete(route(deleteRoute, recordId));
        }
    }

    return (
        <AppLayout>
            <Head title={`${title} Details`} />

            <main className="min-h-screen bg-[#fbf7f3] px-4 py-8 md:px-8">
                <div className="mx-auto max-w-5xl space-y-8">
                    <Link
                        href={route(indexRoute)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#806b68] transition hover:text-[#762f43]"
                    >
                        <ArrowLeft className="size-4" />
                        Back to {title}
                    </Link>

                    {/* Header */}
                    <section className="relative overflow-hidden rounded-3xl bg-[#762f43] p-7 text-white shadow-lg shadow-[#762f43]/10 md:p-10">
                        <div className="absolute -right-12 -top-16 size-64 rounded-full border-[35px] border-white/5" />
                        <div className="absolute -bottom-24 right-32 size-56 rounded-full bg-[#a65c70]/20 blur-2xl" />

                        <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-5">
                                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 md:size-20">
                                    <FileText className="size-8 text-[#f4dce0] md:size-10" />
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#e8c5ce]">
                                        Library Management
                                    </p>

                                    <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-5xl">
                                        {title} Details
                                    </h1>

                                    <p className="mt-2 text-sm text-white/70">
                                        View and manage this {title.toLowerCase()} record.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {editRoute && (
                                    <Link
                                        href={route(editRoute, recordId)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#f4e7e4] px-4 py-2.5 text-sm font-semibold text-[#762f43] transition hover:bg-white"
                                    >
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                )}

                                {deleteRoute && (
                                    <button
                                        type="button"
                                        onClick={deleteRecord}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        <Trash2 className="size-4" />
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Record overview */}
                    <section className="overflow-hidden rounded-2xl border border-[#eadfda] bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-[#f0e7e2] px-6 py-5 md:px-8">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-[#f7e9e9] text-[#762f43]">
                                <BookOpen className="size-5" />
                            </div>

                            <div>
                                <h2 className="font-serif text-xl font-semibold text-[#422d31]">
                                    Record Information
                                </h2>
                                <p className="text-xs text-[#9b8582]">
                                    Complete details and related information
                                </p>
                            </div>
                        </div>

                        <dl className="grid gap-x-10 px-6 py-2 sm:grid-cols-2 md:px-8">
                            {columns.map((column, index) => {
                                const value = valueAt(item, column.key);
                                const isEmpty = value === '—';

                                return (
                                    <div
                                        key={column.key}
                                        className={`min-w-0 border-b border-[#f0e7e2] py-5 ${index === columns.length - 1
                                            ? 'sm:border-b-0'
                                            : ''
                                            }`}
                                    >
                                        <dt className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#a17c7d]">
                                            {index === 0 ? (
                                                <CalendarDays className="size-3.5" />
                                            ) : (
                                                <span className="size-1.5 rounded-full bg-[#c99ba4]" />
                                            )}
                                            {formatLabel(column.label)}
                                        </dt>

                                        <dd
                                            className={`whitespace-pre-line break-words text-sm leading-7 ${isEmpty
                                                ? 'italic text-[#b7a8a4]'
                                                : 'font-medium text-[#514044]'
                                                }`}
                                        >
                                            {value}
                                        </dd>
                                    </div>
                                );
                            })}
                        </dl>
                    </section>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eadfda] bg-[#f4e7e4] px-6 py-5">
                        <div>
                            <p className="font-serif text-base font-semibold text-[#762f43]">
                                {title} Record
                            </p>
                            <p className="mt-1 text-xs text-[#806b68]">
                                Review the information above or return to the list.
                            </p>
                        </div>

                        <Link
                            href={route(indexRoute)}
                            className="rounded-xl border border-[#d8bdba] bg-white px-4 py-2.5 text-sm font-semibold text-[#762f43] transition hover:bg-[#fbf7f3]"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
