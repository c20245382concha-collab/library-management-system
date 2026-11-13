
import { Head, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } =
        useForm<ResetPasswordForm>({
            token,
            email,
            password: '',
            password_confirmation: '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Create a new password"
            description="Choose a strong password to secure your ABCL Library account."
        >
            <Head title="Reset password" />

            <div className="space-y-6">
                {/* Library identity */}
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary text-primary shadow-sm">
                        <BookOpen className="h-8 w-8" strokeWidth={1.7} />
                    </div>
                </div>

                {/* Introduction */}
                <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                        <ShieldCheck className="h-4 w-4" />
                        Secure account recovery
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Your new password must be different from your old
                        password. Enter it below to regain access to your account.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-semibold text-foreground">
                            Email address
                        </Label>

                        <div className="relative">
                            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                readOnly
                                className="h-12 rounded-xl border-border bg-muted/50 pl-10 text-muted-foreground"
                            />
                        </div>

                        <InputError message={errors.email} />
                    </div>

                    {/* New password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="font-semibold text-foreground">
                            New password
                        </Label>

                        <div className="relative">
                            <LockKeyhole className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                autoComplete="new-password"
                                value={data.password}
                                autoFocus
                                required
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your new password"
                                className="h-12 rounded-xl border-border bg-background pr-11 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
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

                    {/* Confirm password */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="password_confirmation"
                            className="font-semibold text-foreground"
                        >
                            Confirm new password
                        </Label>

                        <div className="relative">
                            <KeyRound className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="password_confirmation"
                                type={showConfirmation ? 'text' : 'password'}
                                name="password_confirmation"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                required
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                placeholder="Re-enter your new password"
                                className="h-12 rounded-xl border-border bg-background pr-11 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmation(!showConfirmation)}
                                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                                aria-label={
                                    showConfirmation
                                        ? 'Hide confirmation password'
                                        : 'Show confirmation password'
                                }
                            >
                                {showConfirmation ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Password guidance */}
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-accent/50 p-3.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-xs leading-5 text-muted-foreground">
                            Use a strong password that is difficult to guess.
                            Avoid sharing your password with anyone.
                        </p>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Updating password...
                            </>
                        ) : (
                            <>
                                Reset password
                                <LockKeyhole className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                {/* Back to login */}
                <div className="flex items-center justify-center border-t border-border pt-5">
                    <TextLink
                        href={route('login')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
