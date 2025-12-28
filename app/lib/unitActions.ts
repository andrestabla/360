'use server';

import { db } from '@/server/db';
import { units, users } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getUnitsAction() {
    try {
        const result = await db.select().from(units);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching units:', error);
        return { success: false, error: 'Error al obtener las unidades' };
    }
}

export async function getEligibleUsersAction() {
    try {
        const result = await db.select({
            id: users.id,
            name: users.name,
            role: users.role,
            jobTitle: users.jobTitle
        }).from(users);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching eligible users:', error);
        return { success: false, error: 'Error al obtener usuarios' };
    }
}

export async function createUnitAction(data: any) {
    try {
        const id = data.id || `unit-${Date.now()}`;

        // Generate hierarchical path and level
        let parentPath = '';
        let level = 0;
        if (data.parentId) {
            const parent = await db.query.units.findFirst({
                where: eq(units.id, data.parentId)
            });
            if (parent) {
                parentPath = parent.path || '';
                level = (parent.level || 0) + 1;
            }
        }
        const path = parentPath ? `${parentPath}/${data.code}` : `/${data.code}`;

        const newUnit = {
            ...data,
            id,
            path,
            level,
            createdAt: new Date(),
        };

        await db.insert(units).values(newUnit);
        revalidatePath('/dashboard/admin/units');
        return { success: true, unit: newUnit };
    } catch (error: any) {
        console.error('Error creating unit:', error);
        if (error.code === '23505') {
            return { success: false, error: 'El código de la unidad ya existe' };
        }
        return { success: false, error: 'Error al crear la unidad' };
    }
}

export async function updateUnitAction(id: string, updates: any) {
    try {
        const oldUnit = await db.query.units.findFirst({
            where: eq(units.id, id)
        });

        if (!oldUnit) return { success: false, error: 'Unidad no encontrada' };

        // Calculate new path and level if code or parentId changes
        let newPath = oldUnit.path || '';
        let newLevel = oldUnit.level || 0;
        const hasParentIdChanged = updates.parentId !== undefined && updates.parentId !== oldUnit.parentId;
        const hasCodeChanged = updates.code !== undefined && updates.code !== oldUnit.code;

        if (hasParentIdChanged || hasCodeChanged) {
            let parentPath = '';
            const parentId = updates.parentId !== undefined ? updates.parentId : oldUnit.parentId;
            const code = updates.code !== undefined ? updates.code : oldUnit.code;

            if (parentId) {
                const parent = await db.query.units.findFirst({
                    where: eq(units.id, parentId)
                });
                if (parent) {
                    parentPath = parent.path || '';
                    newLevel = (parent.level || 0) + 1;
                }
            } else {
                newLevel = 0;
            }
            newPath = parentPath ? `${parentPath}/${code}` : `/${code}`;
        }

        const dataToUpdate = { ...updates, path: newPath, level: newLevel };
        await db.update(units).set(dataToUpdate).where(eq(units.id, id));

        // If path changed, update all descendants recursively
        if (newPath !== oldUnit.path) {
            await updateDescendantsPath(id, newPath, newLevel);
        }

        revalidatePath('/dashboard/admin/units');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating unit:', error);
        if (error.code === '23505') {
            return { success: false, error: 'El código de la unidad ya existe' };
        }
        return { success: false, error: 'Error al actualizar la unidad' };
    }
}

async function updateDescendantsPath(parentId: string, parentPath: string, parentLevel: number) {
    const children = await db.select().from(units).where(eq(units.parentId, parentId));

    for (const child of children) {
        const newChildPath = `${parentPath}/${child.code}`;
        const newChildLevel = parentLevel + 1;
        await db.update(units).set({ path: newChildPath, level: newChildLevel }).where(eq(units.id, child.id));
        await updateDescendantsPath(child.id, newChildPath, newChildLevel);
    }
}

export async function deleteUnitAction(id: string) {
    try {
        // Check if it has children
        const childrenCount = await db.select({ count: sql<number>`count(*)` }).from(units).where(eq(units.parentId, id));
        if (Number(childrenCount[0].count) > 0) {
            return { success: false, error: 'No se puede eliminar una unidad con sub-unidades' };
        }

        await db.delete(units).where(eq(units.id, id));
        revalidatePath('/dashboard/admin/units');
        return { success: true };
    } catch (error) {
        console.error('Error deleting unit:', error);
        return { success: false, error: 'Error al eliminar la unidad' };
    }
}
