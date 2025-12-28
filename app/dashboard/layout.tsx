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

    // 1. Validación de seguridad básica
    if (!session?.user) {
        redirect('/login');
    }

    let currentUserData = null;

    // 2. Obtener datos frescos de la DB (para tener el rol y nivel actualizados)
    if (session?.user?.id) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (user?.mustChangePassword) {
            redirect('/auth/change-password');
        }

        // Preparamos el objeto para el cliente (sin password)
        if (user) {
            currentUserData = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                level: user.level,
                initials: user.initials || user.name.substring(0, 2).toUpperCase(),
                avatar: user.avatar,
                unitId: user.unit // Aseguramos compatibilidad con el esquema
            };
        }
    }

    // 3. Pasamos 'initialUser' al cliente
    return (
        <DashboardLayoutClient initialUser={currentUserData}>
            {children}
        </DashboardLayoutClient>
    );
}
