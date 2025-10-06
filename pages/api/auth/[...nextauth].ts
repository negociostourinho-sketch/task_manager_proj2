import NextAuth from 'next-auth'
export default NextAuth({ providers: [], secret: process.env.NEXTAUTH_SECRET })
