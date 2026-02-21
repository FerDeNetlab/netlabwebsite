import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { sql } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          hd: 'netlab.mx',
          prompt: 'select_account',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email?.endsWith('@netlab.mx')) {
        return false
      }

      // Guardar usuario en la BD si no existe
      try {
        // Asegurarse de que existe el schema y la tabla (opcional, pero ayuda a debuggear)
        const existingUser = await sql`
          SELECT id FROM neon_auth.user WHERE email = ${user.email}
        ` as Record<string, unknown>[]

        if (existingUser.length === 0) {
          await sql`
            INSERT INTO neon_auth.user (id, email, name, image, "emailVerified", "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), ${user.email}, ${user.name}, ${user.image}, true, NOW(), NOW())
          `
        }
      } catch (error) {
        console.error('[Auth] Error guardando usuario:', error)
        // No bloqueamos el login si falla la base de datos, 
        // pero podrías retornar false si es crítico.
      }

      return true
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.AUTH_SECRET,
})
