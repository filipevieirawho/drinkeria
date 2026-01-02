import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                try {
                    // First, check the User table (Admins)
                    const user = await prisma.user.findUnique({
                        where: {
                            username: credentials.username,
                        },
                    })

                    if (user) {
                        // In production, compare hashed password!
                        if (user.password !== credentials.password) {
                            return null
                        }

                        return {
                            id: user.id,
                            name: user.username,
                            role: user.role,
                            userType: "user",
                            image: null,
                        }
                    }

                    // Second, check the Bartender table (Bartenders)
                    const bartender = await prisma.bartender.findUnique({
                        where: {
                            email: credentials.username,
                        },
                    })

                    if (bartender && bartender.password) {
                        // In production, compare hashed password!
                        if (bartender.password !== credentials.password) {
                            return null
                        }

                        return {
                            id: bartender.id,
                            name: `${bartender.name} ${bartender.surname}`,
                            role: bartender.email === "filipevieirawho@gmail.com" ? "ADMIN" : "BARTENDER",
                            userType: "bartender",
                            image: bartender.photo,
                        }
                    }
                } catch (error) {
                    // Consider logging the error to an external service in production
                }

                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.userType = token.userType as string
                session.user.image = token.picture
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.userType = (user as any).userType
                token.picture = user.image
            }
            return token
        },
    },
}
