import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login", 
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        let assignedRole = user.role || "CANDIDATE"; // Fallback to candidate

        if (account.provider !== "credentials") {
          // Identify the intended role mapping explicitly assigned by the unified OAuth buttons
          const cookieStore = cookies();
          const intendedRole = cookieStore.get("intended_role")?.value;
          
          if (intendedRole === "CANDIDATE" || intendedRole === "RECRUITER") {
             assignedRole = intendedRole;
             // Ensure the database strictly matches the targeted UI intent globally
             await prisma.user.update({
               where: { id: user.id },
               data: { role: assignedRole }
             });
          }

          // Trigger candidate extraction algorithms automatically if they utilize GitHub
          if (account.provider === "github" && assignedRole === "CANDIDATE") {
            await prisma.candidateProfile.upsert({
              where: { userId: user.id },
              update: {},
              create: {
                userId: user.id,
                githubUrl: (profile as any)?.html_url || null,
              },
            });
          }
        }

        token.id = user.id;
        token.role = assignedRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
