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
            <header className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/events">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold">{event.name}</h1>
                        <div className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <QueueClient eventId={event.id} />
            </main>
        </div>
    )
}
