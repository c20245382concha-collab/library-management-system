
import { Head, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    LoaderCircle,
    Mail,
    MailCheck,
    ShieldCheck,
} from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const linkSent = status === 'verification-link-sent';

    return (
        <AuthLayout
            title="Verify your email"
            description="One quick step before you can access your library account."
        >
            <Head title="Email verification" />

            <div className="space-y-6">
                {/* Library identity */}
                <div className="flex justify-center">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-secondary text-primary shadow-sm">
                        <BookOpen className="h-9 w-9" strokeWidth={1.7} />
                        <span className="absolute -right-2 -bottom-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground">
                            <MailCheck className="h-4 w-4" />
                        </span>
                    </div>
                </div>

                {/* Main message */}
                <div className="space-y-3 text-center">
                    <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-accent/60 px-3 py-1.5 text-xs font-semibold text-primary">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Account verification
                    </div>

                    <h3 className="text-lg font-semibold text-foreground">
                        Check your inbox
                    </h3>

                    <p className="text-sm leading-6 text-muted-foreground">
                        We've sent a verification link to your registered email
                        address. Open the email and click the link to verify
                        your account and continue to the ABCL Library.
                    </p>
                </div>

                {/* Email illustration */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                            <Mail className="h-5 w-5" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-card-foreground">
                                Your verification email
                            </p>
                            <p className="text-xs leading-5 text-muted-foreground">
                                Look for an email from ABCL Library Management
                                System. If you don't see it, check your spam or
                                junk folder.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success message */}
                {linkSent && (
                    <div
                        role="status"
                        className="flex items-start gap-3 rounded-xl border border-green-700/20 bg-green-700/5 p-4 text-sm text-green-700 dark:text-green-400"
                    >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                        <p className="leading-5">
                            A new verification link has been sent to the email
                            address you provided during registration.
                        </p>
                    </div>
                )}

                {/* Resend */}
                <form onSubmit={submit} className="space-y-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Sending verification email...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend verification email
                            </>
                        )}
                    </Button>
                </form>

                {/* Helpful note */}
                <div className="rounded-xl bg-accent/50 px-4 py-3 text-center">
                    <p className="text-xs leading-5 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            Didn't receive the email?
                        </span>
                        {' '}Wait a moment, then try resending the verification
                        link.
                    </p>
                </div>

                {/* Logout */}
                <div className="flex items-center justify-center border-t border-border pt-5">
                    <TextLink
                        href={route('logout')}
                        method="post"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Log out of your account
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
