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
import { deleteBartender } from "@/app/admin/bartenders/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteBartenderButtonProps {
    bartenderId: string
    bartenderName: string
}

export function DeleteBartenderButton({ bartenderId, bartenderName }: DeleteBartenderButtonProps) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteBartender(bartenderId)
            toast.success("Bartender excluído com sucesso!")
            setOpen(false)
            router.push("/admin/bartenders")
            router.refresh()
        } catch (error) {
            toast.error("Erro ao excluir bartender.")
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
                    <DialogTitle>Excluir Bartender</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o bartender <strong>{bartenderName}</strong>? Esta ação não pode ser desfeita.
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
