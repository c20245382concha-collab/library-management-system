import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const page = usePage();
    const props = page.props as typeof page.props & {
        flash?: { success?: string | null; error?: string | null };
        errors?: Record<string, string | string[]>;
    };
    const validationError = Object.values(props.errors ?? {})[0];
    const errorMessage = props.flash?.error ?? (Array.isArray(validationError) ? validationError[0] : validationError);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {(props.flash?.success || errorMessage) && (
                    <div className="px-4 pt-4 md:px-6" aria-live="polite">
                        {props.flash?.success && <p role="status" className="rounded-md border border-green-700/30 bg-green-700/5 px-4 py-3 text-sm text-green-800">{props.flash.success}</p>}
                        {errorMessage && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{errorMessage}</p>}
                    </div>
                )}
                {children}
            </AppContent>
        </AppShell>
    );
}
