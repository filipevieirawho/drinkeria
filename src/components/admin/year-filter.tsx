"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface YearFilterProps {
    years: number[]
}

export function YearFilter({ years }: YearFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentYear = searchParams.get("year") || "all"

    const handleYearChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            params.delete("year")
        } else {
            params.set("year", value)
        }
        router.push(`/admin?${params.toString()}`)
    }

    return (
        <Select value={currentYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos os anos</SelectItem>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
