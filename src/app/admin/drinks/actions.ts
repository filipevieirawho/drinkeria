"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createDrink(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    let ingredients = formData.get("ingredients") as string
    const type = formData.get("type") as string
    const image = formData.get("image") as string
    const preparationTime = Number(formData.get("preparationTime")) || 5

    // Validate and clean ingredients JSON
    try {
        const parsed = JSON.parse(ingredients)
        if (Array.isArray(parsed)) {
            const cleaned = parsed.filter((i: any) => i.name?.trim() || i.quantity?.trim())
            ingredients = JSON.stringify(cleaned)
        }
    } catch (e) {
        // If it's not valid JSON, keep it as is
    }

    await prisma.drink.create({
        data: {
            name,
            description,
            ingredients,
            type,
            preparationTime,
            image,
            active: true,
        },
    })

    revalidatePath("/admin/drinks")
    redirect("/admin/drinks")
}

export async function updateDrink(id: string, formData: FormData) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    let ingredients = formData.get("ingredients") as string
    const type = formData.get("type") as string
    const image = formData.get("image") as string
    const active = formData.get("active") === "on"
    const preparationTime = Number(formData.get("preparationTime")) || 5

    // Validate and clean ingredients JSON
    try {
        const parsed = JSON.parse(ingredients)
        if (Array.isArray(parsed)) {
            const cleaned = parsed.filter((i: any) => i.name?.trim() || i.quantity?.trim())
            ingredients = JSON.stringify(cleaned)
        }
    } catch (e) {
        // If it's not valid JSON, keep it as is (backward compatibility or empty)
    }

    await prisma.drink.update({
        where: { id },
        data: {
            name,
            description,
            ingredients,
            type,
            preparationTime,
            image,
            active,
        },
    })

    revalidatePath("/admin/drinks")
    redirect("/admin/drinks")
}

export async function deleteDrink(id: string) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    await prisma.drink.delete({
        where: { id },
    })

    revalidatePath("/admin/drinks")
    redirect("/admin/drinks")
}

export async function toggleDrinkStatus(id: string, currentStatus: boolean) {
    await prisma.drink.update({
        where: { id },
        data: { active: !currentStatus },
    })
    revalidatePath("/admin/drinks")
}
