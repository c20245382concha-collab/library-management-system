
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';

type Row = Record<string, unknown>;

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface ResourceIndexProps {
    title: string;
    description?: string;
    items: Row[] | { data: Row[]; links?: PaginationLink[] };
    columns: Array<{ key: string; label: string }>;
    indexRoute: string;
    createRoute?: string;
    editRoute?: string;
    showRoute?: string;
    showLabel?: string;
    deleteRoute?: string;
    filters?: { search?: string };
}

function rowsFrom(items: ResourceIndexProps['items']): Row[] {
    return Array.isArray(items) ? items : items.data;
}

function linksFrom(items: ResourceIndexProps['items']): PaginationLink[] {
    return Array.isArray(items) ? [] : (items.links ?? []);
}

function getValue(row: Row, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
        if (typeof current !== 'object' || current === null) {
            return undefined;
        }

        return (current as Record<string, unknown>)[key];
    }, row);
}

function cellValue(row: Row, path: string): string {
    const value = getValue(row, path);

    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'object' && item !== null) {
                    const record = item as Record<string, unknown>;
                    return String(record.genre_name ?? record.name ?? '');
                }

                return String(item);
            })
            .filter(Boolean)
            .join(', ');
    }

    if (typeof value === 'object') {
        return '—';
    }

    if (
        path === 'profile.bio' ||
        path === 'author_profile.bio' ||
        path === 'bio'
    ) {
        const biography = String(value);

        return biography.length > 100
            ? `${biography.slice(0, 100).trim()}...`
            : biography;
    }

    return String(value);
}

function getCoverImage(value: unknown): string | null {
    if (typeof value !== 'string' || !value.trim()) {
        return null;
    }

    if (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('/')
    ) {
        return value;
    }

    return `/storage/${value}`;
}

