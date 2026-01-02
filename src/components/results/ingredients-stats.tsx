"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type IngredientStat = {
    name: string
    unit: string
    quantity: number
}

export function IngredientsStats({ stats }: { stats: IngredientStat[] }) {
    if (!stats || stats.length === 0) return null

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Consumo de Ingredientes</h2>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-4">Ingrediente</TableHead>
                            <TableHead className="text-right py-4">Quantidade Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stats.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium py-4">{item.name}</TableCell>
                                <TableCell className="text-right py-4">
                                    {item.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {item.unit}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
