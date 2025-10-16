import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🔍 [AUTH] Tentando login com:", credentials?.email)

          if (!credentials?.email || !credentials.password) {
            console.error("❌ [AUTH] Campos vazios.")
            throw new Error("E-mail e senha são obrigatórios")
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            console.error("❌ [AUTH] Usuário não encontrado.")
            throw new Error("Usuário não encontrado")
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          console.log("✅ [AUTH] Senha válida:", isValid)

          if (!isValid) {
            console.error("❌ [AUTH] Senha incorreta.")
            throw new Error("Senha incorreta")
          }

          // Retorna os dados seguros do usuário
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        } catch (err) {
          console.error("🔥 [AUTH ERROR]", err)
          throw new Error("Falha na autenticação")
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
        }
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
export default handler
