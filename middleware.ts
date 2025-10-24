import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

export function middleware(request: NextRequest) {
  // Simple middleware that just passes through the request
  // This is a minimal middleware to avoid Edge Function size limits
  return NextResponse.next();
}
