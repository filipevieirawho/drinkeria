"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getQueue, updateDrinkStatus } from "./actions"
import { toast } from "sonner"

type QueueItem = {
    id: string
    customerName: string
    drinkName: string
    status: string
    timestamp: Date
    quantity: number
}

export function QueueClient({ eventId }: { eventId: string }) {
    const [queue, setQueue] = useState<QueueItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQueue = async () => {
            const data = await getQueue(eventId)
            setQueue(data)
            setLoading(false)
        }

        fetchQueue()
        const interval = setInterval(fetchQueue, 5000)
        return () => clearInterval(interval)
    }, [eventId])

    const handleItemClick = async (item: QueueItem) => {
        try {
            await updateDrinkStatus(item.id, 'COMPLETED')
            toast.success(`${item.customerName} servido!`)
            // Optimistic update
            setQueue(prev => prev.filter(i => i.id !== item.id))
        } catch (error) {
            console.error("Failed to update status:", error)
            toast.error("Erro ao atualizar status")
        }
    }

    const pendingItems = queue.filter(item => item.status === 'PENDING')

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Próximos Pedidos ({pendingItems.length})</h1>
            <div className="flex flex-col gap-4">
                {queue.filter(item => item.status === 'PENDING').map((item, index) => (
                    <Card
                        key={item.id}
                        className={`cursor-pointer hover:scale-105 transition-transform active:scale-95 ${index === 0
                            ? "bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-900 shadow-lg scale-[1.02]"
                            : "bg-secondary/50 border-secondary"
                            }`}
                        onClick={() => handleItemClick(item)}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center select-none">
                            <span className="text-3xl font-bold mb-2">
                                {item.drinkName} {item.quantity > 1 && <span className="text-primary ml-1">({item.quantity}x)</span>}
                            </span>
                            <span className="text-xl text-muted-foreground">{item.customerName}</span>
                            <span className="text-xs text-muted-foreground mt-4">Toque para finalizar</span>
                        </CardContent>
                    </Card>
                ))}
                {queue.filter(item => item.status === 'PENDING').length === 0 && (
                    <div className="text-center text-muted-foreground py-12 text-lg">
                        A fila está vazia!
                    </div>
                )}
            </div>
        </div>
    )
}
