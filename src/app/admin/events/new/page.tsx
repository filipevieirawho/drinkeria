import { EventForm } from "@/components/admin/event-form"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function NewEventPage() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        redirect("/admin")
    }

    const drinks = await prisma.drink.findMany({ where: { active: true }, orderBy: { name: "asc" } })
    const bartenders = await prisma.bartender.findMany()

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Novo Evento</h1>
            <EventForm drinks={drinks} bartenders={bartenders} />
        </div>
    )
}
