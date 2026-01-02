"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { deleteDrink } from "@/app/admin/drinks/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteDrinkButtonProps {
    drinkId: string
    drinkName: string
}

export function DeleteDrinkButton({ drinkId, drinkName }: DeleteDrinkButtonProps) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteDrink(drinkId)
            toast.success("Drink excluído com sucesso!")
            setOpen(false)
            router.push("/admin/drinks")
            router.refresh()
        } catch (error) {
            toast.error("Erro ao excluir drink.")
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Drink</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o drink <strong>{drinkName}</strong>? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Excluindo..." : "Excluir"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
