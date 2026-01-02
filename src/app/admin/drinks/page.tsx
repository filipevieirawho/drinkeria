import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { DrinksToolbar } from "@/components/admin/drinks-toolbar"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const drinkTypeMap: Record<string, string> = {
    CLASSIC: "Clássico",
    SIGNATURE: "Assinatura",
    MOCKTAIL: "Mocktail",
    SHOT: "Shot",
}

export default async function DrinksPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>
}) {
    const session = await getServerSession(authOptions)
    const role = session?.user?.role

    if (role !== "ADMIN") {
        redirect("/admin")
    }

    const { type } = await searchParams
    const where = type && type !== "all" ? { type } : {}

    const drinks = await prisma.drink.findMany({
        where,
        orderBy: { name: "asc" },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Drinks</h1>
                {role === "ADMIN" && (
                    <Button asChild className="bg-mojito hover:bg-mojito/90 text-white">
                        <Link href="/admin/drinks/new">Add Drink</Link>
                    </Button>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Total de drinks: <span className="font-medium text-foreground">{drinks.length}</span>
                </div>
                <DrinksToolbar />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drinks.map((drink: any) => (
                            <TableRow key={drink.id}>
                                <TableCell className="font-medium">{drink.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[10px] font-normal">
                                        {drinkTypeMap[drink.type] || drink.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {role === "ADMIN" && (
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/drinks/${drink.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
