import { EventForm } from "@/components/admin/event-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DeleteEventButton } from "@/components/admin/delete-event-button"

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        redirect("/admin")
    }

    const { id } = await params
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            drinks: true,
            bartenders: true,
        },
    })

    if (!event) {
        notFound()
    }

    const drinks = await prisma.drink.findMany({ where: { active: true }, orderBy: { name: "asc" } })
    const bartenders = await prisma.bartender.findMany()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Editar Evento</h1>
                <DeleteEventButton eventId={event.id} eventName={event.name} />
            </div>
            <EventForm event={event} drinks={drinks} bartenders={bartenders} />
        </div>
    )
}
