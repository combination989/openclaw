'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ReactNode } from 'react'

export function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    // Hide sidebar on terminal landing page
    if (pathname === '/') {
        return <>{children}</>
    }

    // Show sidebar for all other pages
    return (
        <SidebarProvider className="bg-transparent">
            <AppSidebar />
            <SidebarInset className="bg-transparent">
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-sm bg-background/30">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Molt Companion AI</span>
                    </div>
                </header>
                <div className="flex flex-1 flex-col z-10">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
