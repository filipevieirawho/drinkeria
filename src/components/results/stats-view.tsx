"use client"

import { useEffect, useState } from "react"
import { getEventStats } from "@/app/results/[slug]/actions"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BartenderStats } from "@/components/results/bartender-stats"
import { Loader2 } from "lucide-react"

type Stats = {
    eventName: string
    totalLogs: number
    stats: {
        id: string
        name: string
        count: number
        percentage: string
    }[]
    bartenderStats: {
        name: string
        photo?: string | null
        count: number
        percentage: string
    }[]
}

export function StatsView({ slug }: { slug: string }) {
    const [data, setData] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            const stats = await getEventStats(slug) as any
            if (stats) {
                setData(stats)
            }
            setLoading(false)
        }

        fetchStats()
        const interval = setInterval(fetchStats, 5000) // Poll every 5 seconds

        return () => clearInterval(interval)
    }, [slug])

    if (loading && !data) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!data) return <div>Evento não encontrado</div>

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Drinks Servidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{data.totalLogs}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-4">Drink</TableHead>
                            <TableHead className="text-center py-4">Qntd.</TableHead>
                            <TableHead className="text-right py-4">Percent.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.stats.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium py-4">{item.name}</TableCell>
                                <TableCell className="text-center py-4">{item.count}</TableCell>
                                <TableCell className="text-right py-4">{item.percentage}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <BartenderStats stats={data.bartenderStats} />
        </div>
    )
}
