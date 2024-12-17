import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { serverConnection } from './app/utils/api-connection';
 
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = request.cookies.get('token');

  if (!isAuthenticated && (pathname.startsWith('/assignor') || pathname.startsWith('/payable'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  
  if (pathname.startsWith('/assignor') || pathname.startsWith('/payable')) {
    try {
      await serverConnection.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${isAuthenticated?.value}`
        }
      })
    } catch (error: any) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
