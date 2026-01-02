"use client"

import { Drink } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MenuDrinkButtonProps {
    drink: Drink
    onClick: () => void
    disabled?: boolean
}

export function MenuDrinkButton({ drink, onClick, disabled }: MenuDrinkButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "h-40 w-full flex flex-col items-center justify-center gap-2 text-lg font-semibold rounded-xl border border-white/10 shadow-sm transition-all relative overflow-hidden group",
                disabled && "opacity-70"
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {drink.image && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={drink.image}
                        alt={drink.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                </div>
            )}
            <div className="relative z-10 flex flex-col items-center gap-1 text-white drop-shadow-md">
                <span className="text-2xl font-bold">{drink.name}</span>
                <span className="text-sm opacity-90">Toque para pedir</span>
            </div>
        </motion.button >
    )
}
