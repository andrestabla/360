import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user?.id) {
            return NextResponse.json({ success: false, error: 'No session found' }, { status: 401 });
        }

        // Fetch fresh user data from DB to ensure preferences/avatar are up to date
        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image || user.avatar, // support both fields
                unit: user.unit,
                title: user.jobTitle,
                preferences: user.preferences,
                isSuperAdmin: user.role === 'SUPER_ADMIN',
                // Include other profile fields needed by context
                phone: user.phone,
                location: user.location,
                bio: user.bio,
                language: user.language,
                timezone: user.timezone,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Session verification error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
