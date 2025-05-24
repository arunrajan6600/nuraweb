import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true'
  
  // Block API access if not in admin mode
  if (pathname.startsWith('/api') && !isAdminEnabled) {
    return new NextResponse('API routes are only available in admin mode', { status: 403 })
  }

  // Handle trailing slashes only for GET requests
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
