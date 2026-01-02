"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createEvent, updateEvent } from "@/app/admin/events/actions"
import { Drink, Bartender, Event, EventDrink, EventBartender } from "@prisma/client"

type EventWithRelations = Event & {
    drinks: EventDrink[]
    bartenders: EventBartender[]
}

export function EventForm({
    event,
    drinks,
    bartenders,
}: {
    event?: EventWithRelations
    drinks: Drink[]
    bartenders: Bartender[]
}) {
    const action = event ? updateEvent.bind(null, event.id) : createEvent

    const selectedDrinkIds = new Set(event?.drinks.map((d: { drinkId: string }) => d.drinkId))
    const selectedBartenderIds = new Set(event?.bartenders.map((b: { bartenderId: string }) => b.bartenderId))

    return (
        <form action={action} className="space-y-8 max-w-4xl">
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Evento</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={event?.name}
                            required
                            placeholder="Festa de Verão"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                            id="date"
                            name="date"
                            type="datetime-local"
                            defaultValue={
                                event?.date
                                    ? new Date(event.date).toISOString().slice(0, 16)
                                    : ""
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Local</Label>
                        <Input
                            id="location"
                            name="location"
                            defaultValue={event?.location || ""}
                            placeholder="Clube de Praia"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="peopleCount">Quantidade de Pessoas</Label>
                        <Input
                            id="peopleCount"
                            name="peopleCount"
                            type="number"
                            min="0"
                            defaultValue={event?.peopleCount || ""}
                            placeholder="ex: 100"
                        />
                    </div>

                    {event && (
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue={event.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PLANNED">Planejado</SelectItem>
                                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                                    <SelectItem value="COMPLETED">Concluído</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Cardápio de Bebidas</Label>
                        <div className="border rounded-md p-4 h-64 overflow-y-auto space-y-2">
                            {drinks.map((drink) => (
                                <div key={drink.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`drink-${drink.id}`}
                                        name="drinks"
                                        value={drink.id}
                                        defaultChecked={selectedDrinkIds.has(drink.id)}
                                    />
                                    <Label htmlFor={`drink-${drink.id}`} className="font-normal">
                                        {drink.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Bartenders</Label>
                        <div className="border rounded-md p-4 h-48 overflow-y-auto space-y-2">
                            {bartenders.map((bartender) => (
                                <div key={bartender.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`bartender-${bartender.id}`}
                                        name="bartenders"
                                        value={bartender.id}
                                        defaultChecked={selectedBartenderIds.has(bartender.id)}
                                    />
                                    <Label
                                        htmlFor={`bartender-${bartender.id}`}
                                        className="font-normal"
                                    >
                                        {bartender.name} {bartender.surname}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="submit">{event ? "Atualizar Evento" : "Criar Evento"}</Button>
            </div>
        </form>
    )
}
