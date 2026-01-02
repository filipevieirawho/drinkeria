import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminNav } from "@/components/admin/admin-nav"
import { UserNav } from "@/components/admin/user-nav"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "BARTENDER")) {
        redirect("/api/auth/signin")
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-background">
                <div className="container px-4 py-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <Link href="/admin" className="text-xl font-bold">
                            🍸 Drinker.IA
                        </Link>
                        <UserNav user={{ name: session.user.name, email: session.user.email }} />
                    </div>
                    <AdminNav role={session.user.role} className="-mx-4 px-4 sm:mx-0 sm:px-0" />
                </div>
            </header>
            <main className="flex-1 container py-6 px-4">{children}</main>
        </div>
    )
}
