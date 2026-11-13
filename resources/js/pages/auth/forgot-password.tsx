
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, LoaderCircle, Mail, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout
            title="Forgot your password?"
            description="No worries. We'll help you get back to your library account."
        >
            <Head title="Forgot password" />

            <div className="space-y-6">
                {/* Header icon */}
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary text-primary shadow-sm">
                        <BookOpen className="h-8 w-8" strokeWidth={1.7} />
                    </div>
                </div>

                <div className="space-y-2 text-center">
                    <p className="text-sm leading-6 text-muted-foreground">
                        Enter the email address associated with your account.
                        If it exists, we'll send you a link to reset your password.
                    </p>
                </div>

                {status && (
                    <div
                        role="status"
                        className="flex items-start gap-3 rounded-xl border border-green-700/20 bg-green-700/5 p-4 text-sm text-green-700 dark:text-green-400"
                    >
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                        <p className="leading-5">{status}</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                            Email address
                        </Label>

                        <div className="relative">
                            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                className="h-12 rounded-xl border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30"
                            />
                        </div>

                        <InputError message={errors.email} />
                    </div>

                    <Button
                        type="submit"
                        className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Sending reset link...
                            </>
                        ) : (
                            <>
                                Send password reset link
                                <Mail className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="flex items-center justify-center border-t border-border pt-5">
                    <TextLink
                        href={route('login')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to log in
                    </TextLink>
                </div>

                <div className="rounded-xl bg-accent/60 px-4 py-3 text-center">
                    <p className="text-xs leading-5 text-muted-foreground">
                        <span className="font-semibold text-foreground">Need assistance?</span>
                        {' '}Contact your library administrator if you continue having trouble accessing your account.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
