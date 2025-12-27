
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'No session found' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: (session.user as any).role,
                // @ts-ignore
                isSuperAdmin: (session.user as any).role === 'SUPER_ADMIN',
            }
        });

    } catch (error) {
        console.error('Session verification error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
