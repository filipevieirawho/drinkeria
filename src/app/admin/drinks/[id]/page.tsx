import { DrinkForm } from "@/components/admin/drink-form"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { DeleteDrinkButton } from "@/components/admin/delete-drink-button"

export default async function EditDrinkPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        redirect("/admin")
    }

    const { id } = await params
    const drink = await prisma.drink.findUnique({
        where: { id },
    })

    if (!drink) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Editar Drink</h1>
                <DeleteDrinkButton
                    drinkId={drink.id}
                    drinkName={drink.name}
                />
            </div>
            <DrinkForm drink={drink} />
        </div>
    )
}
