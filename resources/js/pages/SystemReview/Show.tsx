
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface SystemReview {
    id: number;
    name: string;
    email: string;
    rating: number;
    feedback: string;
}

interface Props {
    review: SystemReview;
}

export default function Show({ review }: Props) {
    return (
        <AppLayout>
            <Head title="System Review Details" />

            <main className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-3xl space-y-6">
                    <header className="rounded-3xl bg-[#541F32] p-8 text-white">
                        <h1 className="font-serif text-3xl">
                            System Review Details
                        </h1>
                        <p className="mt-2 text-white/75">
                            View the feedback submitted by a library user.
                        </p>
                    </header>

                    <section className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <h2 className="mt-1 text-lg font-semibold">
                                {review.name}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="mt-1">{review.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <p className="mt-1 text-xl text-yellow-500">
                                {'★'.repeat(Math.max(0, Math.min(5, review.rating)))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                    ({review.rating}/5)
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Feedback</p>
                            <p className="mt-2 whitespace-pre-wrap leading-7">
                                {review.feedback}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-border pt-5">
                            <Link
                                href={route('system-reviews.index')}
                                className="rounded-xl border px-5 py-3 text-sm"
                            >
                                Back
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
