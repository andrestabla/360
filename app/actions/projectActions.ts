'use server';

import { db } from '@/server/db';
import { projects, projectPhases, projectActivities, users, projectFolders, InsertProjectFolder, tasks } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

// --- FOLDERS ---

export async function createProjectFolderAction(data: InsertProjectFolder) {
    try {
        await db.insert(projectFolders).values(data);
        revalidatePath('/dashboard/workflows');
        return { success: true, data };
    } catch (error: any) {
        console.error('createProjectFolderAction error:', error);
        return { success: false, error: error.message || 'Failed to create folder' };
    }
}

export async function updateProjectFolderAction(id: string, data: Partial<InsertProjectFolder>) {
    try {
        await db.update(projectFolders).set({
            ...data,
            updatedAt: new Date()
        }).where(eq(projectFolders.id, id));
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (error: any) {
        console.error('updateProjectFolderAction error:', error);
        return { success: false, error: error.message || 'Failed to update folder' };
    }
}

export async function getProjectFoldersAction() {
    try {
        const folders = await db.query.projectFolders.findMany({
            orderBy: [desc(projectFolders.createdAt)]
        });
        return { success: true, data: folders };
    } catch (error: any) {
        console.error('getProjectFoldersAction error:', error);
        return { success: false, error: error.message || 'Failed to fetch folders' };
    }
}

export async function deleteProjectFolderAction(id: string) {
    try {
        await db.delete(projectFolders).where(eq(projectFolders.id, id));
        revalidatePath('/dashboard/workflows');
        return { success: true };
    } catch (error: any) {
        console.error('deleteProjectFolderAction error:', error);
        return { success: false, error: error.message || 'Failed to delete folder' };
    }
}

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

        console.log('Creating project with data:', JSON.stringify(projectData, null, 2));
        console.log('User ID:', userId);

        const result = await db.transaction(async (tx) => {
            // Validate if user exists (optional, but good for debugging FK errors)
            // const userExists = await tx.query.users.findFirst({ where: eq(users.id, userId) });
            // if (!userExists) throw new Error(`User ${userId} not found in DB`);

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
        // Return explicit error message to client
        return { success: false, error: `Failed to create: ${e.message}` };
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
                // Sanitize folderId
                if (projectData.folderId === '') {
                    projectData.folderId = null;
                }

                // Fix Date objects if they come as strings
                if (projectData.startDate && typeof projectData.startDate === 'string') {
                    projectData.startDate = new Date(projectData.startDate);
                }
                if (projectData.endDate && typeof projectData.endDate === 'string') {
                    projectData.endDate = new Date(projectData.endDate);
                }

                console.log('Updating project fields (sanitized):', projectData);

                try {
                    await tx.update(projects)
                        .set({ ...projectData, updatedAt: new Date() })
                        .where(eq(projects.id, id));
                } catch (err) {
                    console.error("DB Update Failed:", err);
                    throw err; // Re-throw to abort transaction
                }
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

                    // Fix Phase Dates
                    if (phaseFields.startDate && typeof phaseFields.startDate === 'string') {
                        phaseFields.startDate = new Date(phaseFields.startDate);
                    }
                    if (phaseFields.endDate && typeof phaseFields.endDate === 'string') {
                        phaseFields.endDate = new Date(phaseFields.endDate);
                    }

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
                        const existingActMap = new Map(existingActivities.map(a => [a.id, a]));

                        // Delete removed activities
                        for (const existingAct of existingActivities) {
                            if (!incomingActivityIds.has(existingAct.id)) {
                                await tx.delete(projectActivities).where(eq(projectActivities.id, existingAct.id));
                            }
                        }



                        // Upsert activities
                        for (const act of activities) {
                            const activityData = { ...act };

                            // Fix Activity Dates
                            if (activityData.startDate && typeof activityData.startDate === 'string') {
                                activityData.startDate = new Date(activityData.startDate);
                            }
                            if (activityData.endDate && typeof activityData.endDate === 'string') {
                                activityData.endDate = new Date(activityData.endDate);
                            }

                            // Detect New Assignments
                            const existingAct = existingActMap.get(act.id);
                            const existingParticipants = (existingAct?.participants as any[]) || [];
                            const newParticipants = (activityData.participants as any[]) || [];

                            const getUserId = (p: any) => typeof p === 'string' ? p : p.userId;
                            const existingUserIds = new Set(existingParticipants.map(getUserId));
                            const newUserIds = newParticipants.map(getUserId);

                            const addedUserIds = newUserIds.filter(uid => !existingUserIds.has(uid));

                            for (const userId of addedUserIds) {
                                if (userId && session?.user?.id) {
                                    /* console.log(`Creating inbox task for user ${userId}`); */
                                    await tx.insert(tasks).values({
                                        id: crypto.randomUUID(),
                                        type: 'PROJECT_ACTIVITY',
                                        projectId: id,
                                        activityId: act.id,
                                        assigneeId: userId,
                                        creatorId: session.user.id,
                                        status: 'PENDING',
                                        priority: 'MEDIUM',
                                        dueDate: activityData.endDate || null,
                                        instructions: `Se te ha asignado la actividad: "${activityData.name}" en el proyecto "${projectData.title || 'Proyecto'}"`,
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                    });
                                }
                            }

                            // Detect New Assignments
                            // We need to compare existing vs new participants
                            const existingAct = existingActMap.get(act.id);
                            const existingParticipants = (existingAct?.participants as any[]) || [];
                            const newParticipants = (activityData.participants as any[]) || [];

                            // Extract user IDs from participants array (handles both string and object formats)
                            const getUserId = (p: anyway) => typeof p === 'string' ? p : p.userId;
                            const existingUserIds = new Set(existingParticipants.map(getUserId));
                            const newUserIds = newParticipants.map(getUserId);

                            // Find users who are in new list but NOT in old list
                            const addedUserIds = newUserIds.filter(uid => !existingUserIds.has(uid));

                            // Create Task for each new assignee
                            for (const userId of addedUserIds) {
                                if (userId) { // Safety check
                                    console.log(`Creating inbox task for user ${userId} on activity ${act.name}`);
                                    // Generate a unique ID for the task (simple random for now or let DB handle if serial, but schema says varchar)
                                    // We'll use crypto.randomUUID() or similar if available, or a simple timestamp hack if imports tricky.
                                    // But wait, generateId is defined at bottom of file... let's move it up or duplicate if scope issue.
                                    // Actually `generateId` is NOT in scope here, it is defined later.
                                    // I'll grab it via function call if I move it, or just use `crypto.randomUUID()` here if I import it.
                                    // `randomUUID` is in 'crypto' which is node standard. I'll use `globalThis.crypto.randomUUID()` if env supports or import it.
                                    // Since this is 'use server', usually node crypto is available.

                                    await tx.insert(tasks).values({
                                        id: crypto.randomUUID(),
                                        type: 'PROJECT_ACTIVITY',
                                        projectId: id,
                                        activityId: act.id,
                                        assigneeId: userId,
                                        creatorId: session.user.id,
                                        status: 'PENDING',
                                        priority: 'MEDIUM',
                                        dueDate: activityData.endDate || null,
                                        instructions: `Se te ha asignado la actividad: "${activityData.name}" en el proyecto "${projectData.title || 'Proyecto'}"`,
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                    });
                                }
                            }

                            await tx.insert(projectActivities)
                                .values({
                                    ...activityData,
                                    phaseId: phase.id,
                                    documents: activityData.documents || [],
                                    updatedAt: new Date()
                                })
                                .onConflictDoUpdate({
                                    target: projectActivities.id,
                                    set: {
                                        ...activityData,
                                        documents: activityData.documents || [],
                                        updatedAt: new Date()
                                    }
                                });
                        }
                    }
                }
            }
        });


        // Fetch updated project with full structure to return to client
        const updatedProject = await db.query.projects.findFirst({
            where: eq(projects.id, id),
            with: {
                phases: {
                    with: {
                        activities: true
                    }
                }
            }
        });

        revalidatePath('/dashboard/workflows');
        return { success: true, data: updatedProject };
    } catch (e: any) {
        console.error('Update Project Error:', e);
        return { success: false, error: e.message };
    }
}


