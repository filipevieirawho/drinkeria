"use client"

import { useState } from "react"
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
import { Plus, Trash2 } from "lucide-react"

type Ingredient = {
    quantity: string
    name: string
}

export function DrinkForm({ drink }: { drink?: Drink }) {
    const action = drink ? updateDrink.bind(null, drink.id) : createDrink

    // Parse initial ingredients
    const getInitialIngredients = (): Ingredient[] => {
        if (!drink?.ingredients) return [{ quantity: "", name: "" }]
        try {
            const parsed = JSON.parse(drink.ingredients)
            if (Array.isArray(parsed)) return parsed
            return [{ quantity: "", name: drink.ingredients }]
        } catch {
            return [{ quantity: "", name: drink.ingredients }]
        }
    }

    const [ingredients, setIngredients] = useState<Ingredient[]>(getInitialIngredients())

    const addIngredient = () => {
        setIngredients([...ingredients, { quantity: "", name: "" }])
    }

    const removeIngredient = (index: number) => {
        const newIngredients = [...ingredients]
        newIngredients.splice(index, 1)
        setIngredients(newIngredients)
    }

    const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
        const newIngredients = [...ingredients]
        newIngredients[index][field] = value
        setIngredients(newIngredients)
    }

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
                <Label>Ingredientes</Label>
                <input type="hidden" name="ingredients" value={JSON.stringify(ingredients)} />
                <div className="space-y-3">
                    {ingredients.map((ing, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <div className="w-24 flex-shrink-0">
                                <Input
                                    placeholder="Qtd."
                                    value={ing.quantity}
                                    onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    placeholder="Ingrediente (ex: Rum Carta Branca)"
                                    value={ing.name}
                                    onChange={(e) => updateIngredient(index, "name", e.target.value)}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeIngredient(index)}
                                disabled={ingredients.length === 1 && !ingredients[0].name && !ingredients[0].quantity}
                            >
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" size="sm" onClick={addIngredient} className="mt-2 bg-saas-blue hover:bg-saas-blue/90 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Ingrediente
                </Button>
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select name="type" defaultValue={drink?.type || "CLASSIC"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CLASSIC">Clássicos</SelectItem>
                            <SelectItem value="SIGNATURE">Assinatura</SelectItem>
                            <SelectItem value="MOCKTAIL">Mocktail (Sem Álcool)</SelectItem>
                            <SelectItem value="SHOT">Shot</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="preparationTime">Tempo de Preparo (segundos)</Label>
                    <Input
                        id="preparationTime"
                        name="preparationTime"
                        type="number"
                        min="1"
                        defaultValue={drink?.preparationTime || 60}
                        required
                    />
                </div>
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
