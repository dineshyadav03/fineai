import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('Callback route hit');
    const requestUrl = new URL(request.url);
    console.log('Request URL:', requestUrl.toString());
    
    const code = requestUrl.searchParams.get('code');
    console.log('Auth code:', code ? 'Present' : 'Missing');

    if (code) {
      console.log('Exchanging code for session');
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Session exchange error:', error);
        throw error;
      }
      
      console.log('Session exchange successful');
    }

    console.log('Redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    // Redirect to auth page with error
    return NextResponse.redirect(new URL('/auth?error=auth_callback_failed', request.url));
  }
} 