function formatAvailability(row: Row): {
    label: string;
    available: boolean;
} {
    const availableCopies = Number(row.available_copies ?? 0);

    return availableCopies > 0
        ? {
            label: `${availableCopies} ${availableCopies === 1 ? 'copy' : 'copies'} available`,
            available: true,
        }
        : {
            label: 'Currently unavailable',
            available: false,
        };
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
    showLabel,
    deleteRoute,
    filters,
}: ResourceIndexProps) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const rows = rowsFrom(items);
    const links = linksFrom(items);

    const isBookCatalogue =
        title.toLowerCase().includes('book') ||
        rows.some(
            (row) =>
                'cover_image' in row ||
                'available_copies' in row,
        );

    function searchItems(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            route(indexRoute),
            { search },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function deleteItem(id: unknown) {
        if (typeof id !== 'string' && typeof id !== 'number') {
            return;
        }

        const resourceName = title.toLowerCase().replace(/s$/, '');

        if (
            deleteRoute &&
            window.confirm(`Delete this ${resourceName}?`)
        ) {
            router.delete(route(deleteRoute, id));
        }
    }

    function ActionButtons({ row }: { row: Row }) {
        return (
            <div className="flex items-center gap-1">
                {showRoute && (
                    <Link
                        aria-label={showLabel ?? `View ${title}`}
                        title={showLabel ?? 'View'}
                        href={route(
                            showRoute,
                            row.id as string | number,
                        )}
                        className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                    >
                        <Eye className="size-4" />
                    </Link>
                )}

                {editRoute && (
                    <Link
                        aria-label={`Edit ${title}`}
                        title="Edit"
                        href={route(
                            editRoute,
                            row.id as string | number,
                        )}
                        className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                    >
                        <Pencil className="size-4" />
                    </Link>
                )}

                {deleteRoute && (
                    <button
                        type="button"
                        aria-label={`Delete ${title}`}
                        title="Delete"
                        onClick={() => deleteItem(row.id)}
                        className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <AppLayout>
            <Head title={title} />

            <main className="min-h-screen space-y-7 bg-background p-4 text-foreground transition-colors duration-300 sm:p-6 lg:p-8">

                {/* Page Heading */}
                <header className="relative overflow-hidden rounded-[2rem] bg-[#541F32] px-6 py-8 text-white shadow-sm sm:px-9 sm:py-10">
                    <div className="absolute -right-10 -top-16 size-52 rounded-full border-[30px] border-white/5" />
                    <div className="absolute -bottom-24 right-36 size-48 rounded-full bg-[#A3264B]/30 blur-2xl" />

                    <div className="relative flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F4C9D2]">
                                ABCL Library
                            </p>

                            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl">
                                {isBookCatalogue
                                    ? 'Explore the Collection'
                                    : title}
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                                {description ??
                                    (isBookCatalogue
                                        ? 'Discover stories, knowledge, and new perspectives from our library collection.'
                                        : `Manage and organize your library ${title.toLowerCase()}.`)}
                            </p>
                        </div>

                        {createRoute && (
                            <Link
                                href={route(createRoute)}
                                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#FCE9ED] px-5 text-sm font-semibold text-[#541F32] transition hover:bg-white"
                            >
                                <Plus className="size-4" />
                                Add {title.replace(/s$/, '')}
                            </Link>
                        )}
                    </div>
                </header>

                {/* Search and Section Heading */}
                <section className="space-y-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                Library Catalogue
                            </p>

                            <h2 className="mt-1 font-serif text-2xl text-foreground sm:text-3xl">
                                {isBookCatalogue
                                    ? 'Find your next read'
                                    : `Browse ${title}`}
                            </h2>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {rows.length}{' '}
                            {rows.length === 1 ? 'result' : 'results'} on
                            this page
                        </p>
                    </div>

                    <form
                        onSubmit={searchItems}
                        className="flex w-full max-w-2xl gap-2"
                    >
                        <label className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                maxLength={255}
                                placeholder={`Search ${title.toLowerCase()}...`}
                                className="h-12 w-full rounded-2xl border border-input bg-card pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                            />
                        </label>

                        <button
                            type="submit"
                            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                            <Search className="size-4 sm:hidden" />
                            <span className="hidden sm:inline">
                                Search
                            </span>
                        </button>
                    </form>
                </section>

                {/* Book Catalogue */}
                {isBookCatalogue ? (
                    <section>
                        {rows.length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {rows.map((row, index) => {
                                    const image = getCoverImage(
                                        row.cover_image,
                                    );

                                    const availability =
                                        formatAvailability(row);

                                    const genres = Array.isArray(row.genres)
                                        ? row.genres
                                            .map((genre) => {
                                                if (
                                                    typeof genre === 'object' &&
                                                    genre !== null
                                                ) {
                                                    return String(
                                                        (
                                                            genre as Record<
                                                                string,
                                                                unknown
                                                            >
                                                        ).genre_name ?? '',
                                                    );
                                                }

                                                return '';
                                            })
                                            .filter(Boolean)
                                        : [];

                                    return (
                                        <article
                                            key={String(row.id ?? index)}
                                            className="group flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            {/* Book Cover */}
                                            <div className="relative flex h-64 items-center justify-center overflow-hidden bg-muted p-6">
                                                {image ? (
                                                    <img
                                                        src={image}
                                                        alt={`Cover of ${String(row.title ?? 'book')}`}
                                                        className="h-full max-w-[65%] object-contain shadow-xl transition duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-[65%] flex-col items-center justify-between border border-[#D9B8C0] bg-[#541F32] p-5 text-center text-[#FCE9ED] shadow-xl">
                                                        <div className="h-1 w-9 bg-[#DFAAB8]" />

                                                        <div>
                                                            <BookOpen className="mx-auto size-8 opacity-70" />
                                                            <p className="mt-4 font-serif text-xl leading-tight">
                                                                {String(
                                                                    row.title ??
                                                                    'Library Book',
                                                                )}
                                                            </p>
                                                        </div>

                                                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
                                                            ABCL Library
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Availability Badge */}
                                                <div className="absolute right-3 top-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-semibold shadow-sm ${availability.available
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                            }`}
                                                    >
                                                        <CheckCircle2 className="size-3" />
                                                        {availability.available
                                                            ? 'Available'
                                                            : 'Unavailable'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Book Details */}
                                            <div className="flex flex-1 flex-col p-5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {genres
                                                        .slice(0, 2)
                                                        .map((genre) => (
                                                            <span
                                                                key={genre}
                                                                className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground"
                                                            >
                                                                {genre}
                                                            </span>
                                                        ))}
                                                </div>

                                                <h3 className="mt-3 line-clamp-2 font-serif text-xl leading-snug text-card-foreground">
                                                    {String(
                                                        row.title ??
                                                        'Untitled Book',
                                                    )}
                                                </h3>

                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {row.author &&
                                                        typeof row.author === 'object'
                                                        ? `By ${String((row.author as Record<string, unknown>).name ?? 'Unknown author')}`
                                                        : 'Author information unavailable'}
                                                </p>

                                                <div className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                                                    <p>
                                                        Publisher:{' '}
                                                        <span className="font-medium text-foreground">
                                                            {row.publisher &&
                                                                typeof row.publisher === 'object'
                                                                ? String(
                                                                    (
                                                                        row.publisher as Record<
                                                                            string,
                                                                            unknown
                                                                        >
                                                                    ).publisher_name ??
                                                                    '—',
                                                                )
                                                                : '—'}
                                                        </span>
                                                    </p>

                                                    <p>
                                                        Publication year:{' '}
                                                        <span className="font-medium text-foreground">
                                                            {String(
                                                                row.publication_year ??
                                                                '—',
                                                            )}
                                                        </span>
                                                    </p>

                                                    <p>
                                                        {availability.label}
                                                    </p>
                                                </div>

                                                {/* Card Actions */}
                                                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
                                                    {showRoute ? (
                                                        <Link
                                                            href={route(
                                                                showRoute,
                                                                row.id as string | number,
                                                            )}
                                                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-75"
                                                        >
                                                            View details
                                                            <ArrowRight className="size-4" />
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            Book details
                                                        </span>
                                                    )}

                                                    <ActionButtons row={row} />
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty Book Catalogue */
                            <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
                                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                                    <BookOpen className="size-7" />
                                </div>

                                <h3 className="mt-5 font-serif text-2xl text-foreground">
                                    No books found
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Try another search or check back later
                                    for new additions.
                                </p>
                            </div>
                        )}
                    </section>
                ) : (
                    /* Generic Resource Table */
                    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="border-b border-border bg-muted text-muted-foreground">
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column.key}
                                                className="px-5 py-4 font-semibold"
                                            >
                                                {column.label}
                                            </th>
                                        ))}

                                        {(showRoute || editRoute || deleteRoute) && (
                                            <th className="px-5 py-4 text-right font-semibold">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {rows.map((row, index) => (
                                        <tr
                                            key={String(row.id ?? index)}
                                            className="transition hover:bg-accent/50"
                                        >
                                            {columns.map((column) => (
                                                <td
                                                    key={column.key}
                                                    className="px-5 py-4 text-card-foreground"
                                                >
                                                    {cellValue(row, column.key)}
                                                </td>
                                            ))}

                                            {(showRoute || editRoute || deleteRoute) && (
                                                <td className="px-5 py-3">
                                                    <div className="flex justify-end">
                                                        <ActionButtons row={row} />
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}

                                    {rows.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={
                                                    columns.length +
                                                    (showRoute || editRoute || deleteRoute
                                                        ? 1
                                                        : 0)
                                                }
                                                className="px-5 py-16 text-center text-muted-foreground"
                                            >
                                                No records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Pagination */}
                {links.length > 0 && (
                    <nav
                        aria-label="Pagination"
                        className="flex flex-wrap items-center justify-center gap-2 pt-2"
                    >
                        {links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? route(indexRoute)}
                                preserveScroll
                                className={`flex min-h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${link.active
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card text-muted-foreground hover:border-primary hover:bg-accent hover:text-accent-foreground'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            >
                                {link.label
                                    .replace(/&laquo;|&raquo;/g, '')
                                    .trim()}
                            </Link>
                        ))}
                    </nav>
                )}
            </main>
        </AppLayout>
    );
}
