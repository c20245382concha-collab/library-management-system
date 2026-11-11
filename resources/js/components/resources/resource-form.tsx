import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

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
    const initialData = Object.fromEntries(fields.map((field) => [
        field.name,
        values[field.name] ?? (field.type === 'multi' ? [] : ''),
    ])) as Record<string, FormValue>;
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
            <main className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
                <header>
                    <Link href={route(indexRoute)} className="text-sm text-muted-foreground hover:text-foreground">{title} /</Link>
                    <h1 className="mt-2 text-2xl font-semibold">{editing ? `Edit ${title}` : `Add ${title}`}</h1>
                </header>

                <form onSubmit={submit} className="space-y-5 rounded-md border bg-card p-5 md:p-6">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <label htmlFor={field.name} className="text-sm font-medium">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.name}
                                    value={String(form.data[field.name] ?? '')}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    onChange={(event) => form.setData(field.name, event.target.value)}
                                    rows={5}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    id={field.name}
                                    value={String(form.data[field.name] ?? '')}
                                    required={field.required}
                                    onChange={(event) => form.setData(field.name, Number(event.target.value))}
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                >
                                    <option value="">Select {field.label.toLowerCase()}</option>
                                    {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                            ) : field.type === 'multi' ? (
                                <fieldset className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
                                    <legend className="sr-only">{field.label}</legend>
                                    {field.options?.map((option) => {
                                        const selected = (form.data[field.name] as number[]).includes(Number(option.value));
                                        return (
                                            <label key={option.value} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={(event) => {
                                                        const current = form.data[field.name] as number[];
                                                        const next = event.target.checked
                                                            ? [...current, Number(option.value)]
                                                            : current.filter((value) => value !== Number(option.value));
                                                        form.setData(field.name, next);
                                                    }}
                                                />
                                                {option.label}
                                            </label>
                                        );
                                    })}
                                </fieldset>
                            ) : (
                                <input
                                    id={field.name}
                                    type={field.type ?? 'text'}
                                    value={String(form.data[field.name] ?? '')}
                                    required={field.required}
                                    min={field.min}
                                    max={field.max}
                                    placeholder={field.placeholder}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        form.setData(field.name, field.type === 'number' && value !== '' ? Number(value) : value);
                                    }}
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                />
                            )}
                            {form.errors[field.name] && <p className="text-sm text-destructive">{form.errors[field.name]}</p>}
                        </div>
                    ))}

                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Link href={route(indexRoute)} className="inline-flex h-10 items-center rounded-md border px-4 text-sm">Cancel</Link>
                        <button type="submit" disabled={form.processing} className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">
                            {form.processing ? 'Saving…' : editing ? 'Save changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </main>
        </AppLayout>
    );
}
