"use client"

import { useEffect, useState } from "react"
import { Drink, EventDrink } from "@prisma/client"
import { MenuGrid } from "@/components/menu/menu-grid"
import { OrderDialog } from "@/components/menu/order-dialog"
import { logDrink } from "@/app/pad/[slug]/actions"
import { toast } from "sonner"
import confetti from "canvas-confetti"

type DrinkWithDetails = EventDrink & {
    drink: Drink
}

interface MenuClientProps {
    eventId: string
    drinks: DrinkWithDetails[]
}

export function MenuClient({ eventId, drinks }: MenuClientProps) {
    const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        // Force black background on body and mobile container elements
        const originalBodyBg = document.body.style.backgroundColor
        document.body.style.backgroundColor = "black"

        // Target the MobileContainer elements by their known classes
        const outerContainer = document.querySelector(".bg-muted\\/30") as HTMLElement
        const innerContainer = document.querySelector(".max-w-md.bg-background") as HTMLElement

        if (outerContainer) outerContainer.style.backgroundColor = "black"
        if (innerContainer) innerContainer.style.backgroundColor = "black"

        return () => {
            document.body.style.backgroundColor = originalBodyBg
            if (outerContainer) outerContainer.style.backgroundColor = ""
            if (innerContainer) innerContainer.style.backgroundColor = ""
        }
    }, [])

    const handleSelectDrink = (drink: Drink) => {
        setSelectedDrink(drink)
        setIsDialogOpen(true)
    }

    const handleConfirmOrder = async (customerName: string, quantity: number) => {
        if (!selectedDrink) return

        setIsPending(true)
        try {
            await logDrink(eventId, selectedDrink.id, customerName, quantity)

            setIsDialogOpen(false)
            setSelectedDrink(null)

            // Confetti animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA']
            })

            toast.success("Pedido Confirmado!", {
                description: `Obrigado ${customerName}, seu ${selectedDrink.name} já está sendo preparado.`,
                duration: 5000,
            })
        } catch (error) {
            console.error("Failed to order drink:", error)
            toast.error("Erro ao fazer pedido", {
                description: "Tente novamente.",
            })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <>
            <MenuGrid drinks={drinks} onSelectDrink={handleSelectDrink} />

            {selectedDrink && (
                <OrderDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onConfirm={handleConfirmOrder}
                    drinkName={selectedDrink.name}
                    isPending={isPending}
                />
            )}
        </>
    )
}
