import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// This is a simplified auth setup for the MVP
// In a real app, you would use a proper authentication system
export const auth = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a simple check for demo purposes
        // In a real app, you would check against your database
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
});
