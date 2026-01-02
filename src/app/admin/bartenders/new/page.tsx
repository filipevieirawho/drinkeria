import { BartenderForm } from "@/components/admin/bartender-form"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function NewBartenderPage() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        redirect("/admin")
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Novo Bartender</h1>
            <BartenderForm />
        </div>
    )
}
