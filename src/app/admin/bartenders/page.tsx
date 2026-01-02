import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function BartendersPage() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        redirect("/admin")
    }

    const bartenders = await prisma.bartender.findMany({
        orderBy: { createdAt: "desc" },
    })

    const getInitials = (name: string, surname: string) => {
        return (name[0] + surname[0]).toUpperCase()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Bartenders</h1>
                <Button asChild className="bg-saas-blue hover:bg-saas-blue/90 text-white">
                    <Link href="/admin/bartenders/new">Add Bartender</Link>
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bartenders.map((bartender: any) => (
                            <TableRow key={bartender.id}>
                                <TableCell>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={bartender.photo} alt={bartender.name} />
                                        <AvatarFallback>
                                            {getInitials(bartender.name, bartender.surname)}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {bartender.name} {bartender.surname}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{bartender.phone}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/bartenders/${bartender.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
