"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { nanoid } from "nanoid"

export async function createEvent(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const date = new Date(formData.get("date") as string)
    const location = formData.get("location") as string
    const drinkIds = formData.getAll("drinks") as string[]
    const bartenderIds = formData.getAll("bartenders") as string[]

    // Generate a unique slug
    const slug = nanoid(10)

    await prisma.event.create({
        data: {
            name,
            date,
            location,
            slug,
            status: "PLANNED",
            drinks: {
                create: drinkIds.map((id) => ({
                    drink: { connect: { id } },
                })),
            },
            bartenders: {
                create: bartenderIds.map((id) => ({
                    bartender: { connect: { id } },
                })),
            },
        },
    })

    revalidatePath("/admin/events")
    redirect("/admin/events")
}

export async function updateEvent(id: string, formData: FormData) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const date = new Date(formData.get("date") as string)
    const location = formData.get("location") as string
    const status = formData.get("status") as string
    const drinkIds = formData.getAll("drinks") as string[]
    const bartenderIds = formData.getAll("bartenders") as string[]

    // Transaction to update relationships
    await prisma.$transaction(async (tx) => {
        // Update basic info
        await tx.event.update({
            where: { id },
            data: {
                name,
                date,
                location,
                status,
            },
        })

        // Update drinks: delete all and recreate
        await tx.eventDrink.deleteMany({ where: { eventId: id } })
        if (drinkIds.length > 0) {
            await tx.eventDrink.createMany({
                data: drinkIds.map((drinkId) => ({
                    eventId: id,
                    drinkId,
                })),
            })
        }

        // Update bartenders: delete all and recreate
        await tx.eventBartender.deleteMany({ where: { eventId: id } })
        if (bartenderIds.length > 0) {
            await tx.eventBartender.createMany({
                data: bartenderIds.map((bartenderId) => ({
                    eventId: id,
                    bartenderId,
                })),
            })
        }
    })

    revalidatePath("/admin/events")
    redirect("/admin/events")
}

export async function deleteEvent(id: string) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    await prisma.event.delete({
        where: { id },
    })

    revalidatePath("/admin/events")
    redirect("/admin/events")
}
