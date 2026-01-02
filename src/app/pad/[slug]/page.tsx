import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { DrinkButton } from "@/components/pad/drink-button"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function PadPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const event = await prisma.event.findUnique({
        where: { slug },
        include: {
            drinks: {
                include: {
                    drink: true,
                },
            },
        },
    })

    if (!event) {
        notFound()
    }

    // Sort drinks by name or custom order if added later
    const drinks = event.drinks.map((ed: { drink: any }) => ed.drink)

    return (
        <div className="min-h-screen bg-background p-4 flex flex-col">
            <header className="flex items-center justify-between mb-6">
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

            <main className="flex-1 grid grid-cols-2 gap-4 content-start">
                {drinks.map((drink: any) => (
                    <DrinkButton key={drink.id} drink={drink} eventId={event.id} />
                ))}
            </main>
        </div>
    )
}
