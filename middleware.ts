import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Root Dashboard Redirection
    if (path === "/dashboard") {
      if (token?.role === "RECRUITER") {
        return NextResponse.redirect(new URL("/dashboard/recruiter", req.url));
      } else if (token?.role === "CANDIDATE") {
        return NextResponse.redirect(new URL("/dashboard/candidate", req.url));
      } else {
         // Fallback for unassigned or error states
         return NextResponse.redirect(new URL("/login?error=InvalidRole", req.url));
      }
    }

    // 2. Strict Role Segregation & Access Control
    if (path.startsWith("/dashboard/recruiter") && token?.role !== "RECRUITER") {
      // Force candidates out of recruiter routes
      return NextResponse.redirect(new URL("/dashboard/candidate", req.url));
    }

    if (path.startsWith("/dashboard/candidate") && token?.role !== "CANDIDATE") {
      // Force recruiters out of candidate routes
      return NextResponse.redirect(new URL("/dashboard/recruiter", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // The middleware will ONLY trigger if authorized returns true.
      // Returning `!!token` ensures unauthorized users are bounced to the `/login` page immediately.
      authorized: ({ token }) => !!token,
    },
  }
);

// Define the root bounds for exactly which routes invoke this middleware
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
