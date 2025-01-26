import { withAuth } from "next-auth/middleware";

// middleware is applied to all routes, use conditionals to select

const publicRoutes = [
  "/",
  "/pricing",
  "/login",
  "/privacy-policy",
  "/terms-of-use",
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
