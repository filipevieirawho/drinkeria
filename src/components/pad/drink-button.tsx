"use client"

import { Drink } from "@prisma/client"
import { logDrink } from "@/app/pad/[slug]/actions"
import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

import { motion, AnimatePresence } from "framer-motion"

export function DrinkButton({
    drink,
    eventId,
}: {
    drink: Drink
    eventId: string
}) {
    const [isPending, startTransition] = useTransition()
    const [plusOnes, setPlusOnes] = useState<{ id: number; x: number; y: number }[]>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Trigger confetti from the click position
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height / 2) / window.innerHeight

        confetti({
            origin: { x, y },
            particleCount: 60,
            spread: 60,
            colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
        })

        // Add +1 animation
        const newPlusOne = { id: Date.now(), x: e.clientX, y: e.clientY }
        setPlusOnes((prev) => [...prev, newPlusOne])
        setTimeout(() => {
            setPlusOnes((prev) => prev.filter((p) => p.id !== newPlusOne.id))
        }, 1000)

        startTransition(async () => {
            await logDrink(eventId, drink.id)
        })
    }

    return (
        <>
            <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "h-40 w-full flex flex-col items-center justify-center gap-2 text-lg font-semibold rounded-xl border bg-card text-card-foreground shadow-sm hover-gradient hover:text-accent-foreground transition-all relative overflow-hidden",
                    isPending && "opacity-70"
                )}
                onClick={handleClick}
                disabled={isPending}
            >
                <span className="text-2xl font-bold">{drink.name}</span>
                {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                    <span className="text-sm text-muted-foreground">Tap to add</span>
                )}
            </motion.button>
            <AnimatePresence>
                {plusOnes.map((plusOne) => (
                    <motion.div
                        key={plusOne.id}
                        initial={{ opacity: 1, y: plusOne.y - 20, x: plusOne.x }}
                        animate={{ opacity: 0, y: plusOne.y - 100 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="fixed pointer-events-none text-4xl font-bold text-primary z-50"
                        style={{ left: 0, top: 0 }} // Position is handled by motion initial/animate
                    >
                        +1
                    </motion.div>
                ))}
            </AnimatePresence>
        </>
    )
}
