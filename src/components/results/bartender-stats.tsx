"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BartenderStatsProps {
    stats: {
        name: string
        photo?: string | null
        count: number
        percentage: string
    }[]
}

export function BartenderStats({ stats }: BartenderStatsProps) {
    if (!stats || stats.length === 0) return null

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold px-1">Drinks por Bartender</h2>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] py-4"></TableHead>
                            <TableHead className="py-4">Bartender</TableHead>
                            <TableHead className="text-center py-4">Qntd.</TableHead>
                            <TableHead className="text-right py-4">Percent.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stats.map((stat) => (
                            <TableRow key={stat.name}>
                                <TableCell className="py-4">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={stat.photo || ""} alt={stat.name} />
                                        <AvatarFallback>{stat.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium py-4">{stat.name}</TableCell>
                                <TableCell className="text-center py-4">{stat.count}</TableCell>
                                <TableCell className="text-right py-4">{stat.percentage}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
