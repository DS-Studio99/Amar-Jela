import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            cookies: {
                getAll() { return request.cookies.getAll(); },
                setAll(cookiesToSet: any[]) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Protected user routes
    const userRoutes = ['/dashboard', '/service', '/settings', '/profile', '/notifications', '/contact'];
    const isUserRoute = userRoutes.some(r => pathname.startsWith(r));

    // Admin routes (excluding /admin login page)
    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin';

    if (isUserRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAdminRoute && !user) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // If logged-in user visits login/register, redirect to dashboard
    if (user && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
