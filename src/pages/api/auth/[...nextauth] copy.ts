import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:4000/usuario/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        if (res.ok && user) {
          return user; // Devuelve los datos del usuario si es exitoso
        }
        throw new Error(user?.message || "Login failed");
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user; // Incluye información adicional en la sesión
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  debug: true, // Activa el modo de depuración para identificar problemas
  session: {
    strategy: "jwt", // Usa JWT en lugar de sesiones de base de datos
  },
});
