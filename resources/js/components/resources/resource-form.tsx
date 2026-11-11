
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Check,
    ChevronRight,
    FileText,
    Save,
} from 'lucide-react';
import type { FormEvent } from 'react';

type FormValue = string | number | number[];

interface FieldOption {
    value: string | number;
    label: string;
}

interface Field {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multi';
    required?: boolean;
    min?: number;
    max?: number;
    placeholder?: string;
    options?: FieldOption[];
}

export interface ResourceFormProps {
    title: string;
    indexRoute: string;
    storeRoute: string;
    updateRoute?: string;
    recordId?: number | string;
    values?: Record<string, FormValue | null | undefined>;
    fields: Field[];
}

export default function ResourceForm({
    title,
    indexRoute,
    storeRoute,
    updateRoute,
    recordId,
    values = {},
    fields,
}: ResourceFormProps) {
    const initialData = Object.fromEntries(
        fields.map((field) => [
            field.name,
            values[field.name] ?? (field.type === 'multi' ? [] : ''),
        ]),
    ) as Record<string, FormValue>;

    const form = useForm<Record<string, FormValue>>(initialData);
    const editing = recordId !== undefined && updateRoute !== undefined;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (editing) {
            form.put(route(updateRoute, recordId));
        } else {
            form.post(route(storeRoute));
        }
    }

    return (
        <AppLayout>
            <Head title={title} />

            <main className="min-h-screen bg-[#fbf7f3] px-4 py-6 md:px-8 md:py-10">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Breadcrumb */}
                    <div className="space-y-4">
                        <Link
                            href={route(indexRoute)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#927c7c] transition hover:text-[#843d4b]"
                        >
                            <ArrowLeft className="size-4" />
                            Back to {title}
                        </Link>

                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a47b80]">
                                <BookOpen className="size-4" />
                                ABCL Library Management System
                            </div>

                            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#38252a] md:text-4xl">
                                {editing ? `Edit ${title}` : `Add New ${title}`}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#927c7c]">
                                {editing
                                    ? `Update the information below to keep your ${title.toLowerCase()} records accurate and up to date.`
                                    : `Complete the form below to add a new ${title.toLowerCase()} record to your library collection.`}
                            </p>
                        </div>
                    </div>

                    {/* Form card */}
                    <section className="overflow-hidden rounded-[24px] border border-[#eadfda] bg-white shadow-sm">
                        <div className="flex items-center gap-4 bg-[#843d4b] px-6 py-5 text-white md:px-8">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                <FileText className="size-5" />
                            </div>

                            <div>
                                <h2 className="font-serif text-lg font-semibold">
                                    {editing ? 'Update information' : 'Record information'}
                                </h2>
                                <p className="mt-0.5 text-xs text-white/70">
                                    Fields marked with * are required
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit}>
                            <div className="space-y-7 p-6 md:p-8">
                                {fields.map((field, index) => {
                                    const error = form.errors[field.name];
                                    const inputClass = `w-full rounded-xl border bg-[#fdfaf8] px-4 text-sm text-[#38252a] outline-none transition placeholder:text-[#b6a5a2] focus:border-[#843d4b] focus:bg-white focus:ring-2 focus:ring-[#843d4b]/10 ${error
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                        : 'border-[#eadfda]'
                                        }`;

                                    return (
                                        <div
                                            key={field.name}
                                            className="space-y-2.5"
                                        >
                                            <label
                                                htmlFor={field.name}
                                                className="flex items-center gap-1 text-sm font-semibold text-[#493438]"
                                            >
                                                {field.label}
                                                {field.required && (
                                                    <span className="text-[#a84e5d]">*</span>
                                                )}
                                            </label>

                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    id={field.name}
                                                    value={String(
                                                        form.data[field.name] ?? '',
                                                    )}
                                                    required={field.required}
                                                    placeholder={
                                                        field.placeholder ??
                                                        `Enter ${field.label.toLowerCase()}`
                                                    }
                                                    onChange={(event) =>
                                                        form.setData(
                                                            field.name,
                                                            event.target.value,
                                                        )
                                                    }
                                                    rows={5}
                                                    className={`${inputClass} min-h-32 resize-y py-3 leading-6`}
                                                />
                                            ) : field.type === 'select' ? (
                                                <div className="relative">
                                                    <select
                                                        id={field.name}
                                                        value={String(
                                                            form.data[field.name] ?? '',
                                                        )}
                                                        required={field.required}
                                                        onChange={(event) =>
                                                            form.setData(
                                                                field.name,
                                                                event.target.value === ''
                                                                    ? ''
                                                                    : Number(event.target.value),
                                                            )
                                                        }
                                                        className={`${inputClass} h-12 appearance-none pr-10`}
                                                    >
                                                        <option value="">
                                                            Select {field.label.toLowerCase()}
                                                        </option>

                                                        {field.options?.map((option) => (
                                                            <option
                                                                key={option.value}
                                                                value={option.value}
                                                            >
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <ChevronRight className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 rotate-90 text-[#927c7c]" />
                                                </div>
                                            ) : field.type === 'multi' ? (
                                                <fieldset
                                                    className={`rounded-2xl border p-4 ${error
                                                        ? 'border-red-400'
                                                        : 'border-[#eadfda]'
                                                        }`}
                                                >
                                                    <legend className="sr-only">
                                                        {field.label}
                                                    </legend>

                                                    {field.options?.length ? (
                                                        <div className="grid gap-2 sm:grid-cols-2">
                                                            {field.options.map((option) => {
                                                                const current = Array.isArray(
                                                                    form.data[field.name],
                                                                )
                                                                    ? (form.data[field.name] as number[])
                                                                    : [];

                                                                const selected = current.includes(
                                                                    Number(option.value),
                                                                );

                                                                return (
                                                                    <label
                                                                        key={option.value}
                                                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${selected
                                                                            ? 'border-[#843d4b]/40 bg-[#f7e9e9] text-[#843d4b]'
                                                                            : 'border-transparent bg-[#fdfaf8] text-[#725e60] hover:border-[#eadfda]'
                                                                            }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selected}
                                                                            onChange={(event) => {
                                                                                const next = event.target.checked
                                                                                    ? [...current, Number(option.value)]
                                                                                    : current.filter(
                                                                                        (value) =>
                                                                                            value !==
                                                                                            Number(option.value),
                                                                                    );

                                                                                form.setData(
                                                                                    field.name,
                                                                                    next,
                                                                                );
                                                                            }}
                                                                            className="size-4 accent-[#843d4b]"
                                                                        />

                                                                        <span className="flex-1">
                                                                            {option.label}
                                                                        </span>

                                                                        {selected && (
                                                                            <Check className="size-4" />
                                                                        )}
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-[#927c7c]">
                                                            No options available.
                                                        </p>
                                                    )}
                                                </fieldset>
                                            ) : (
                                                <input
                                                    id={field.name}
                                                    type={field.type ?? 'text'}
                                                    value={String(
                                                        form.data[field.name] ?? '',
                                                    )}
                                                    required={field.required}
                                                    min={field.min}
                                                    max={field.max}
                                                    placeholder={
                                                        field.placeholder ??
                                                        `Enter ${field.label.toLowerCase()}`
                                                    }
                                                    onChange={(event) => {
                                                        const value = event.target.value;

                                                        form.setData(
                                                            field.name,
                                                            field.type === 'number' &&
                                                                value !== ''
                                                                ? Number(value)
                                                                : value,
                                                        );
                                                    }}
                                                    className={`${inputClass} h-12`}
                                                />
                                            )}

                                            {error && (
                                                <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                    {error}
                                                </p>
                                            )}

                                            {!error &&
                                                field.type === 'multi' && (
                                                    <p className="text-xs text-[#a28e8e]">
                                                        Select all that apply.
                                                    </p>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Form actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[#f0e7e2] bg-[#fdfaf8] px-6 py-5 sm:flex-row sm:justify-end md:px-8">
                                <Link
                                    href={route(indexRoute)}
                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-[#eadfda] bg-white px-5 text-sm font-semibold text-[#725e60] transition hover:bg-[#fbf7f3]"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#843d4b] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6d303d] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="size-4" />
                                    {form.processing
                                        ? 'Saving...'
                                        : editing
                                            ? 'Save changes'
                                            : 'Create record'}
                                </button>
                            </div>
                        </form>
                    </section>

                    <p className="text-center text-xs text-[#a28e8e]">
                        ABCL Library Management System · Resource Management
                    </p>
                </div>
            </main>
        </AppLayout>
    );
}
