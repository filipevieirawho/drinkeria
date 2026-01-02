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
                console.log("Auth attempt for:", credentials?.username)

                // DEBUG: Check the DATABASE_URL
                const dbUrl = process.env.DATABASE_URL;
                if (dbUrl) {
                    console.log("DEBUG: DATABASE_URL length:", dbUrl.length);
                    console.log("DEBUG: DATABASE_URL starts with:", dbUrl.substring(0, 25)); // Show protocol and part of user
                    console.log("DEBUG: DATABASE_URL ends with:", dbUrl.substring(dbUrl.length - 20)); // Show port/db/params
                } else {
                    console.log("DEBUG: DATABASE_URL is UNDEFINED");
                }

                if (!credentials?.username || !credentials?.password) {
                    console.log("Missing credentials")
                    return null
                }

                try {
                    // First, check the User table (Admins)
                    const user = await prisma.user.findUnique({
                        where: {
                            username: credentials.username,
                        },
                    })

                    console.log("User found in DB:", user ? "Yes" : "No")

                    if (user) {
                        // In production, compare hashed password!
                        if (user.password !== credentials.password) {
                            console.log("Password mismatch for user")
                            return null
                        }

                        console.log("Login successful for admin")
                        return {
                            id: user.id,
                            name: user.username,
                            role: user.role,
                            userType: "user",
                        }
                    }

                    // Second, check the Bartender table (Bartenders)
                    const bartender = await prisma.bartender.findUnique({
                        where: {
                            email: credentials.username,
                        },
                    })

                    console.log("Bartender found in DB:", bartender ? "Yes" : "No")

                    if (bartender && bartender.password) {
                        // In production, compare hashed password!
                        if (bartender.password !== credentials.password) {
                            console.log("Password mismatch for bartender")
                            return null
                        }

                        console.log("Login successful for bartender")
                        return {
                            id: bartender.id,
                            name: `${bartender.name} ${bartender.surname}`,
                            role: bartender.email === "filipevieirawho@gmail.com" ? "ADMIN" : "BARTENDER",
                            userType: "bartender",
                        }
                    }
                } catch (error) {
                    console.error("Database error during auth:", error)
                }

                console.log("Auth failed: User not found or error")
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
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.userType = (user as any).userType
            }
            return token
        },
    },
}
