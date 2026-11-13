import AppLayout from '@/layouts/app-layout';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Check, ChevronDown, FileText, Save } from 'lucide-react';
import { useState, type FormEvent } from 'react';

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

interface ResourceComboboxProps {
    id: string;
    options: FieldOption[];
    value: FormValue;
    placeholder: string;
    inputClass: string;
    required?: boolean;
    onChange: (value: string | number) => void;
}

function ResourceCombobox({ id, options, value, placeholder, inputClass, required, onChange }: ResourceComboboxProps) {
    const [query, setQuery] = useState('');
    const selectedOption = options.find((option) => String(option.value) === String(value)) ?? null;
    const filteredOptions = query === '' ? options : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox
            value={selectedOption}
            nullable
            onClose={() => setQuery('')}
            onChange={(option: FieldOption | null) => {
                onChange(option?.value ?? '');
                setQuery('');
            }}
        >
            <div className="relative">
                <ComboboxInput
                    id={id}
                    className={`${inputClass} h-12 pr-10`}
                    displayValue={(option: FieldOption | null) => option?.label ?? ''}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={placeholder}
                    required={required}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#927c7c] dark:text-[#c2aeb2]">
                    <ChevronDown className="size-4" aria-hidden="true" />
                </ComboboxButton>
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[#eadfda] bg-white py-1 shadow-lg focus:outline-none dark:border-[#4a3a40] dark:bg-[#281f23] dark:shadow-black/40">
                    {filteredOptions.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-[#927c7c] dark:text-[#c2aeb2]">No matching options.</div>
                    ) : (
                        filteredOptions.map((option) => (
                            <ComboboxOption
                                key={option.value}
                                value={option}
                                className="group flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-[#38252a] data-[focus]:bg-[#f7e9e9] data-[focus]:text-[#843d4b] dark:text-[#f0e2e5] dark:data-[focus]:bg-[#4b2d36] dark:data-[focus]:text-[#ffe8ec]"
                            >
                                {option.label}
                                <Check className="invisible size-4 text-[#843d4b] group-data-[selected]:visible dark:text-[#f1b9c3]" />
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    );
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

export default function ResourceForm({ title, indexRoute, storeRoute, updateRoute, recordId, values = {}, fields }: ResourceFormProps) {
    const initialData = Object.fromEntries(fields.map((field) => [field.name, values[field.name] ?? (field.type === 'multi' ? [] : '')])) as Record<
        string,
        FormValue
    >;

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

            <main className="min-h-screen bg-[#fbf7f3] px-4 py-6 md:px-8 md:py-10 dark:bg-[#181316]">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Breadcrumb */}
                    <div className="space-y-4">
                        <Link
                            href={route(indexRoute)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#927c7c] transition hover:text-[#843d4b] dark:text-[#c2aeb2] dark:hover:text-[#f0b8c2]"
                        >
                            <ArrowLeft className="size-4" />
                            Back to {title}
                        </Link>

                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#a47b80] uppercase dark:text-[#d49ca6]">
                                <BookOpen className="size-4" />
                                ABCL Library Management System
                            </div>

                            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#38252a] md:text-4xl dark:text-[#f6eaec]">
                                {editing ? `Edit ${title}` : `Add New ${title}`}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#927c7c] dark:text-[#c2aeb2]">
                                {editing
                                    ? `Update the information below to keep your ${title.toLowerCase()} records accurate and up to date.`
                                    : `Complete the form below to add a new ${title.toLowerCase()} record to your library collection.`}
                            </p>
                        </div>
                    </div>

                    {/* Form card */}
                    <section className="overflow-hidden rounded-[24px] border border-[#eadfda] bg-white shadow-sm dark:border-[#45343a] dark:bg-[#241c20] dark:shadow-black/20">
                        <div className="flex items-center gap-4 bg-[#843d4b] px-6 py-5 text-white md:px-8 dark:bg-[#703744]">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                <FileText className="size-5" />
                            </div>

                            <div>
                                <h2 className="font-serif text-lg font-semibold">{editing ? 'Update information' : 'Record information'}</h2>
                                <p className="mt-0.5 text-xs text-white/70">Fields marked with * are required</p>
                            </div>
                        </div>

                        <form onSubmit={submit}>
                            <div className="space-y-7 p-6 md:p-8">
                                {fields.map((field) => {
                                    const error = form.errors[field.name];
                                    const inputClass = `w-full rounded-xl border bg-[#fdfaf8] px-4 text-sm text-[#38252a] outline-none transition placeholder:text-[#b6a5a2] focus:border-[#843d4b] focus:bg-white focus:ring-2 focus:ring-[#843d4b]/10 dark:bg-[#2b2226] dark:text-[#f6eaec] dark:placeholder:text-[#ad999e] dark:focus:border-[#d98797] dark:focus:bg-[#33272c] dark:focus:ring-[#d98797]/15 ${
                                        error
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400/20'
                                            : 'border-[#eadfda] dark:border-[#4a3a40]'
                                    }`;

                                    return (
                                        <div key={field.name} className="space-y-2.5">
                                            <label
                                                htmlFor={field.name}
                                                className="flex items-center gap-1 text-sm font-semibold text-[#493438] dark:text-[#ead6d9]"
                                            >
                                                {field.label}
                                                {field.required && <span className="text-[#a84e5d] dark:text-[#f09cab]">*</span>}
                                            </label>

                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    id={field.name}
                                                    value={String(form.data[field.name] ?? '')}
                                                    required={field.required}
                                                    placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                                                    onChange={(event) => form.setData(field.name, event.target.value)}
                                                    rows={5}
                                                    className={`${inputClass} min-h-32 resize-y py-3 leading-6`}
                                                />
                                            ) : field.type === 'select' ? (
                                                <ResourceCombobox
                                                    id={field.name}
                                                    options={field.options ?? []}
                                                    value={form.data[field.name] ?? ''}
                                                    placeholder={`Select ${field.label.toLowerCase()}`}
                                                    inputClass={inputClass}
                                                    required={field.required}
                                                    onChange={(value) => form.setData(field.name, value)}
                                                />
                                            ) : field.type === 'multi' ? (
                                                <fieldset
                                                    className={`rounded-2xl border p-4 ${error ? 'border-red-400 dark:border-red-400' : 'border-[#eadfda] dark:border-[#4a3a40]'}`}
                                                >
                                                    <legend className="sr-only">{field.label}</legend>

                                                    {field.options?.length ? (
                                                        <div className="grid gap-2 sm:grid-cols-2">
                                                            {field.options.map((option) => {
                                                                const current = Array.isArray(form.data[field.name])
                                                                    ? (form.data[field.name] as number[])
                                                                    : [];

                                                                const selected = current.includes(Number(option.value));

                                                                return (
                                                                    <label
                                                                        key={option.value}
                                                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                                                                            selected
                                                                                ? 'border-[#843d4b]/40 bg-[#f7e9e9] text-[#843d4b] dark:border-[#b86676]/50 dark:bg-[#492b35] dark:text-[#f4c4cc]'
                                                                                : 'border-transparent bg-[#fdfaf8] text-[#725e60] hover:border-[#eadfda] dark:bg-[#2b2226] dark:text-[#d6c6ca] dark:hover:border-[#4a3a40]'
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selected}
                                                                            onChange={(event) => {
                                                                                const next = event.target.checked
                                                                                    ? [...current, Number(option.value)]
                                                                                    : current.filter((value) => value !== Number(option.value));

                                                                                form.setData(field.name, next);
                                                                            }}
                                                                            className="size-4 accent-[#843d4b] dark:accent-[#d98797]"
                                                                        />

                                                                        <span className="flex-1">{option.label}</span>

                                                                        {selected && <Check className="size-4 dark:text-[#f1b9c3]" />}
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-[#927c7c] dark:text-[#c2aeb2]">No options available.</p>
                                                    )}
                                                </fieldset>
                                            ) : (
                                                <input
                                                    id={field.name}
                                                    type={field.type ?? 'text'}
                                                    value={String(form.data[field.name] ?? '')}
                                                    required={field.required}
                                                    min={field.min}
                                                    max={field.max}
                                                    placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                                                    onChange={(event) => {
                                                        const value = event.target.value;

                                                        form.setData(field.name, field.type === 'number' && value !== '' ? Number(value) : value);
                                                    }}
                                                    className={`${inputClass} h-12`}
                                                />
                                            )}

                                            {error && (
                                                <p className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                                                    {error}
                                                </p>
                                            )}

                                            {!error && field.type === 'multi' && (
                                                <p className="text-xs text-[#a28e8e] dark:text-[#c2aeb2]">Select all that apply.</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Form actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[#f0e7e2] bg-[#fdfaf8] px-6 py-5 sm:flex-row sm:justify-end md:px-8 dark:border-[#45343a] dark:bg-[#21191d]">
                                <Link
                                    href={route(indexRoute)}
                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-[#eadfda] bg-white px-5 text-sm font-semibold text-[#725e60] transition hover:bg-[#fbf7f3] dark:border-[#4a3a40] dark:bg-[#2b2226] dark:text-[#e3d3d7] dark:hover:bg-[#392a30]"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#843d4b] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6d303d] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#a64c5d] dark:hover:bg-[#bd5a6c]"
                                >
                                    <Save className="size-4" />
                                    {form.processing ? 'Saving...' : editing ? 'Save changes' : 'Create record'}
                                </button>
                            </div>
                        </form>
                    </section>

                    <p className="text-center text-xs text-[#a28e8e] dark:text-[#b9a5aa]">ABCL Library Management System · Resource Management</p>
                </div>
            </main>
        </AppLayout>
    );
}
