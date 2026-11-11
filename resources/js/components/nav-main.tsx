
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">

            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const isActive =
                        page.url === item.url ||
                        page.url.startsWith(`${item.url}/`);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={item.title}
                                className="
                                    h-11 rounded-xl px-3
                                    text-sm font-medium text-[#76545F]
                                    transition-all duration-200
                                    hover:bg-[#FCE9ED]
                                    hover:text-[#541F32]
                                    data-[active=true]:bg-[#FCE9ED]
                                    data-[active=true]:font-semibold
                                    data-[active=true]:text-[#A3264B]
                                    data-[active=true]:shadow-sm
                                "
                            >
                                <Link href={item.url} prefetch>
                                    {item.icon && (
                                        <item.icon className="size-[18px] shrink-0" />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
