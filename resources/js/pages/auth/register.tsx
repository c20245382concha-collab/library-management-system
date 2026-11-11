
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, BookOpen, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { type FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create an account | ABCL Library" />

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
                            YOUR NEXT CHAPTER STARTS HERE
                        </span>

                        <h1 className="mt-6 font-serif text-5xl leading-[1.12] xl:text-6xl">
                            Make room
                            <br />
                            for new
                            <br />
                            <span className="italic text-[#F0B7C4]">discoveries.</span>
                        </h1>

                        <p className="mt-7 max-w-md text-sm leading-8 text-white/65">
                            Join a community of curious minds. Explore resources,
                            discover new ideas, and make every reading experience count.
                        </p>

                        <div className="mt-12 rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0B7C4]/15 text-[#F0B7C4]">
                                    <BookOpen size={21} />
                                </div>
                                <div>
                                    <p className="font-serif text-lg">A world of knowledge</p>
                                    <p className="text-xs text-white/55">One account. Endless possibilities.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-white/45">
                        © {new Date().getFullYear()} ABCL Library Management System
                    </p>
                </section>

                {/* RIGHT REGISTRATION PANEL */}
                <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:justify-center lg:px-16 xl:px-24">
                    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center lg:flex-none">
                        <Link
                            href="/"
                            className="mb-9 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#8B5362] transition hover:text-[#A30F3D]"
                        >
                            <ArrowLeft size={16} />
                            Back to home
                        </Link>

                        <div className="mb-7">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5D8DF] text-[#A30F3D]">
                                <UserRound size={23} />
                            </div>

                            <span className="text-xs font-bold tracking-[0.22em] text-[#A3264B]">
                                BECOME PART OF OUR COMMUNITY
                            </span>

                            <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#481D2A] sm:text-5xl">
                                Create account.
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-[#89616D]">
                                Set up your account and start discovering
                                everything your library has to offer.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* NAME */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-[#633343]">
                                    Full name
                                </Label>

                                <div className="relative">
                                    <UserRound className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#B17B89]" size={18} />
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                        placeholder="Enter your full name"
                                        className="h-12 rounded-xl border-[#EAD0D7] bg-white pl-11 text-[#481D2A] shadow-sm placeholder:text-[#BD9CA5] focus-visible:border-[#A3264B] focus-visible:ring-[#A3264B]/20"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            {/* EMAIL */}
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
                                        tabIndex={2}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        placeholder="you@example.com"
                                        className="h-12 rounded-xl border-[#EAD0D7] bg-white pl-11 text-[#481D2A] shadow-sm placeholder:text-[#BD9CA5] focus-visible:border-[#A3264B] focus-visible:ring-[#A3264B]/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-[#633343]">
                                    Password
                                </Label>

                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#B17B89]" size={18} />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        placeholder="Create a password"
                                        className="h-12 rounded-xl border-[#EAD0D7] bg-white pl-11 text-[#481D2A] shadow-sm placeholder:text-[#BD9CA5] focus-visible:border-[#A3264B] focus-visible:ring-[#A3264B]/20"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-semibold text-[#633343]">
                                    Confirm password
                                </Label>

                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#B17B89]" size={18} />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                        placeholder="Confirm your password"
                                        className="h-12 rounded-xl border-[#EAD0D7] bg-white pl-11 text-[#481D2A] shadow-sm placeholder:text-[#BD9CA5] focus-visible:border-[#A3264B] focus-visible:ring-[#A3264B]/20"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                tabIndex={5}
                                disabled={processing}
                                className="mt-3 h-13 w-full rounded-xl bg-[#A30F3D] text-sm font-semibold text-white shadow-lg shadow-[#A30F3D]/15 transition hover:-translate-y-0.5 hover:bg-[#83102F]"
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create your account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 border-t border-[#E9CDD4] pt-6 text-center text-sm text-[#89616D]">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                tabIndex={6}
                                className="font-bold text-[#A3264B] transition hover:text-[#74102E]"
                            >
                                Sign in
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
