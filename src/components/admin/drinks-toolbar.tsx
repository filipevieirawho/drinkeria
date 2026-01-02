"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

export function DrinksToolbar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentType = searchParams.get("type") || "all"

    const handleTypeChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === "all") {
            params.delete("type")
        } else {
            params.set("type", value)
        }
        router.push(`/admin/drinks?${params.toString()}`)
    }

    return (
        <Select value={currentType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="CLASSIC">Clássico</SelectItem>
                <SelectItem value="SIGNATURE">Assinatura</SelectItem>
                <SelectItem value="MOCKTAIL">Mocktail (Sem Álcool)</SelectItem>
                <SelectItem value="SHOT">Shot</SelectItem>
            </SelectContent>
        </Select>
    )
}
