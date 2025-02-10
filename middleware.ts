import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { addDays, isAfter } from 'date-fns';
import { SubscriptionType } from "@prisma/client";
import { NextRequest } from 'next/server';

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      subscriptionType: SubscriptionType;
      createdAt: string | Date;
    }
  }
}

// middleware is applied to all routes, use conditionals to select

const publicRoutes = [
  "/",
  "/pricing",
  "/login",
  "/privacy",
  "/terms",
  "/contact",
];

export default withAuth(function middleware(req, token) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (!publicRoutes.includes(req.nextUrl.pathname) && token === null) {
        return false;
      }
      return true;
    },
  },
});

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  if (!token) {
    return NextResponse.next();
  }

  // Check if user is on free plan and trial has expired
  if (token.user?.subscriptionType === SubscriptionType.free) {
    const createdAt = new Date(token.user.createdAt);
    const trialEndDate = addDays(createdAt, 7);
    
    if (isAfter(new Date(), trialEndDate)) {
      // Redirect to pricing page if trying to access protected routes
      const protectedRoutes = ['/create', '/reminders'];
      if (protectedRoutes.some(route => request.url.includes(route))) {
        return NextResponse.redirect(new URL('/pricing', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create', '/reminders', '/dashboard'],
};
