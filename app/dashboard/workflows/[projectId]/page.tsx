import { getProjectByIdAction } from "@/app/actions/projectActions";
import ProjectEditor from "@/components/workflows/ProjectEditor";
import { Warning } from "@phosphor-icons/react/dist/ssr"; // SSR import for server components usually works, but this is a page that uses client component
import Link from "next/link";

interface PageProps {
    params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    const { success, data, error } = await getProjectByIdAction(projectId);

    if (!success || !data) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
                    <Warning size={48} className="mx-auto text-yellow-500 mb-4" weight="duotone" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Proyecto no encontrado</h2>
                    <p className="text-slate-500 mb-6">{error || "El proyecto que buscas no existe o no tienes permisos para verlo."}</p>
                    <Link
                        href="/dashboard/workflows"
                        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                    >
                        Volver a Proyectos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ProjectEditor project={data as any} />
    );
}
