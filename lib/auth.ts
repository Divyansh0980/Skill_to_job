import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    // Use JWT to manage sessions securely and flexibly
    strategy: "jwt", 
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      // Minimal profile definition; the adapter handles basic mapping
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

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // 1. JWT Callback: Fires whenever a JSON Web Token is created or updated
    async jwt({ token, user, account, profile, trigger, session }) {
      // The 'user' and 'account' objects are only passed in on the VERY FIRST sign-in
      if (account && user) {
        let assignedRole = "CANDIDATE"; // Default fallback

        if (account.provider === "github") {
          assignedRole = "CANDIDATE";

          // Safely upsert a CandidateProfile tying the GitHub URL to the new account without duplicates
          await prisma.candidateProfile.upsert({
            where: { userId: user.id },
            update: {}, // Do nothing if the profile somehow already exists
            create: {
              userId: user.id,
              githubUrl: (profile as any)?.html_url || null, // Provided natively by GitHub OAuth
            },
          });
          
        } else if (account.provider === "google" || account.provider === "credentials") {
          assignedRole = "RECRUITER";
        }

        // The Prisma Adapter automatically creates OAuth users with the schema default (CANDIDATE).
        // Since we want Google users to be RECRUITERs, we must persist this directly to the DB!
        if (assignedRole !== "CANDIDATE") {
           await prisma.user.update({
             where: { id: user.id },
             data: { role: assignedRole as any }, // Enforces the Prisma custom "Role" Enum 
           });
        }

        // Attach user info to the encrypted JWT token
        token.id = user.id;
        token.role = assignedRole;
      }

      // Optional: Allows manual session updating from the client side
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },
    // 2. Session Callback: Fires whenever the client checks the session (e.g. useSession)
    async session({ session, token }) {
      // Send properties from the token down to the client-side session securely
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
