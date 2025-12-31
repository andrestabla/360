'use server';

import { db } from '@/server/db';
import { projects, projectPhases, projectActivities, users } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

// --- PROJECTS ---

export async function getProjectsAction() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        const allProjects = await db.query.projects.findMany({
            with: {
                phases: {
                    with: {
                        activities: true
                    },
                    orderBy: (phases, { asc }) => [asc(phases.order)]
                }
            },
            orderBy: (projects, { desc }) => [desc(projects.createdAt)]
        });
        return { success: true, data: allProjects };
    } catch (e: any) {
        console.error('Get Projects Error:', e);
        return { success: false, error: e.message };
    }
}

export async function createProjectAction(data: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const userId = session.user.id; // Extract here where it is guaranteed

    try {
        const { phases, ...projectData } = data;

        const result = await db.transaction(async (tx) => {
            await tx.insert(projects).values({
                ...projectData,
                creatorId: userId,
                managerId: projectData.managerId || userId,
                participants: projectData.participants || [],
                createdAt: new Date(),
                updatedAt: new Date()
            });

            if (phases && Array.isArray(phases)) {
                for (const phase of phases) {
                    const { activities, ...phaseFields } = phase;
                    await tx.insert(projectPhases).values({ ...phaseFields, projectId: projectData.id });
                }
            }
            return projectData;
        });

        revalidatePath('/dashboard/workflows');
        return { success: true, data: result };
    } catch (e: any) {
        console.error('Create Project Error:', e);
        return { success: false, error: e.message };
    }
}

export async function updateProjectAction(id: string, updates: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        const { phases, ...projectData } = updates;

        await db.transaction(async (tx) => {
            // 1. Update Project Fields
            if (Object.keys(projectData).length > 0) {
                // Ensure participants is consistent JSON
                if (projectData.participants && Array.isArray(projectData.participants)) {
                    // Start of cleaning if needed
                }

                await tx.update(projects)
                    .set({ ...projectData, updatedAt: new Date() })
                    .where(eq(projects.id, id));
            }

            // 2. Sync Phases (if provided)
            if (phases && Array.isArray(phases)) {
                // Fetch existing phases to find deletions
                const existingPhases = await tx.select().from(projectPhases).where(eq(projectPhases.projectId, id));
                const incomingPhaseIds = new Set(phases.map((p: any) => p.id));

                // Delete removed phases
                for (const existing of existingPhases) {
                    if (!incomingPhaseIds.has(existing.id)) {
                        await tx.delete(projectPhases).where(eq(projectPhases.id, existing.id));
                    }
                }

                // Upsert phases
                for (const phase of phases) {
                    const { activities, ...phaseFields } = phase;

                    await tx.insert(projectPhases)
                        .values({
                            ...phaseFields,
                            projectId: id,
                            updatedAt: new Date()
                        })
                        .onConflictDoUpdate({
                            target: projectPhases.id,
                            set: { ...phaseFields, updatedAt: new Date() }
                        });

                    // 3. Sync Activities
                    if (activities && Array.isArray(activities)) {
                        const existingActivities = await tx.select().from(projectActivities).where(eq(projectActivities.phaseId, phase.id));
                        const incomingActivityIds = new Set(activities.map((a: any) => a.id));

                        // Delete removed activities
                        for (const existingAct of existingActivities) {
                            if (!incomingActivityIds.has(existingAct.id)) {
                                await tx.delete(projectActivities).where(eq(projectActivities.id, existingAct.id));
                            }
                        }

                        // Upsert activities
                        for (const act of activities) {
                            await tx.insert(projectActivities)
                                .values({
                                    ...act,
                                    phaseId: phase.id,
                                    updatedAt: new Date()
                                })
                                .onConflictDoUpdate({
                                    target: projectActivities.id,
                                    set: { ...act, updatedAt: new Date() }
                                });
                        }
                    }
                }
            }
        });

        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (e: any) {
        console.error('Update Project Error:', e);
        return { success: false, error: e.message };
    }
}

export async function deleteProjectAction(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        await db.delete(projects).where(eq(projects.id, id));
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// --- PHASES ---

export async function createPhaseAction(data: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        await db.insert(projectPhases).values({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updatePhaseAction(id: string, updates: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        await db.update(projectPhases)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(projectPhases.id, id));
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deletePhaseAction(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        await db.delete(projectPhases).where(eq(projectPhases.id, id));
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}


// --- ACTIVITIES ---

export async function createActivityAction(data: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        await db.insert(projectActivities).values({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateActivityAction(id: string, updates: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        await db.update(projectActivities)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(projectActivities.id, id));
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteActivityAction(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        await db.delete(projectActivities).where(eq(projectActivities.id, id));
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
