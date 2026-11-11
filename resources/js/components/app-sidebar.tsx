
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
            className="border-r border-[#EBD5D9] bg-[#FFF9F6]"
        >
            <SidebarHeader className="border-b border-[#F0E1E3] px-3 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="rounded-xl hover:bg-[#FCE9ED] data-[state=open]:bg-[#FCE9ED]"
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B28D98] group-data-[collapsible=icon]:hidden">
                    Library menu
                </div>

                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-[#F0E1E3] bg-[#FFF9F6] px-2 py-3">
                <NavFooter
                    items={footerNavItems}
                    className="mt-auto"
                />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
