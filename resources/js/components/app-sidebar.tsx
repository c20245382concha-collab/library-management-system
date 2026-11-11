import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2, ClipboardList, Folder, LayoutGrid, Star, Tags, UserRound, Users } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    const user = usePage<SharedData>().props.auth.user;
    const roleName = (user.role as { role_name?: string } | undefined)?.role_name;
    const isAdmin = roleName === 'Admin/Librarian';
    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
        { title: 'Books', url: '/books', icon: BookOpen },
        ...(isAdmin ? [
            { title: 'Authors', url: '/authors', icon: UserRound },
            { title: 'Author Profiles', url: '/author-profiles', icon: UserRound },
            { title: 'Publishers', url: '/publishers', icon: Building2 },
            { title: 'Genres', url: '/genres', icon: Tags },
            { title: 'Users', url: '/users', icon: Users },
            { title: 'Borrowing Requests', url: '/borrowing-requests', icon: ClipboardList },
            { title: 'Reviews', url: '/reviews', icon: Star },
        ] : [
            { title: 'My Requests', url: '/my-borrowing-requests', icon: ClipboardList },
            { title: 'Write a Review', url: '/reviews/create', icon: Star },
        ]),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
