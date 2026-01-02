"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createBartender(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const surname = formData.get("surname") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string
    const photo = formData.get("photo") as string

    await prisma.bartender.create({
        data: {
            name,
            surname,
            email: email || null,
            password: password || null,
            phone,
            photo,
        },
    })

    revalidatePath("/admin/bartenders")
    redirect("/admin/bartenders")
}

export async function updateBartender(id: string, formData: FormData) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const surname = formData.get("surname") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string
    const photo = formData.get("photo") as string

    const data: any = {
        name,
        surname,
        email: email || null,
        phone,
        photo,
    }

    if (password) {
        data.password = password
    }

    await prisma.bartender.update({
        where: { id },
        data,
    })

    revalidatePath("/admin/bartenders")
    redirect("/admin/bartenders")
}

export async function deleteBartender(id: string) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    await prisma.bartender.delete({
        where: { id },
    })

    revalidatePath("/admin/bartenders")
    redirect("/admin/bartenders")
}
