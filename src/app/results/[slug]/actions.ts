"use server"

import { prisma } from "@/lib/prisma"

export async function getEventStats(slug: string) {
    const event = await prisma.event.findUnique({
        where: { slug },
        include: {
            drinks: {
                include: {
                    drink: true,
                },
            },
            logs: {
                where: {
                    status: "COMPLETED"
                },
                include: {
                    user: true,
                    bartender: true
                }
            },
        },
    })

    if (!event) return null

    // Explicitly fetch peopleCount to ensure we have the latest value
    const eventData = await prisma.event.findUnique({
        where: { slug },
        select: { peopleCount: true }
    })

    console.log("getEventStats event:", JSON.stringify(event, null, 2))
    console.log("getEventStats peopleCount:", eventData?.peopleCount)

    const totalDrinks = event.logs.reduce((sum: number, log: any) => sum + (log.quantity || 1), 0)

    const stats = event.drinks.map((ed: { drinkId: string; drink: { id: string; name: string } }) => {
        const count = event.logs
            .filter((l: { drinkId: string }) => l.drinkId === ed.drinkId)
            .reduce((sum: number, log: any) => sum + (log.quantity || 1), 0)

        const percentage = totalDrinks > 0 ? (count / totalDrinks) * 100 : 0
        return {
            id: ed.drink.id,
            name: ed.drink.name,
            count,
            percentage: percentage.toFixed(1),
        }
    }).sort((a: { count: number }, b: { count: number }) => b.count - a.count)

    const bartenderStatsMap = event.logs.reduce((acc: Record<string, { name: string, photo: string | null, count: number }>, log: any) => {
        let id = ""
        let name = "Unknown"
        let photo = null

        if (log.userId) {
            id = `user-${log.userId}`
            name = log.user?.username || "Admin"
        } else if (log.bartenderId) {
            id = `bartender-${log.bartenderId}`
            name = log.bartender ? `${log.bartender.name} ${log.bartender.surname}` : "Bartender"
            photo = log.bartender?.photo || null
        }

        if (!acc[id]) {
            acc[id] = { name, photo, count: 0 }
        }

        const quantity = log.quantity || 1
        acc[id].count += quantity
        return acc
    }, {} as Record<string, { name: string, photo: string | null, count: number }>)

    const bartenderStats = Object.values(bartenderStatsMap)
        .map((stat: any) => {
            const percentage = totalDrinks > 0 ? (stat.count / totalDrinks) * 100 : 0
            return {
                name: stat.name,
                photo: stat.photo,
                count: Number(stat.count),
                percentage: percentage.toFixed(1)
            }
        })
        .sort((a, b) => b.count - a.count)

    // Calculate Ingredient Stats
    const ingredientsMap: Record<string, { name: string; unit: string; quantity: number }> = {}

    event.logs.forEach((log: any) => {
        const drink = event.drinks.find((d: any) => d.drinkId === log.drinkId)?.drink
        if (!drink || !drink.ingredients) return

        try {
            const ingredients = JSON.parse(drink.ingredients)
            if (Array.isArray(ingredients)) {
                ingredients.forEach((ing: { quantity: string; name: string }) => {
                    if (!ing.name) return

                    let value = 0
                    let unit = ""

                    const qtyStr = ing.quantity.trim()

                    // Try parsing fraction (e.g. "1/2")
                    if (qtyStr.match(/^\d+\/\d+$/)) {
                        const [num, den] = qtyStr.split('/').map(Number)
                        if (den !== 0) value = num / den
                    }
                    // Try parsing number + unit (e.g. "50ml", "50 ml", "1")
                    else {
                        const match = qtyStr.match(/^([\d.,]+)\s*(.*)$/)
                        if (match) {
                            value = parseFloat(match[1].replace(',', '.'))
                            unit = match[2].trim()
                        } else {
                            // Fallback: if no number found, maybe just count 1 per drink? 
                            // Or keep value 0 and just list it. 
                            // Let's assume value 0 for non-numeric quantities like "Q.B."
                            unit = qtyStr
                        }
                    }

                    if (isNaN(value)) value = 0

                    const logQty = log.quantity || 1
                    const totalQty = value * logQty

                    // Key by name + unit to separate "Rum (ml)" from "Rum (garrafa)" if that happens
                    // Normalize name to lowercase for grouping
                    const key = `${ing.name.toLowerCase()}-${unit.toLowerCase()}`

                    if (!ingredientsMap[key]) {
                        ingredientsMap[key] = {
                            name: ing.name, // Keep original casing for display
                            unit: unit,
                            quantity: 0
                        }
                    }
                    ingredientsMap[key].quantity += totalQty
                })
            }
        } catch (e) {
            // Ignore parsing errors
        }
    })

    const ingredientStats = Object.values(ingredientsMap)
        .sort((a, b) => b.quantity - a.quantity)

    return {
        eventName: event.name,
        totalLogs: totalDrinks,
        peopleCount: eventData?.peopleCount,
        stats,
        bartenderStats,
        ingredientStats
    }
}
