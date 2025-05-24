import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle trailing slashes only for GET requests
  // Allow both forms for other methods like DELETE
  if (request.method === 'GET' && pathname.endsWith('/') && pathname !== '/') {
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*'
}
