
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Bookmark,
    Clock3,
    LibraryBig,
    Search,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { type SharedData } from '@/types';

const books = [
    {
        title: 'The Art of Reading',
        author: 'A Journey Through Stories',
        category: 'LITERATURE',
        color: 'bg-[#25483F]',
        accent: 'text-[#E9D8B7]',
        decoration: '✳',
    },
    {
        title: 'Beyond the Pages',
        author: 'Discover Something New',
        category: 'KNOWLEDGE',
        color: 'bg-[#D98D48]',
        accent: 'text-[#FFF0D7]',
        decoration: '✺',
    },
    {
        title: 'Quiet Chapters',
        author: 'Stories That Stay',
        category: 'FICTION',
        color: 'bg-[#A33D52]',
        accent: 'text-[#FBE5D9]',
        decoration: '❋',
    },
    {
        title: 'A World of Ideas',
        author: 'Learn Without Limits',
        category: 'EDUCATION',
        color: 'bg-[#D7C66B]',
        accent: 'text-[#483A2D]',
        decoration: '✳',
    },
];

const features = [
    {
        icon: Search,
        title: 'Find your next read',
        description:
            'Explore the library collection and discover books across different genres and subjects.',
    },
    {
        icon: Bookmark,
        title: 'Keep everything organized',
        description:
            'Browse available books, keep track of your borrowing requests, and manage your reading.',
    },
    {
        icon: Clock3,
        title: 'Stay on top of borrowing',
        description:
            'Keep track of your borrowed books and stay informed about your borrowing activity.',
    },
    {
        icon: ShieldCheck,
        title: 'A library you can rely on',
        description:
            'A centralized platform that makes library resources easier to access and manage.',
    },
];

