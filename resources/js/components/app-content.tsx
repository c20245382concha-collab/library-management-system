
import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'div'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({
    variant = 'header',
    children,
    className,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset
                {...props}
                className={`min-h-svh bg-background text-foreground transition-colors duration-200 ${className ?? ''}`}
            >
                {children}
            </SidebarInset>
        );
    }

    return (
        <main
            className={`mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl bg-background text-foreground transition-colors duration-200 ${className ?? ''}`}
            {...props}
        >
            {children}
        </main>
    );
}
