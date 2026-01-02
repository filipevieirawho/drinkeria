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

    return {
        eventName: event.name,
        totalLogs: totalDrinks,
        stats,
        bartenderStats
    }
}
