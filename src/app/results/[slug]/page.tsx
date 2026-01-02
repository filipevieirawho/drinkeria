import { StatsView } from "@/components/results/stats-view"
import { Badge } from "@/components/ui/badge"

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    PLANNED: { label: "Planejado", variant: "outline" },
    ACTIVE: { label: "Ativo", variant: "default" },
    COMPLETED: { label: "Concluído", variant: "secondary" },
}

export default async function ResultsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const event = await prisma.event.findUnique({
        where: { slug },
    })

    if (!event) {
        notFound()
    }

    const status = statusMap[event.status] || { label: event.status, variant: "outline" }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">{event.name}</h1>
                    <p className="text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} • {event.location}
                    </p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <StatsView slug={slug} />
        </div>
    )
}
