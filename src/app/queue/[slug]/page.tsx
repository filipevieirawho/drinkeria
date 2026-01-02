import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { QueueClient } from "./client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function QueuePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const event = await prisma.event.findUnique({
        where: { slug },
    })

    if (!event) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background p-4 flex flex-col">
            <main className="flex-1">
                <QueueClient eventId={event.id} />
            </main>
        </div>
    )
}
