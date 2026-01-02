"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ["#3B82F6", "#A855F7", "#EC4899", "#22C55E", "#EAB308", "#F97316", "#EF4444", "#06B6D4"]

type ChartData = {
    name: string
    value: number
}

const DRINK_COLORS: Record<string, string> = {
    "mojito": "#22C55E", // Green
    "margarita": "#EAB308", // Yellow
    "cosmopolitan": "#EC4899", // Pink
    "old fashioned": "#F97316", // Orange
    "negroni": "#EF4444", // Red
    "gin": "#06B6D4", // Cyan
    "aperol": "#F97316", // Orange
    "caipirinha": "#84CC16", // Lime
    "colada": "#FACC15", // Yellow
    "strawberry": "#BE123C", // Rose/Red
    "morango": "#BE123C", // Rose/Red
    "blue": "#3B82F6", // Blue
    "wine": "#881337", // Wine
    "vinho": "#881337", // Wine
    "beer": "#F59E0B", // Amber
    "cerveja": "#F59E0B", // Amber
    "whiskey": "#D97706", // Amber
    "vodka": "#94A3B8", // Slate
}

const getColorForDrink = (name: string, index: number) => {
    const lowerName = name.toLowerCase()
    for (const [key, color] of Object.entries(DRINK_COLORS)) {
        if (lowerName.includes(key)) return color
    }
    return COLORS[index % COLORS.length]
}

export function OverviewChart({ data }: { data: ChartData[] }) {
    return (
        <Card className="col-span-3 shadow-none border">
            <CardHeader>
                <CardTitle>Distribuição de Bebidas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 40,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={100} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <span className="font-medium">{data.name}:</span>
                                                    <span className="font-bold">{data.value}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                <LabelList dataKey="value" position="right" />
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColorForDrink(entry.name, index)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
