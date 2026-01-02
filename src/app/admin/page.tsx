import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Martini, Calendar } from "lucide-react"
import { YearFilter } from "@/components/admin/year-filter"
import { OverviewChart } from "@/components/admin/overview-chart"

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ year?: string }>
}) {
    const { year } = await searchParams
    const selectedYear = year ? parseInt(year) : null

    // Fetch all available years from events
    const allEvents = await prisma.event.findMany({
        select: { date: true }
    })
    const years = Array.from(new Set(allEvents.map((e: any) => new Date(e.date).getFullYear()))).sort((a: any, b: any) => b - a) as number[]

    // Filter criteria
    const eventFilter = selectedYear ? {
        date: {
            gte: new Date(`${selectedYear}-01-01`),
            lte: new Date(`${selectedYear}-12-31`),
        }
    } : {}

    const drinksCount = await prisma.drink.count({
        where: selectedYear ? {
            events: {
                some: {
                    event: eventFilter
                }
            }
        } : {}
    })

    const events = await prisma.event.findMany({
        where: eventFilter,
        select: { peopleCount: true }
    })

    const eventsCount = events.length
    const totalPeople = events.reduce((sum: number, event: any) => sum + (event.peopleCount || 0), 0)

    // Fetch logs filtered by year
    const logs = await prisma.drinkLog.findMany({
        where: selectedYear ? {
            event: eventFilter
        } : {},
        include: {
            drink: true,
        },
    })

    const totalDrinksServed = logs.reduce((sum: number, log: any) => sum + (log.quantity || 1), 0)

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
        }
        return num.toString()
    }

    // Aggregate data
    const drinkStats = logs.reduce((acc: Record<string, number>, log: any) => {
        const drinkName = log.drink.name
        const quantity = log.quantity || 1
        acc[drinkName] = (acc[drinkName] || 0) + quantity
        return acc
    }, {} as Record<string, number>)

    const chartData = Object.entries(drinkStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a: any, b: any) => b.value - a.value)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <YearFilter years={years} />
            </div>
            <div className="grid gap-4 grid-cols-2">
                <Card className="flex flex-col shadow-none border">
                    <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2 gap-2">
                        <Martini className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-medium">Servidos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center">
                        <div className="text-2xl font-bold">{formatNumber(totalDrinksServed)}</div>
                    </CardContent>
                </Card>
                <Card className="flex flex-col shadow-none border">
                    <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2 gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Pessoas</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center">
                        <div className="text-2xl font-bold">{formatNumber(totalPeople)}</div>
                    </CardContent>
                </Card>
                <Card className="flex flex-col shadow-none border">
                    <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2 gap-2">
                        <Martini className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Drinks</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center">
                        <div className="text-2xl font-bold">{drinksCount}</div>
                    </CardContent>
                </Card>
                <Card className="flex flex-col shadow-none border">
                    <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2 gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Eventos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center">
                        <div className="text-2xl font-bold">{eventsCount}</div>
                    </CardContent>
                </Card>
            </div>

            <OverviewChart data={chartData as any} />
        </div>
    )
}
