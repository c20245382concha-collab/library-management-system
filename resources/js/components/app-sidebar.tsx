
import { useLayoutEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import {
    BookOpen,
    BookMarked,
    BookPlus,
    FolderOpen,
    LayoutGrid,
    MessageSquare,
    Tags,
    Users,
    UserRound,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const sidebarContentRef = useRef<HTMLDivElement>(null);

    const roleName = (
        auth.user.role as { role_name?: string } | undefined
    )?.role_name;

    const isAdmin = roleName === 'Admin/Librarian';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Books',
            url: '/books',
            icon: BookOpen,
        },
        ...(isAdmin
            ? [
                {
                    title: 'Authors',
                    url: '/authors',
                    icon: UserRound,
                },
                {
                    title: 'Publishers',
                    url: '/publishers',
                    icon: FolderOpen,
                },
                {
                    title: 'Genres',
                    url: '/genres',
                    icon: Tags,
                },
                {
                    title: 'Users',
                    url: '/users',
                    icon: Users,
                },
                {
                    title: 'Borrowing Requests',
                    url: '/borrowing-requests',
                    icon: BookPlus,
                },
                {
                    title: 'Reviews',
                    url: '/reviews',
                    icon: MessageSquare,
                },
            ]
            : [
                {
                    title: 'My Requests',
                    url: '/my-requests',
                    icon: BookMarked,
                },
                {
                    title: 'Write a Review',
                    url: '/reviews/create',
                    icon: MessageSquare,
                },
            ]),
    ];

    useLayoutEffect(() => {
        const element = sidebarContentRef.current;

        if (!element) return;

        const storageKey = 'abcl-sidebar-scroll';

        const savedPosition = sessionStorage.getItem(storageKey);

        if (savedPosition !== null) {
            element.scrollTop = Number(savedPosition);
        }

        const savePosition = () => {
            sessionStorage.setItem(
                storageKey,
                String(element.scrollTop),
            );
        };

        element.addEventListener('scroll', savePosition);

        return () => {
            savePosition();
            element.removeEventListener('scroll', savePosition);
        };
    }, []);

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
        >
            <SidebarHeader>
                <AppLogo />
            </SidebarHeader>

            <SidebarContent
                ref={sidebarContentRef}
                className="overflow-y-auto px-2 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
