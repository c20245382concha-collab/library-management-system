
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    ClipboardList,
    LayoutGrid,
    Star,
    Tags,
    UserRound,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const user = usePage<SharedData>().props.auth.user;

    const roleName = (
        user.role as { role_name?: string } | undefined
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
                    icon: Building2,
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
                    icon: ClipboardList,
                },
                {
                    title: 'Reviews',
                    url: '/reviews',
                    icon: Star,
                },
            ]
            : [
                {
                    title: 'My Requests',
                    url: '/my-borrowing-requests',
                    icon: ClipboardList,
                },
                {
                    title: 'Write a Review',
                    url: '/reviews/create',
                    icon: Star,
                },
            ]),
    ];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
        >
            {/* Header / Logo */}
            <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="rounded-xl transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Main Navigation */}
            <SidebarContent className="px-2 py-4">
                <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-data-[collapsible=icon]:hidden">
                    Library Menu
                </div>

                <NavMain items={mainNavItems} />
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t border-sidebar-border bg-sidebar px-2 py-3">
                <NavFooter
                    items={footerNavItems}
                    className="mt-auto"
                />

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
