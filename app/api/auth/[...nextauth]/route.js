import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
          credentials.email,
        ]);

        if (rows.length === 0) throw new Error("No user found");

        const user = rows[0];
        const valid = await bcrypt.compare(credentials.password, user.password);

        if (!valid) throw new Error("Invalid password");

        return {
          id: user.user_id.toString(),
          email: user.email,
          name: user.nama,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.avatar = token.avatar;
      return session;
    },
  },

  // 🔥 FIX AVATAR HILANG → Refresh token setiap kali profile berubah
  events: {
    async update({ token }) {
      const [rows] = await pool.query(
        "SELECT avatar FROM users WHERE user_id = ?",
        [token.id]
      );

      if (rows.length > 0) {
        token.avatar = rows[0].avatar;
      }
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
