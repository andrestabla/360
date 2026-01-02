
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { documents, units, organizationSettings } from "@/shared/schema";
import { eq } from "drizzle-orm";
import DocumentViewer from "@/components/repository/DocumentViewer";

type PageProps = {
    params: Promise<{ docId: string }>;
    searchParams: Promise<{ mode?: string }>;
};

export default async function ProjectDocumentPage({ params, searchParams }: PageProps) {
    const session = await auth();
    if (!session?.user) return <div>Unauthorized</div>;

    const { docId } = await params;
    const { mode } = await searchParams; // 'view' or 'work'

    // Fetch document
    const doc = await db.query.documents.findFirst({
        where: eq(documents.id, docId),
    });

    if (!doc) {
        return notFound();
    }

    // Fetch units for the sidebar
    const allUnits = await db.query.units.findMany();

    // Map to RepositoryFile interface expected by DocumentViewer
    // Ensure compatibility with existing type
    const repositoryFile = {
        ...doc,
        // Ensure any mismatching types are handled if necessary
        // repositoryActions.ts defines RepositoryFile as:
        // export type RepositoryFile = typeof documents.$inferSelect & { owner?: { name: string | null } };
    };

    return (
        <DocumentViewer
            initialDoc={repositoryFile as any}
            units={allUnits}
            initialMode={(mode as any) || 'view'}
        />
    );
}
