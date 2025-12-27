'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
                    <h2 className="text-2xl font-bold mb-4">Algo salió mal en la plataforma</h2>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => reset()}
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </body>
        </html>
    );
}
