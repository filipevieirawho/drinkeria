import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"

interface OrderDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (customerName: string, quantity: number) => void
    drinkName: string
    isPending: boolean
}

export function OrderDialog({ isOpen, onClose, onConfirm, drinkName, isPending }: OrderDialogProps) {
    const [customerName, setCustomerName] = useState("")
    const [quantity, setQuantity] = useState(1)

    const handleConfirm = () => {
        if (customerName.trim()) {
            onConfirm(customerName, quantity)
            setCustomerName("")
            setQuantity(1)
        }
    }

    const increment = () => setQuantity(prev => Math.min(prev + 1, 10))
    const decrement = () => setQuantity(prev => Math.max(prev - 1, 1))

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">{drinkName}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-left">
                            Seu Nome
                        </Label>
                        <Input
                            id="name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Digite seu nome"
                            autoFocus
                            className="text-lg py-6"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-left">Quantidade</Label>
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="outline" size="icon" onClick={decrement} disabled={quantity <= 1}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                            <Button variant="outline" size="icon" onClick={increment} disabled={quantity >= 10}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleConfirm}
                        disabled={!customerName.trim() || isPending}
                        className="w-full text-lg py-6"
                    >
                        {isPending ? "Confirmando..." : "Confirmar Pedido"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
