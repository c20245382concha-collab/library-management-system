
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LockKeyhole } from 'lucide-react';
import { type FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <form onSubmit={submit}>
                <div className="space-y-6">

                    {/* Password */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="password"
                            className="font-semibold text-foreground"
                        >
                            Password
                        </Label>

                        <div className="relative">
                            <LockKeyhole className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={data.password}
                                autoFocus
                                required
                                disabled={processing}
                                onChange={(e) => setData('password', e.target.value)}
                                className="h-12 rounded-xl border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                            />
                        </div>

                        <InputError message={errors.password} />
                    </div>

                    {/* Submit */}
                    <div className="flex items-center">
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Confirming password...
                                </>
                            ) : (
                                <>
                                    Confirm password
                                    <LockKeyhole className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
