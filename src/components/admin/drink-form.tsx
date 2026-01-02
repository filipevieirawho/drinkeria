"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createDrink, updateDrink } from "@/app/admin/drinks/actions"
import { Drink } from "@prisma/client"

export function DrinkForm({ drink }: { drink?: Drink }) {
    const action = drink ? updateDrink.bind(null, drink.id) : createDrink

    return (
        <form action={action} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={drink?.name}
                    required
                    placeholder="ex: Mojito"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={drink?.description || ""}
                    placeholder="Breve descrição da bebida"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredientes</Label>
                <Input
                    id="ingredients"
                    name="ingredients"
                    defaultValue={drink?.ingredients || ""}
                    placeholder="ex: Rum, Hortelã, Limão"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                    id="image"
                    name="image"
                    defaultValue={drink?.image || ""}
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select name="type" defaultValue={drink?.type || "CLASSIC"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CLASSIC">Clássico</SelectItem>
                        <SelectItem value="SIGNATURE">Assinatura</SelectItem>
                        <SelectItem value="MOCKTAIL">Mocktail (Sem Álcool)</SelectItem>
                        <SelectItem value="SHOT">Shot</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {drink && (
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        defaultChecked={drink.active}
                        className="h-4 w-4"
                    />
                    <Label htmlFor="active">Ativo</Label>
                </div>
            )}

            <div className="flex justify-end gap-4">
                <Button type="submit">{drink ? "Atualizar Bebida" : "Criar Bebida"}</Button>
            </div>
        </form>
    )
}
