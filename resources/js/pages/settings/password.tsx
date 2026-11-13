
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import {
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password Settings" />

            <SettingsLayout>
                <div className="mx-auto w-full max-w-4xl space-y-8 pb-10">

                    {/* Page Header */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#762f43] p-6 text-white shadow-sm sm:p-8">
                        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[24px] border-white/5" />
                        <div className="absolute -bottom-20 right-28 h-48 w-48 rounded-full bg-white/5" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                                <LockKeyhole className="h-7 w-7" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-white/70">
                                    Account security
                                </p>
                                <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
                                    Password Settings
                                </h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/75">
                                    Keep your library account secure by
                                    regularly updating your password.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-start gap-3 rounded-2xl border border-[#eadfda] bg-[#fcf8f5] p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7e9e9] text-[#762f43]">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-[#492b32]">
                                Protect your account
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-[#927b7d]">
                                Use a strong, unique password that is difficult
                                for others to guess. Avoid reusing passwords
                                from other websites or accounts.
                            </p>
                        </div>
                    </div>

                    {/* Password Form */}
                    <section className="overflow-hidden rounded-2xl border border-[#eadfda] bg-white shadow-sm">
                        <div className="border-b border-[#f0e7e2] bg-[#fcf8f5] px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7e9e9] text-[#762f43]">
                                    <KeyRound className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-serif text-lg font-semibold text-[#492b32]">
                                        Change Password
                                    </h2>
                                    <p className="text-sm text-[#927b7d]">
                                        Enter your current password and choose
                                        a new one.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={updatePassword}
                            className="space-y-6 p-6 sm:p-8"
                        >
                            {/* Current Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="current_password"
                                    className="font-medium text-[#573b40]"
                                >
                                    Current Password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        value={data.current_password}
                                        onChange={(e) =>
                                            setData(
                                                'current_password',
                                                e.target.value,
                                            )
                                        }
                                        type={showCurrent ? 'text' : 'password'}
                                        className="h-11 rounded-xl border-[#eadfda] bg-[#fdfbf9] pr-12 text-[#492b32] focus-visible:border-[#762f43] focus-visible:ring-[#762f43]/15"
                                        autoComplete="current-password"
                                        placeholder="Enter your current password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrent(!showCurrent)
                                        }
                                        aria-label={
                                            showCurrent
                                                ? 'Hide current password'
                                                : 'Show current password'
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a68c8c] transition hover:text-[#762f43]"
                                    >
                                        {showCurrent ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    message={errors.current_password}
                                />
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="font-medium text-[#573b40]"
                                >
                                    New Password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        type={showPassword ? 'text' : 'password'}
                                        className="h-11 rounded-xl border-[#eadfda] bg-[#fdfbf9] pr-12 text-[#492b32] focus-visible:border-[#762f43] focus-visible:ring-[#762f43]/15"
                                        autoComplete="new-password"
                                        placeholder="Enter your new password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? 'Hide new password'
                                                : 'Show new password'
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a68c8c] transition hover:text-[#762f43]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="font-medium text-[#573b40]"
                                >
                                    Confirm New Password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        type={
                                            showConfirmation
                                                ? 'text'
                                                : 'password'
                                        }
                                        className="h-11 rounded-xl border-[#eadfda] bg-[#fdfbf9] pr-12 text-[#492b32] focus-visible:border-[#762f43] focus-visible:ring-[#762f43]/15"
                                        autoComplete="new-password"
                                        placeholder="Re-enter your new password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmation(
                                                !showConfirmation,
                                            )
                                        }
                                        aria-label={
                                            showConfirmation
                                                ? 'Hide password confirmation'
                                                : 'Show password confirmation'
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a68c8c] transition hover:text-[#762f43]"
                                    >
                                        {showConfirmation ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f0e7e2] pt-6">
                                <p className="text-xs text-[#a18c89]">
                                    Your password will be updated securely.
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
                                            Password updated!
                                        </span>
                                    </Transition>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-xl bg-[#762f43] px-6 text-white shadow-sm hover:bg-[#612536]"
                                    >
                                        {processing
                                            ? 'Updating...'
                                            : 'Update Password'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
