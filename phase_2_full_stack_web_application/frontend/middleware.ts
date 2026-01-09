import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/tasks', '/tasks/new', '/tasks/', '/dashboard'];

export function middleware(request: NextRequest) {
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // For cross-origin setup, the auth cookie is set on the backend domain
  // so we can't access it in frontend middleware. Instead, let the request
  // pass through and let ProtectedRoute components handle authentication.
  // This allows the frontend to make API calls to verify authentication.

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
    // Specifically include protected routes
    '/tasks/:path*',
    '/dashboard/:path*',
  ],
};
