import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/about",
    "/sign-in",
    "/sign-up",
    "/contact",
    "/help",
    "/privacy",
    "/terms",
    "/itinerary/(.*)",
    "/favorites",
    "/affiliate",
    "/api/(.*)",
    "/robots.txt",
    "/sitemap.xml",
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ["/api/webhooks(.*)"],
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 