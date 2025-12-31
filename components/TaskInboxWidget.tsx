'use client';
import { CaretRight, CheckCircle, Clock, Tray } from '@phosphor-icons/react';
import { WorkflowCase } from '@/shared/schema';
import { useRouter } from 'next/navigation';


interface DashboardTask {
    id: string;
    title: string;
    priority: string | null;
    dueDate: Date | null;
    source: string;
    link: string;
    createdAt: Date | null;
}

export default function TaskInboxWidget({ tasks }: { tasks: any[] }) {
    const router = useRouter();

    if (!tasks || tasks.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col min-h-[200px]">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Tray weight="fill" size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">Mi Bandeja de Entrada</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400">
                    <CheckCircle size={48} weight="thin" className="mb-2 text-emerald-500/50" />
                    <p className="text-sm font-medium">¡Estás al día!</p>
                    <p className="text-xs">No tienes tareas pendientes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col min-h-[300px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <div className="relative">
                            <Tray weight="fill" size={20} />
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Mi Bandeja de Entrada</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{tasks.length} Pendientes</p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto custom-scrollbar max-h-[350px]">
                {tasks.map((task: DashboardTask) => (
                    <div
                        key={task.id}
                        onClick={() => router.push(task.link || '#')}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${task.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                                task.priority === 'LOW' ? 'bg-slate-100 text-slate-600' :
                                    'bg-amber-100 text-amber-600'
                                }`}>
                                {task.priority === 'HIGH' ? 'Alta' : task.priority === 'LOW' ? 'Baja' : 'Media'}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                {task.dueDate && (
                                    <>
                                        <Clock size={12} weight="bold" className={new Date(task.dueDate) < new Date() ? 'text-red-500' : ''} />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </>
                                )}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">{task.title}</h4>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-slate-400 group-hover:text-indigo-500 transition-colors">
                                {task.source === 'DOCUMENT' ? 'Revisar Documento' : 'Resolver ahora'}
                            </span>
                            <CaretRight size={14} className="text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
