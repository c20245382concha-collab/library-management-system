
import { Head } from '@inertiajs/react';
import { Palette, SunMoon, Monitor } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance Settings" />

            <SettingsLayout>
                <div className="mx-auto w-full max-w-4xl space-y-8 pb-10">
                    {/* Page Header */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#762f43] p-6 text-white shadow-sm sm:p-8">
                        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[24px] border-white/5" />
                        <div className="absolute -bottom-20 right-28 h-48 w-48 rounded-full bg-white/5" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                                <Palette className="h-7 w-7" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-white/70">
                                    Personal preferences
                                </p>
                                <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
                                    Appearance Settings
                                </h1>
                                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/75">
                                    Customize how the ABCL Library Management
                                    System looks on your device.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Appearance Options */}
                    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="border-b border-border bg-muted/50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <SunMoon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-serif text-lg font-semibold text-card-foreground">
                                        Display Preferences
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Choose the theme that works best for you.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-6 sm:p-8">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Select your theme
                                </h3>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                    Your selection controls the appearance of
                                    the application. You can change it anytime.
                                </p>
                            </div>

                            <AppearanceTabs />

                            {/* System Preference Notice */}
                            <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
                                <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        System preference
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        You can choose System to automatically
                                        follow your device's light or dark
                                        appearance preference.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
