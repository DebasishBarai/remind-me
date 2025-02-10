import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { SubscriptionType } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionType?: SubscriptionType;
      createdAt?: Date;
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        // Get user data from database
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            subscriptionType: true,
            createdAt: true,
          },
        });

        // Add user data to session
        session.user = {
          ...session.user,
          id: user.id,
          subscriptionType: userData?.subscriptionType,
          createdAt: userData?.createdAt,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