function BookCover({
    book,
    className = '',
}: {
    book: (typeof books)[number];
    className?: string;
}) {
    return (
        <div
            className={`relative flex aspect-[3/4.3] w-full flex-col justify-between overflow-hidden rounded-[5px] p-4 shadow-[8px_14px_25px_rgba(74,30,40,0.17)] ${book.color} ${className}`}
        >
            <div className="flex items-center justify-between">
                <span className={`text-[8px] font-semibold tracking-[0.22em] ${book.accent}`}>
                    {book.category}
                </span>
                <span className={`${book.accent} text-lg`}>
                    {book.decoration}
                </span>
            </div>

            <div className="relative z-10">
                <div className={`mb-2 font-serif text-[clamp(17px,2vw,28px)] leading-[1.05] ${book.accent}`}>
                    {book.title}
                </div>
                <div className={`text-[9px] tracking-wide ${book.accent} opacity-80`}>
                    {book.author}
                </div>
            </div>

            <div className={`absolute -bottom-8 -right-8 h-32 w-32 rounded-full border ${book.accent} opacity-20`} />
            <div className={`absolute -bottom-3 -right-3 h-20 w-20 rounded-full border ${book.accent} opacity-30`} />
        </div>
    );
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const actionUrl = auth.user
        ? route('dashboard')
        : route('register');

    return (
        <>
            <Head title="ABCL Library | Your World of Books">
                <meta
                    name="description"
                    content="Discover, explore, and manage your library collection with ABCL Library Management System."
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <main
                className="min-h-screen overflow-hidden bg-[#FCE9ED] text-[#461D2B]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {/* NAVIGATION */}
                <header className="relative z-30 mx-auto max-w-[1440px] px-6 pt-7 sm:px-10 lg:px-16">
                    <nav className="flex items-center justify-between rounded-2xl border border-white/50 bg-[#FFF9F7]/50 px-5 py-4 backdrop-blur-md sm:px-8">
                        <a href="#" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9D173B] text-white shadow-md">
                                <BookOpen size={22} strokeWidth={2.2} />
                            </div>
                            <div>
                                <p className="font-serif text-xl font-bold leading-none">
                                    ABCL
                                </p>
                                <p className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-[#9B5364]">
                                    LIBRARY
                                </p>
                            </div>
                        </a>

                        <div className="hidden items-center gap-10 text-sm font-medium text-[#75404E] md:flex">
                            <a href="#features" className="transition hover:text-[#A40F3C]">
                                Features
                            </a>
                            <a href="#collection" className="transition hover:text-[#A40F3C]">
                                Collection
                            </a>
                            <a href="#about" className="transition hover:text-[#A40F3C]">
                                About
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-[#A30F3D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#80102F]"
                                >
                                    Dashboard
                                    <ArrowUpRight className="ml-2 inline" size={15} />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-[#6D3445] transition hover:text-[#A30F3D] sm:block"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-[#A30F3D] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#A30F3D]/15 transition hover:-translate-y-0.5 hover:bg-[#80102F]"
                                    >
                                        Get started
                                        <ArrowUpRight className="ml-2 inline" size={15} />
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* HERO */}
                <section className="relative mx-auto grid min-h-[680px] max-w-[1440px] items-center gap-12 px-6 pb-24 pt-20 sm:px-10 lg:min-h-[720px] lg:grid-cols-[1fr_0.95fr] lg:px-16 lg:pb-28 lg:pt-16">
                    <div className="relative z-10 max-w-[650px]">
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#DFAFBA] bg-white/45 px-4 py-2 text-xs font-semibold tracking-wide text-[#963A54]">
                            <Sparkles size={14} />
                            A BETTER WAY TO EXPERIENCE YOUR LIBRARY
                        </div>

                        <h1
                            className="font-serif text-[clamp(3.5rem,7vw,6.7rem)] leading-[0.98] tracking-[-0.055em] text-[#481D2A]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Every book
                            <br />
                            has a place
                            <br />
                            <span className="italic text-[#A3264B]">
                                in your story.
                            </span>
                        </h1>

                        <p className="mt-8 max-w-[500px] text-base leading-8 text-[#714451] sm:text-lg">
                            Discover a world of knowledge, explore your library
                            collection, and keep every book within reach.
                            Your library experience, beautifully organized.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <Link
                                href={actionUrl}
                                className="group inline-flex items-center rounded-xl bg-[#A30F3D] px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-[#A30F3D]/20 transition hover:-translate-y-1 hover:bg-[#83102F]"
                            >
                                {auth.user ? 'Go to dashboard' : 'Start exploring'}
                                <ArrowRight
                                    className="ml-3 transition group-hover:translate-x-1"
                                    size={18}
                                />
                            </Link>

                            <a
                                href="#features"
                                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#783D4E] transition hover:text-[#A30F3D]"
                            >
                                Discover more
                                <ArrowDown size={16} />
                            </a>
                        </div>

                        <div className="mt-14 flex items-center gap-4 border-t border-[#DFAFBA]/70 pt-7">
                            <div className="flex -space-x-3">
                                {['bg-[#B96A78]', 'bg-[#D99D74]', 'bg-[#6B8571]', 'bg-[#8B647E]'].map(
                                    (color, index) => (
                                        <div
                                            key={index}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#FCE9ED] ${color} text-white`}
                                        >
                                            <BookOpen size={14} />
                                        </div>
                                    ),
                                )}
                            </div>
                            <p className="text-xs leading-5 text-[#845564]">
                                A space for curious minds
                                <br />
                                <span className="font-semibold text-[#582A39]">
                                    Learn. Explore. Grow.
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* DECORATIVE BOOK COLLECTION */}
                    <div className="relative mx-auto h-[500px] w-full max-w-[560px] lg:h-[590px]">
                        <div className="absolute left-[18%] top-[10%] h-72 w-72 rounded-full bg-[#F4C7D0]/70 blur-3xl" />
                        <div className="absolute right-[2%] top-[20%] h-52 w-52 rounded-full bg-[#E9B7A5]/60 blur-3xl" />

                        <div className="absolute left-[5%] top-[7%] w-[29%] rotate-[-11deg] transition duration-500 hover:-translate-y-3 hover:rotate-[-6deg]">
                            <BookCover book={books[0]} />
                        </div>

                        <div className="absolute right-[8%] top-[2%] w-[30%] rotate-[9deg] transition duration-500 hover:-translate-y-3 hover:rotate-[4deg]">
                            <BookCover book={books[1]} />
                        </div>

                        <div className="absolute left-[28%] top-[30%] z-10 w-[34%] rotate-[3deg] transition duration-500 hover:-translate-y-3">
                            <BookCover book={books[2]} />
                        </div>

                        <div className="absolute bottom-[3%] left-[3%] w-[30%] rotate-[8deg] transition duration-500 hover:-translate-y-3">
                            <BookCover book={books[3]} />
                        </div>

                        <div className="absolute bottom-[9%] right-[5%] w-[29%] rotate-[-8deg] transition duration-500 hover:-translate-y-3">
                            <BookCover book={books[0]} />
                        </div>

                        <div className="absolute right-[1%] top-[44%] z-20 rounded-2xl border border-white/70 bg-[#FFF9F6]/90 p-4 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6DCE2] text-[#A30F3D]">
                                    <LibraryBig size={20} />
                                </div>
                                <div>
                                    <p className="font-serif text-sm font-bold">
                                        Your library
                                    </p>
                                    <p className="text-[10px] text-[#966574]">
                                        All in one place
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-[1%] left-[32%] -z-0 h-28 w-28 rounded-full border border-[#BD7184]/30" />
                    </div>

                    {/* CURVED TRANSITION */}
                    <div
                        className="absolute -bottom-1 left-[-10%] h-32 w-[120%] rounded-[50%_50%_0_0] bg-[#FFF8F5]"
                        aria-hidden="true"
                    />
                </section>

                {/* FEATURES */}
                <section
                    id="features"
                    className="relative bg-[#FFF8F5] px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="text-xs font-bold tracking-[0.25em] text-[#A3264B]">
                                MADE FOR EVERY READER
                            </span>
                            <h2
                                className="mt-5 font-serif text-4xl leading-tight text-[#481D2A] sm:text-5xl"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Your library, <span className="italic text-[#A3264B]">simplified.</span>
                            </h2>
                            <p className="mt-5 leading-8 text-[#805866]">
                                Everything you need to make your library
                                experience easier, more organized, and more
                                enjoyable.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;

                                return (
                                    <article
                                        key={feature.title}
                                        className="group rounded-2xl border border-[#F0DDE0] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-[#DDAAB6] hover:shadow-xl hover:shadow-[#6D2639]/5"
                                    >
                                        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FCE9ED] text-[#A3264B] transition group-hover:bg-[#A30F3D] group-hover:text-white">
                                            <Icon size={22} />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#C18B98]">
                                            0{index + 1}
                                        </span>
                                        <h3 className="mt-3 font-serif text-xl font-semibold text-[#481D2A]">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-[#86616C]">
                                            {feature.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* COLLECTION */}
                <section
                    id="collection"
                    className="bg-[#FCE9ED] px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div>
                                <span className="text-xs font-bold tracking-[0.25em] text-[#A3264B]">
                                    OPEN A NEW CHAPTER
                                </span>
                                <h2
                                    className="mt-4 font-serif text-4xl text-[#481D2A] sm:text-5xl"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Stories worth discovering.
                                </h2>
                                <p className="mt-4 max-w-xl leading-7 text-[#805866]">
                                    From timeless classics to new perspectives,
                                    there is always something waiting to be read.
                                </p>
                            </div>

                            <Link
                                href={route('books.index')}
                                className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#A3264B] transition hover:gap-4 md:self-auto"
                            >
                                Explore the catalog
                                <ArrowUpRight size={17} />
                            </Link>
                        </div>

                        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-8">
                            {books.map((book) => (
                                <article key={book.title} className="group">
                                    <div className="relative mx-auto max-w-[210px] transition duration-500 group-hover:-translate-y-3">
                                        <BookCover book={book} />
                                    </div>
                                    <div className="mx-auto mt-5 max-w-[210px]">
                                        <h3 className="font-serif text-lg font-semibold text-[#481D2A]">
                                            {book.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-[#926A76]">
                                            {book.author}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ABOUT / CTA */}
                <section
                    id="about"
                    className="bg-[#FFF8F5] px-6 py-24 sm:px-10 lg:px-16 lg:py-28"
                >
                    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#541F32] px-8 py-16 text-center text-white sm:px-16 sm:py-20">
                        <div className="absolute -left-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
                        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full border border-white/10" />

                        <div className="relative z-10 mx-auto max-w-2xl">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#F7D6DE]">
                                <BookOpen size={28} />
                            </div>

                            <h2
                                className="mt-8 font-serif text-4xl leading-tight sm:text-5xl"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Your next favorite book
                                <span className="block italic text-[#F0B7C4]">
                                    is waiting for you.
                                </span>
                            </h2>

                            <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-white/70">
                                Begin your journey with ABCL Library.
                                Explore resources, discover new ideas, and
                                make every reading experience count.
                            </p>

                            <Link
                                href={actionUrl}
                                className="mt-9 inline-flex items-center rounded-xl bg-[#F8E5E9] px-7 py-4 text-sm font-bold text-[#68263D] transition hover:-translate-y-1 hover:bg-white"
                            >
                                {auth.user ? 'Visit your dashboard' : 'Create your account'}
                                <ArrowRight className="ml-3" size={17} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#FCE9ED] px-6 py-9 sm:px-10 lg:px-16">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-[#E8C8D0] pt-8 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A30F3D] text-white">
                                <BookOpen size={19} />
                            </div>
                            <div>
                                <p className="font-serif font-bold text-[#481D2A]">
                                    ABCL Library
                                </p>
                                <p className="text-[10px] tracking-wider text-[#956574]">
                                    YOUR WORLD OF KNOWLEDGE
                                </p>
                            </div>
                        </div>

                        <p className="text-center text-xs text-[#956574]">
                            © {new Date().getFullYear()} ABCL Library Management System.
                            All rights reserved.
                        </p>

                        <div className="flex gap-6 text-xs font-semibold text-[#75404E]">
                            <a href="#features" className="hover:text-[#A30F3D]">
                                Features
                            </a>
                            <a href="#collection" className="hover:text-[#A30F3D]">
                                Collection
                            </a>
                            <Link href={route('login')} className="hover:text-[#A30F3D]">
                                Login
                            </Link>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
