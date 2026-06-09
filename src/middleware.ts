import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/api/v1/health',
  '/api/v1/auth/login',
  '/_next',
  '/favicon.ico',
];

const PUBLIC_API_PREFIXES = [
  '/api/v1/health',
  '/api/v1/auth/login',
  '/api/v1/auth/mfa',
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return true;
  }
  if (pathname === '/' || pathname === '') return true;
  return false;
}

function isApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p));
}

function getCookie(request: NextRequest, name: string): string | undefined {
  return request.cookies.get(name)?.value;
}

function isValidSessionFormat(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  if (!cookieValue.startsWith('s1_')) return false;
  if (cookieValue.length < 10) return false;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname) || isPublicApiPath(pathname)) {
    return NextResponse.next();
  }

  const sessionId = getCookie(request, 'session_id');

  if (!isValidSessionFormat(sessionId)) {
    if (isApiPath(pathname) && !isPublicApiPath(pathname)) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'not_authenticated' } },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
