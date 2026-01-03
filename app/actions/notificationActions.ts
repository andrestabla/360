'use server';

import { db } from '@/server/db';
import { users, documents } from '@/shared/schema';
import { eq, inArray } from 'drizzle-orm';
import { sendNotificationEmail } from '@/lib/services/tenantEmailService';
import { auth } from '@/lib/auth';

export async function sendDocumentNotificationAction(
    documentId: string,
    recipientUserIds: string[],
    message: string
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // 1. Get Document Details
    const doc = await db.query.documents.findFirst({
        where: eq(documents.id, documentId),
        with: {
            unit: true
        }
    });

    if (!doc) throw new Error("Documento no encontrado");

    // 2. Get Sender Details (Current User)
    const sender = session.user;

    // 3. Get Recipients
    const recipients = await db.select().from(users).where(inArray(users.id, recipientUserIds));

    if (recipients.length === 0) return { success: false, error: "No se encontraron destinatarios válidos" };

    // 4. Send Emails
    const results = await Promise.all(recipients.map(async (recipient) => {
        if (!recipient.email) return { success: false, userId: recipient.id, error: "No email" };

        const emailTitle = `Novedad en Documento: ${doc.title}`;
        const emailBody = `
            <p>Hola <strong>${recipient.name}</strong>,</p>
            <p><strong>${sender.name}</strong> te ha enviado una notificación relacionada con el documento:</p>
            <blockquote style="border-left: 4px solid #7c3aed; padding-left: 1rem; margin: 1rem 0; color: #555;">
                <p><strong>Documento:</strong> ${doc.title}</p>
                <p><strong>Unidad:</strong> ${doc.unit?.name || 'General'}</p>
                <p><strong>Proceso:</strong> ${doc.process || 'N/A'}</p>
                <p><strong>Versión:</strong> ${doc.version || '1.0'}</p>
            </blockquote>
            <p><strong>Mensaje:</strong></p>
            <p style="background: #f5f3ff; padding: 1rem; border-radius: 0.5rem;">${message}</p>
            <p><a href="${process.env.NEXTAUTH_URL}/dashboard/repository?docId=${doc.id}" style="display: inline-block; padding: 0.5rem 1rem; background: #7c3aed; color: white; text-decoration: none; border-radius: 0.375rem;">Ver Documento</a></p>
        `;

        return await sendNotificationEmail(recipient.email, emailTitle, emailBody);
    }));

    // Check partial success
    const failures = results.filter(r => !r.success);
    if (failures.length === results.length) {
        return { success: false, error: "Falló el envío de todos los correos" };
    }

    return { success: true, sentCount: results.length - failures.length };
}
