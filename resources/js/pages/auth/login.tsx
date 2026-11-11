
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, BookOpen, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { type FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in | ABCL Library" />

            <main className="min-h-screen bg-[#FCE9ED] text-[#481D2A] lg:grid lg:grid-cols-2">
                {/* LEFT DECORATIVE PANEL */}
                <section className="relative hidden min-h-screen overflow-hidden bg-[#541F32] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
                    <div className="absolute -left-32 top-32 h-96 w-96 rounded-full border border-white/10" />
                    <div className="absolute -bottom-32 -right-20 h-[500px] w-[500px] rounded-full border border-white/10" />
                    <div className="absolute right-10 top-24 h-64 w-64 rounded-full bg-[#A3264B]/30 blur-3xl" />

                    <Link href="/" className="relative z-10 flex w-fit items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="font-serif text-xl font-bold">ABCL</p>
                            <p className="text-[9px] tracking-[0.25em] text-white/60">LIBRARY</p>
                        </div>
                    </Link>

                    <div className="relative z-10 mx-auto w-full max-w-lg">
                        <span className="text-xs font-semibold tracking-[0.25em] text-[#F0B7C4]">
                            WELCOME TO YOUR LIBRARY
                        </span>

                        <h1 className="mt-6 font-serif text-5xl leading-[1.12] xl:text-6xl">
                            Every great
                            <br />
                            story begins
                            <br />
                            <span className="italic text-[#F0B7C4]">with a page.</span>
                        </h1>

                        <p className="mt-7 max-w-md text-sm leading-8 text-white/65">
                            Sign in and continue exploring a world of knowledge,
                            discovery, and stories waiting to be read.
                        </p>

                        {/* Decorative book covers */}
                        <div className="mt-12 flex items-end justify-center gap-4">
                            <div className="w-28 rotate-[-9deg] rounded-md bg-[#D7C66B] p-3 pb-5 shadow-2xl">
                                <p className="text-[8px] font-bold tracking-widest text-[#51432C]">KNOWLEDGE</p>
                                <p className="mt-10 font-serif text-lg leading-tight text-[#51432C]">A World of Ideas</p>
                            </div>
                            <div className="z-10 w-36 rotate-[2deg] rounded-md bg-[#F7E8DF] p-4 pb-7 shadow-2xl">
                                <p className="text-[8px] font-bold tracking-widest text-[#A3264B]">LITERATURE</p>
                                <div className="my-5 flex h-20 items-center justify-center text-[#A3264B]">
                                    <BookOpen size={45} strokeWidth={1} />
                                </div>
                                <p className="font-serif text-xl text-[#541F32]">The Art of Reading</p>
                            </div>
                            <div className="w-28 rotate-[9deg] rounded-md bg-[#A44B60] p-3 pb-5 shadow-2xl">
                                <p className="text-[8px] font-bold tracking-widest text-white/70">FICTION</p>
                                <p className="mt-10 font-serif text-lg leading-tight text-white">Quiet Chapters</p>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-white/45">
                        © {new Date().getFullYear()} ABCL Library Management System
                    </p>
                </section>

                {/* RIGHT LOGIN PANEL */}
                <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:justify-center lg:px-16 xl:px-24">
                    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center lg:flex-none">
                        <Link
                            href="/"
                            className="mb-12 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#8B5362] transition hover:text-[#A30F3D]"
                        >
                            <ArrowLeft size={16} />
                            Back to home
                        </Link>

                        <div className="mb-9">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5D8DF] text-[#A30F3D]">
                                <LockKeyhole size={23} />
                            </div>

                            <span className="text-xs font-bold tracking-[0.22em] text-[#A3264B]">
                                YOUR READING JOURNEY CONTINUES
                            </span>

                            <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#481D2A] sm:text-5xl">
                                Welcome back.
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-[#89616D]">
                                Sign in to access your account and continue
                                your library experience.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-[#633343]">
                                    Email address
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#B17B89]" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        tabIndex={1}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="you@example.com"
                                        className="h-13 rounded-xl border-[#EAD0D7] bg-white pl-11 text-[#481D2A] shadow-sm placeholder:text-[#BD9CA5] focus-visible:border-[#A3264B] focus-visible:ring-[#A3264B]/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="password" className="text-sm font-semibold text-[#633343]">
                                        Password
                                    </Label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            tabIndex={5}
                                            className="text-xs font-semibold text-[#A3264B] transition hover:text-[#74102E]"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#B17B89]" size={18} />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className="h-13 rounded-xl border-[#EAD0D7] bg-white pl-11 text-[#481D2A] shadow-sm placeholder:text-[#BD9CA5] focus-visible:border-[#A3264B] focus-visible:ring-[#A3264B]/20"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked === true)}
                                    className="border-[#D5A9B5] data-[state=checked]:border-[#A30F3D] data-[state=checked]:bg-[#A30F3D]"
                                />
                                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-[#805866]">
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                className="h-13 w-full rounded-xl bg-[#A30F3D] text-sm font-semibold text-white shadow-lg shadow-[#A30F3D]/15 transition hover:-translate-y-0.5 hover:bg-[#83102F]"
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in to your account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-9 border-t border-[#E9CDD4] pt-7 text-center text-sm text-[#89616D]">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                tabIndex={6}
                                className="font-bold text-[#A3264B] transition hover:text-[#74102E]"
                            >
                                Create an account
                            </Link>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-[11px] text-[#A47D88]">
                        A place for curious minds and lifelong learners.
                    </p>
                </section>
            </main>
        </>
    );
}
