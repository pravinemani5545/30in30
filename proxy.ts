import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// All day routes require auth — login once to access the whole site
const authRequiredPrefixes = ["/day"];

// API routes that are explicitly public (no auth needed)
const publicApiPaths = [
  "/api/day4/unsubscribe",
  "/api/day4/cron",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — MUST call getUser() not getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Check if this is a protected page route
  const isProtectedPage = authRequiredPrefixes.some((prefix) =>
    path.startsWith(prefix)
  );

  // Check if this is a protected API route (all /api/dayN/ except explicitly public)
  const isApiRoute = path.startsWith("/api/day");
  const isPublicApi = publicApiPaths.some((p) => path.startsWith(p));
  const isProtectedApi = isApiRoute && !isPublicApi;

  if (!user && (isProtectedPage || isProtectedApi)) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authed users away from login
  if (user && path === "/login") {
    const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
