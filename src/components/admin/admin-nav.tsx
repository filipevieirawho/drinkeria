"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Martini, Users, Calendar, LayoutDashboard } from "lucide-react"
export function AdminNav({
    role,
    className,
    ...props
}: React.HTMLAttributes<HTMLElement> & { role?: string }) {
    const pathname = usePathname()

    const routes = [
        {
            href: "/admin",
            label: "Visão Geral",
            icon: LayoutDashboard,
            active: pathname === "/admin",
            roles: ["ADMIN", "BARTENDER"],
        },
        {
            href: "/admin/events",
            label: "Eventos",
            icon: Calendar,
            active: pathname.startsWith("/admin/events"),
            roles: ["ADMIN", "BARTENDER"],
        },
        {
            href: "/admin/drinks",
            label: "Drinks",
            icon: Martini,
            active: pathname.startsWith("/admin/drinks"),
            roles: ["ADMIN"],
        },
        {
            href: "/admin/bartenders",
            label: "Bartenders",
            icon: Users,
            active: pathname.startsWith("/admin/bartenders"),
            roles: ["ADMIN"],
        },
    ].filter(route => route.roles.includes(role || ""))

    return (
        <nav
            className={cn("flex items-center space-x-1 overflow-x-auto pb-2 no-scrollbar", className)}
            {...props}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                        route.active
                            ? "text-primary bg-primary/10 px-2 py-1.5 rounded-md"
                            : "text-muted-foreground hover:bg-muted px-2 py-1.5 rounded-md"
                    )}
                >
                    <route.icon className="h-4 w-4" />
                    <span>{route.label}</span>
                </Link>
            ))}
        </nav>
    )
}
