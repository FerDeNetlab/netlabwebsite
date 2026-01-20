import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          hd: 'netlab.mx', // Solo permite @netlab.mx
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Validar que el email termine en @netlab.mx
      return user.email?.endsWith('@netlab.mx') ?? false
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.AUTH_SECRET,
})
