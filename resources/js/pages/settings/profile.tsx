
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: auth.user.name,
            email: auth.user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Settings" />

            <SettingsLayout>
                <div className="mx-auto w-full max-w-4xl space-y-8 pb-10">

                    {/* Page Header */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#762f43] p-6 text-white shadow-sm sm:p-8">
                        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[24px] border-white/5" />
                        <div className="absolute -bottom-20 right-28 h-48 w-48 rounded-full bg-white/5" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                                <UserRound className="h-7 w-7" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-white/70">
                                    Account preferences
                                </p>
                                <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
                                    Profile Settings
                                </h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/75">
                                    Manage your personal information and keep
                                    your library account details up to date.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <section className="overflow-hidden rounded-2xl border border-[#eadfda] bg-white shadow-sm">
                        <div className="border-b border-[#f0e7e2] bg-[#fcf8f5] px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7e9e9] text-[#762f43]">
                                    <UserRound className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-serif text-lg font-semibold text-[#492b32]">
                                        Personal Information
                                    </h2>
                                    <p className="text-sm text-[#927b7d]">
                                        Update your name and email address.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-6 sm:p-8">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="font-medium text-[#573b40]"
                                >
                                    Full Name
                                </Label>

                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a68c8c]" />

                                    <Input
                                        id="name"
                                        className="h-11 rounded-xl border-[#eadfda] bg-[#fdfbf9] pl-10 text-[#492b32] placeholder:text-[#b6a4a1] focus-visible:border-[#762f43] focus-visible:ring-[#762f43]/15"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        required
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="font-medium text-[#573b40]"
                                >
                                    Email Address
                                </Label>

                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a68c8c]" />

                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-11 rounded-xl border-[#eadfda] bg-[#fdfbf9] pl-10 text-[#492b32] placeholder:text-[#b6a4a1] focus-visible:border-[#762f43] focus-visible:ring-[#762f43]/15"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        required
                                        autoComplete="username"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <InputError message={errors.email} />

                                {/* Email Verification */}
                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-amber-900">
                                                        Email not verified
                                                    </p>

                                                    <p className="text-sm leading-relaxed text-amber-800">
                                                        Your email address has
                                                        not been verified yet.
                                                        Please check your inbox
                                                        or{' '}
                                                        <Link
                                                            href={route(
                                                                'verification.send',
                                                            )}
                                                            method="post"
                                                            as="button"
                                                            className="font-semibold underline underline-offset-2 hover:text-amber-950"
                                                        >
                                                            resend the
                                                            verification email
                                                        </Link>
                                                        .
                                                    </p>

                                                    {status ===
                                                        'verification-link-sent' && (
                                                            <p className="pt-1 text-sm font-medium text-green-700">
                                                                A new verification
                                                                link has been sent
                                                                to your email
                                                                address.
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f0e7e2] pt-6">
                                <p className="text-xs text-[#a18c89]">
                                    Make sure your account information is
                                    accurate.
                                </p>

                                <div className="flex items-center gap-3">
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out duration-300"
                                        leaveTo="opacity-0"
                                    >
                                        <span className="text-sm font-medium text-green-700">
                                            Changes saved!
                                        </span>
                                    </Transition>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-xl bg-[#762f43] px-6 text-white shadow-sm hover:bg-[#612536]"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </section>

                    {/* Delete Account */}
                    <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-5">
                            <h2 className="font-serif text-lg font-semibold text-[#492b32]">
                                Account Management
                            </h2>
                            <p className="mt-1 text-sm text-[#927b7d]">
                                Manage the status of your library account.
                            </p>
                        </div>

                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
