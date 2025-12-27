import DashboardLayoutClient from './DashboardLayoutClient';
import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (session?.user?.id) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                mustChangePassword: true
            }
        });

        if (user?.mustChangePassword) {
            redirect('/auth/change-password');
        }
    }

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
