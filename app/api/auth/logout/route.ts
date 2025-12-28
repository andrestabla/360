import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Clear the session cookie
        const cookieStore = await cookies();
        cookieStore.delete('authjs.session-token');
        cookieStore.delete('__Secure-authjs.session-token');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
    }
}
