import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MenuClient } from "./client"

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
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

    // Sort drinks alphabetically and filter out "Outros"
    const sortedDrinks = event.drinks
        .filter((ed: any) => ed.drink.name.toLowerCase() !== "outros")
        .sort((a: any, b: any) =>
            a.drink.name.localeCompare(b.drink.name)
        )

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <header className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">{event.name}</h1>
                        <p className="text-sm opacity-70">Cardápio Digital</p>
                    </div>
                </div>
            </header>

            <main>
                <MenuClient eventId={event.id} drinks={sortedDrinks} />
            </main>
        </div>
    )
}
