'use client';
import { FileText, FolderOpen, ClockCounterClockwise, ArrowRight } from '@phosphor-icons/react';
import { UserRecent } from '@/shared/schema';
import { useRouter } from 'next/navigation';

export default function RecentsWidget({ recents }: { recents: UserRecent[] }) {
    const router = useRouter();

    if (!recents || recents.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 opacity-50">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <ClockCounterClockwise weight="fill" size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">Recientes</h3>
                </div>
                <div className="p-6 text-center text-slate-400 text-xs italic">
                    Aquí aparecerán tus documentos y proyectos recientes.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <ClockCounterClockwise weight="fill" size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">Continuar donde lo dejé</h3>
                </div>
            </div>
            <div className="divide-y divide-slate-100">
                {recents.map(recent => (
                    <button
                        key={recent.id}
                        // Default fallback routing
                        onClick={() => router.push(recent.resourceType === 'PROJECT' ? `/dashboard/projects/${recent.resourceId}` : `/dashboard/repository?doc=${recent.resourceId}`)}
                        className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
                    >
                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${recent.resourceType === 'PROJECT' ? 'bg-violet-100 text-violet-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {recent.resourceType === 'PROJECT' ? <FolderOpen size={16} weight="duotone" /> : <FileText size={16} weight="duotone" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-700 truncate group-hover:text-blue-600 transition-colors">{recent.title}</h4>
                            <p className="text-[10px] text-slate-400 capitalize">{recent.resourceType === 'PROJECT' ? 'Proyecto' : 'Documento'}</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                    </button>
                ))}
            </div>
        </div>
    )
}
