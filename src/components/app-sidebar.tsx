"use client"

import * as React from "react"
import {
    Bot,
    MessageCircle,
    Terminal,
    BookOpen,
    Bookmark,
    Layers,
    Command,
    Code,
    Home,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const navItems = [
    {
        title: "Terminal Home",
        url: "/",
        icon: Home,
        description: "Boot Sequence Landing"
    },
    {
        title: "Molt Companion Chat",
        url: "/chat",
        icon: MessageCircle,
        description: "Interactive AI Chat"
    },
    {
        title: "Multi-Agent Dashboard",
        url: "/molt-companion",
        icon: Terminal,
        description: "Skills & Agents Explorer"
    },
]

const agentCategories = [
    {
        title: "AI Skills",
        url: "/skills",
        icon: Bot,
    },
    {
        title: "Agents",
        url: "/agents",
        icon: Layers,
    },
    {
        title: "Commands",
        url: "/commands",
        icon: Command,
    },
    {
        title: "Bookmarks",
        url: "/bookmarks",
        icon: Bookmark,
    },
    {
        title: "Documentation",
        url: "/documentation",
        icon: BookOpen,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden border border-red-500/20 bg-black">
                        <img
                            src="/iddle.png"
                            alt="Molt Companion Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Molt Companion</span>
                        <span className="text-xs text-sidebar-foreground/60">Multi-Agent AI</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.description}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Multi-Agent Features</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {agentCategories.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <div className="px-3 py-2">
                    <p className="text-xs text-sidebar-foreground/50">
                        Molt Companion v2.0
                    </p>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
