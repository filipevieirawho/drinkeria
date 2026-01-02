import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

console.log('DATABASE_URL:', process.env.DATABASE_URL)

async function main() {
    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'password', // In production, hash this!
            role: 'ADMIN',
        },
    })

    console.log({ admin })

    // Create Drinks
    const drinks = [
        {
            name: 'Mojito',
            description: 'Rum, Mint, Lime, Soda, Sugar',
            type: 'CLASSIC',
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80',
        },
        {
            name: 'Caipirinha',
            description: 'Cachaça, Lime, Sugar',
            type: 'CLASSIC',
            image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=300&q=80',
        },
        {
            name: 'Gin Tonic',
            description: 'Gin, Tonic Water, Lime',
            type: 'CLASSIC',
            image: 'https://images.unsplash.com/photo-1598155523122-3842334d6c10?auto=format&fit=crop&w=300&q=80',
        },
        {
            name: 'Aperol Spritz',
            description: 'Aperol, Prosecco, Soda',
            type: 'CLASSIC',
            image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=300&q=80',
        },
    ]

    for (const drink of drinks) {
        const d = await prisma.drink.create({
            data: drink,
        })
        console.log(`Created drink with id: ${d.id}`)
    }

    // Create Bartender
    const bartender = await prisma.bartender.create({
        data: {
            name: 'John',
            surname: 'Doe',
            phone: '123456789',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        },
    })

    console.log({ bartender })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
