import { StatsView } from "@/components/results/stats-view"

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ResultsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const event = await prisma.event.findUnique({
        where: { slug },
    })

    if (!event) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight">{event.name}</h1>
                <p className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} • {event.location}
                </p>
            </div>
            <StatsView slug={slug} />
        </div>
    )
}
