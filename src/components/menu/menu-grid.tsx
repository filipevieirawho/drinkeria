import { Drink, EventDrink } from "@prisma/client"
import { MenuDrinkButton } from "@/components/menu/menu-drink-button"

type DrinkWithDetails = EventDrink & {
    drink: Drink
}

interface MenuGridProps {
    drinks: DrinkWithDetails[]
    onSelectDrink: (drink: Drink) => void
}

export function MenuGrid({ drinks, onSelectDrink }: MenuGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4 content-start">
            {drinks.map(({ drink }) => (
                <MenuDrinkButton
                    key={drink.id}
                    drink={drink}
                    onClick={() => onSelectDrink(drink)}
                />
            ))}
        </div>
    )
}
