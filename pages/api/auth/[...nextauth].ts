import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Preencha e-mail e senha")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) throw new Error("Usuário não encontrado")

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error("Senha incorreta")

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },

    async session({ session, token }) {
      session.user = token.user as any
      return session
    },

    async redirect({ url, baseUrl }) {
      // Se login vier sem callback explícito, vai pro dashboard
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
}

export default NextAuth(authOptions)
