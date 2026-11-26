
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

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

export default function Edit({ review }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: review.name,
        email: review.email,
        rating: review.rating,
        feedback: review.feedback,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(route('system-reviews.update', review.id));
    }

    return (
        <AppLayout>
            <Head title="Edit System Review" />

            <main className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-3xl space-y-6">
                    <header className="rounded-3xl bg-[#541F32] p-8 text-white">
                        <h1 className="font-serif text-3xl">
                            Edit System Review
                        </h1>
                        <p className="mt-2 text-white/75">
                            Update the review information.
                        </p>
                    </header>

                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full rounded-xl border border-input bg-background p-3"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full rounded-xl border border-input bg-background p-3"
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Rating
                            </label>
                            <select
                                value={data.rating}
                                onChange={e => setData('rating', Number(e.target.value))}
                                className="w-full rounded-xl border border-input bg-background p-3"
                                required
                            >
                                {[5, 4, 3, 2, 1].map(number => (
                                    <option key={number} value={number}>
                                        {number} Star{number > 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.rating && (
                                <p className="text-sm text-red-500">{errors.rating}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Feedback
                            </label>
                            <textarea
                                value={data.feedback}
                                onChange={e => setData('feedback', e.target.value)}
                                rows={5}
                                className="w-full rounded-xl border border-input bg-background p-3"
                                required
                            />
                            {errors.feedback && (
                                <p className="text-sm text-red-500">{errors.feedback}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('system-reviews.index')}
                                className="rounded-xl border px-5 py-3 text-sm"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-[#541F32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#713047] disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </AppLayout>
    );
}
