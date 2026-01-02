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
import { deleteEvent } from "@/app/admin/events/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteEventButtonProps {
    eventId: string
    eventName: string
}

export function DeleteEventButton({ eventId, eventName }: DeleteEventButtonProps) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteEvent(eventId)
            toast.success("Evento excluído com sucesso!")
            setOpen(false)
            // No need to redirect here as the server action already redirects
        } catch (error) {
            toast.error("Erro ao excluir evento.")
            console.error(error)
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
                    <DialogTitle>Excluir Evento</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o evento <strong>{eventName}</strong>? Esta ação não pode ser desfeita.
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