import { randomUUID } from 'crypto';

// Helper if crypto not available in edge (though likely Node env for actions)
const generateId = () => randomUUID();

export async function duplicateProjectAction(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const userId = session.user.id;

    try {
        const result = await db.transaction(async (tx) => {
            // 1. Fetch original project with full depth
            const original = await tx.query.projects.findFirst({
                where: eq(projects.id, id),
                with: {
                    phases: {
                        with: { activities: true },
                        orderBy: (phases, { asc }) => [asc(phases.order)]
                    }
                }
            });

            if (!original) throw new Error('Project not found');

            // 2. Clone Project
            const { id: oldId, createdAt, updatedAt, phases, ...projectData } = original;
            const newProjectId = generateId(); // Manual ID

            const newProjectData = {
                ...projectData,
                id: newProjectId, // Explicit ID
                title: `${projectData.title} (Copy)`,
                creatorId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const [newProject] = await tx.insert(projects).values(newProjectData).returning();

            // 3. Clone Phases & Activities
            if (phases && phases.length > 0) {
                for (const phase of phases) {
                    const { id: oldPhaseId, projectId, createdAt, updatedAt, activities, ...phaseData } = phase;
                    const newPhaseId = generateId(); // Manual ID

                    const [newPhase] = await tx.insert(projectPhases).values({
                        ...phaseData,
                        id: newPhaseId, // Explicit ID
                        projectId: newProjectId, // Link to new project
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }).returning();

                    if (activities && activities.length > 0) {
                        for (const act of activities) {
                            const { id: oldActId, phaseId, createdAt, updatedAt, ...actData } = act;
                            const newActId = generateId(); // Manual ID

                            await tx.insert(projectActivities).values({
                                ...actData,
                                id: newActId, // Explicit ID
                                phaseId: newPhaseId, // Link to new phase
                                createdAt: new Date(),
                                updatedAt: new Date()
                            });
                        }
                    }
                }
            }
            return newProject;
        });

        revalidatePath('/dashboard/workflows');
        return { success: true, data: result };

    } catch (e: any) {
        console.error('Duplicate Project Error:', e);
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

// --- SINGLE PROJECT FETCH ---
export async function getProjectByIdAction(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        const project = await db.query.projects.findFirst({
            where: eq(projects.id, id),
            with: {
                phases: {
                    with: {
                        activities: true
                    },
                    orderBy: (phases, { asc }) => [asc(phases.order)]
                }
            }
        });
        if (!project) return { success: false, error: 'Project not found' };
        return { success: true, data: project };
    } catch (e: any) {
        console.error('Get Project Error:', e);
        return { success: false, error: e.message };
    }
}
