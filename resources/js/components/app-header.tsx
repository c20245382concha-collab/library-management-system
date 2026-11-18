
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    ClipboardList,
    LayoutGrid,
    Menu,
    Star,
    Tags,
    UserRound,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

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

    const isActive = (url: string) =>
        page.url === url || page.url.startsWith(`${url}/`);

    const renderNavItems = (mobile = false) =>
        mainNavItems.map((item) => {
            const active = isActive(item.url);

            return (
                <Link
                    key={item.title}
                    href={item.url}
                    prefetch
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        } ${mobile ? 'w-full' : 'h-10 whitespace-nowrap'}`}
                >
                    {item.icon && (
                        <Icon iconNode={item.icon} className="h-4 w-4 shrink-0" />
                    )}
                    <span>{item.title}</span>
                </Link>
            );
        });

    return (
        <>
            <header className="border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
                <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="left"
                                className="flex w-72 flex-col border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
                            >
                                <SheetTitle className="sr-only">
                                    Library Navigation
                                </SheetTitle>

                                <SheetHeader className="border-b border-sidebar-border px-4 py-4 text-left">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center"
                                    >
                                        <AppLogo />
                                    </Link>
                                </SheetHeader>

                                <div className="px-3 py-4">
                                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        Library Menu
                                    </p>

                                    <nav className="flex flex-col gap-1">
                                        {renderNavItems(true)}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        prefetch
                        className="flex shrink-0 items-center"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex">
                        {renderNavItems()}
                    </nav>

                    {/* User Menu */}
                    <div className="ml-auto flex shrink-0 items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-10 w-10 rounded-full p-1 hover:bg-sidebar-accent"
                                >
                                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-foreground">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                            >
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="w-full border-b border-sidebar-border/70 bg-sidebar">
                    <div className="flex h-12 items-center px-4 text-muted-foreground lg:px-6">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
