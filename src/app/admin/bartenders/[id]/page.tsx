import { BartenderForm } from "@/components/admin/bartender-form"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { DeleteBartenderButton } from "@/components/admin/delete-bartender-button"

export default async function EditBartenderPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        redirect("/admin")
    }

    const { id } = await params
    const bartender = await prisma.bartender.findUnique({
        where: { id },
    })

    if (!bartender) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Editar Bartender</h1>
                <DeleteBartenderButton
                    bartenderId={bartender.id}
                    bartenderName={`${bartender.name} ${bartender.surname}`}
                />
            </div>
            <BartenderForm bartender={bartender} />
        </div>
    )
}
