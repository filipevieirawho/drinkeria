"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function logDrink(eventId: string, drinkId: string, customerName?: string, quantity: number = 1) {
    try {
        await prisma.drinkLog.create({
            data: {
                eventId,
                drinkId,
                customerName,
                status: customerName ? "PENDING" : "COMPLETED",
                quantity
                // Bartender ID is optional and currently not tracked in the simple pad view
                // If we add bartender selection in the pad later, we can pass it here
            },
        })
    } catch (error) {
        console.error("Failed to log drink:", error)
        // Optionally rethrow or handle the error appropriately
        throw error
    }


    // Revalidate the results page if it exists
    revalidatePath(`/results/${eventId}`)
}
