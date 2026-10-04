import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

/**
 * NextAuth: Google OAuth when GOOGLE_CLIENT_ID/SECRET are set.
 * Email OTP requires SMTP (SMTP_HOST/…); in demo we expose an "email-demo"
 * credentials provider so My Library works out of the box — swap it for
 * next-auth's EmailProvider once SMTP env vars exist.
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "ukweli-demo-secret-change-me",
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      id: "email-demo",
      name: "Email",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        if (!email || !email.includes("@")) return null;
        const name = credentials?.name?.trim() || email.split("@")[0];
        return { id: email, name, email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};
