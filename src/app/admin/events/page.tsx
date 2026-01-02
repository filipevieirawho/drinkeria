import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ExternalLink, BarChart3, Utensils, ListOrdered } from "lucide-react"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function EventsPage() {
    const session = await getServerSession(authOptions)
    const role = session?.user?.role

    const events = await prisma.event.findMany({
        orderBy: { date: "desc" },
        include: {
            _count: {
                select: { drinks: true, bartenders: true },
            },
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Eventos</h1>
                {role === "ADMIN" && (
                    <Button asChild>
                        <Link href="/admin/events/new">Novo Evento</Link>
                    </Button>
                )}
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="hidden md:table-cell">Data</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="hidden lg:table-cell">Bebidas</TableHead>
                            <TableHead className="hidden lg:table-cell">Bartenders</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event: any) => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{event.name}</span>
                                        <span className="text-xs text-muted-foreground md:hidden">
                                            {new Date(event.date).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {event.location}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {new Date(event.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant="outline">{event.status}</Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">{event._count.drinks}</TableCell>
                                <TableCell className="hidden lg:table-cell">{event._count.bartenders}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">

                                        <Button variant="ghost" size="icon" asChild>
                                            <Link
                                                href={`/menu/${event.slug}`}
                                                target="_blank"
                                                title="Abrir Cardápio"
                                            >
                                                <Utensils className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link
                                                href={`/queue/${event.slug}`}
                                                target="_blank"
                                                title="Abrir Fila"
                                            >
                                                <ListOrdered className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/results/${event.slug}`} title="Ver Resultados">
                                                <BarChart3 className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {role === "ADMIN" && (
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/events/${event.id}`} title="Editar">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
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
