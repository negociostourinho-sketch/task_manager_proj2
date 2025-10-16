import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

// 🔹 Extende os tipos do User retornado pelo Prisma
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
      email: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    name: string
    email: string
    password?: string
  }
}

// 🔹 Extende o tipo JWT usado internamente pelo NextAuth
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
  }
}