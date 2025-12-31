'use server';

import { sendNotificationEmail } from '@/lib/services/tenantEmailService';

interface ActivityAssignmentDetails {
    projectName: string;
    phaseName: string;
    activityName: string;
    startDate?: string;
    endDate?: string;
    assigneeEmail: string;
    assigneeName: string;
}

export async function sendAssignmentNotification(details: ActivityAssignmentDetails) {
    try {
        const title = `Nueva asignación: ${details.activityName}`;

        const message = `
            Hola ${details.assigneeName},
            
            Se te ha asignado una nueva actividad en el proyecto <strong>${details.projectName}</strong>.
            
            <br/><br/>
            <strong>Detalles de la actividad:</strong><br/>
            <ul>
                <li><strong>Fase:</strong> ${details.phaseName}</li>
                <li><strong>Actividad:</strong> ${details.activityName}</li>
                <li><strong>Fecha Inicio:</strong> ${details.startDate || 'No definida'}</li>
                <li><strong>Fecha Fin:</strong> ${details.endDate || 'No definida'}</li>
            </ul>
            
            <br/>
            Por favor, revisa la plataforma para más detalles.
        `;

        const result = await sendNotificationEmail(
            details.assigneeEmail,
            title,
            message
        );

        return result;
    } catch (error: any) {
        console.error('Error in sendAssignmentNotification:', error);
        return { success: false, error: error.message };
    }
}
