"use server"

import { prisma } from "@/lib/prisma"

export async function getQueue(eventId: string) {
    const queue = await prisma.drinkLog.findMany({
        where: {
            eventId: eventId,
            status: {
                in: ["PENDING", "PREPARING", "READY"]
            }
        },
        include: {
            drink: true
        },
        orderBy: {
            timestamp: "asc"
        }
    })

    return queue.map((item: any) => ({
        id: item.id,
        customerName: item.customerName || "Anônimo",
        drinkName: item.drink.name,
        status: item.status,
        timestamp: item.timestamp,
        quantity: item.quantity
    }))
}

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function updateDrinkStatus(logId: string, newStatus: string) {
    const session = await getServerSession(authOptions)

    const data: any = { status: newStatus }

    if (newStatus === 'COMPLETED') {
        data.customerName = null
        if (session?.user?.id) {
            // Robust check: Verify if the ID exists in the User table first
            const userExists = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { id: true }
            })

            if (userExists) {
                data.userId = session.user.id
                data.bartenderId = null
            } else {
                // If not in User, check if it's in Bartender
                const bartenderExists = await prisma.bartender.findUnique({
                    where: { id: session.user.id },
                    select: { id: true }
                })

                if (bartenderExists) {
                    data.bartenderId = session.user.id
                    data.userId = null
                }
            }
        }
    }

    await prisma.drinkLog.update({
        where: { id: logId },
        data
    })
}
