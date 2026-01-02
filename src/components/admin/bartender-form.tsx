"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBartender, updateBartender } from "@/app/admin/bartenders/actions"
import { Bartender } from "@prisma/client"

export function BartenderForm({ bartender }: { bartender?: Bartender }) {
    const [phone, setPhone] = useState(bartender?.phone || "")

    const action = bartender
        ? updateBartender.bind(null, bartender.id)
        : createBartender

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 11)
        let formatted = ""

        if (digits.length > 0) {
            formatted = "(" + digits.slice(0, 2)
            if (digits.length > 2) {
                formatted += ") " + digits.slice(2, 7)
                if (digits.length > 7) {
                    formatted += "-" + digits.slice(7)
                }
            }
        }

        setPhone(formatted)
    }

    return (
        <form action={action} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={bartender?.name}
                        required
                        placeholder="João"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="surname">Sobrenome</Label>
                    <Input
                        id="surname"
                        name="surname"
                        defaultValue={bartender?.surname}
                        required
                        placeholder="Silva"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(31) 98765-4321"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="photo">URL da Foto</Label>
                <Input
                    id="photo"
                    name="photo"
                    defaultValue={bartender?.photo || ""}
                    placeholder="https://..."
                />
            </div>

            <hr className="my-6" />

            <div className="space-y-2">
                <Label htmlFor="email">E-mail (Login)</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={bartender?.email || ""}
                    placeholder="ex: joao@exemplo.com"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={bartender ? "Deixe em branco para manter a atual" : "Senha para login"}
                    required={!bartender}
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="submit">
                    {bartender ? "Atualizar Bartender" : "Criar Bartender"}
                </Button>
            </div>
        </form>
    )
}
