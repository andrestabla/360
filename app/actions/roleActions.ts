'use server';

import { db } from '@/server/db';
import { organizationSettings } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getRolePermissionsAction() {
    try {
        const settings = await db.query.organizationSettings.findFirst();
        if (!settings) return { success: false, error: 'Settings not found' };

        const policies = (settings.policies as any) || {};
        return { success: true, data: policies.roleTemplates || {} }; // Default to empty if not found
    } catch (error: any) {
        console.error('getRolePermissionsAction error:', error);
        return { success: false, error: 'Failed to fetch permissions' };
    }
}

export async function updateRolePermissionsAction(level: number, permissions: string[]) {
    try {
        const settings = await db.query.organizationSettings.findFirst();
        if (!settings) {
            // Initialize if not exists
            await db.insert(organizationSettings).values({
                id: 1,
                policies: { roleTemplates: { [level]: permissions } }
            });
        } else {
            const currentPolicies = (settings.policies as any) || {};
            const currentTemplates = currentPolicies.roleTemplates || {};

            const updatedPolicies = {
                ...currentPolicies,
                roleTemplates: {
                    ...currentTemplates,
                    [level]: permissions
                }
            };

            await db.update(organizationSettings)
                .set({ policies: updatedPolicies })
                .where(eq(organizationSettings.id, 1));
        }

        revalidatePath('/dashboard/admin/roles');
        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error('updateRolePermissionsAction error:', error);
        return { success: false, error: 'Failed to update permissions' };
    }
}

export async function resetRolePermissionsAction(templates: Record<number, string[]>) {
    try {
        const settings = await db.query.organizationSettings.findFirst();
        if (!settings) {
            await db.insert(organizationSettings).values({
                id: 1,
                policies: { roleTemplates: templates }
            });
        } else {
            const currentPolicies = (settings.policies as any) || {};

            const updatedPolicies = {
                ...currentPolicies,
                roleTemplates: templates
            };

            await db.update(organizationSettings)
                .set({ policies: updatedPolicies })
                .where(eq(organizationSettings.id, 1));
        }

        revalidatePath('/dashboard/admin/roles');
        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error('resetRolePermissionsAction error:', error);
        return { success: false, error: 'Failed to reset permissions' };
    }
}
