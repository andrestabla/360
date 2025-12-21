'use client';
import { useUI } from '@/context/UIContext';

export default function DocViewer() {
    const { isViewerOpen, viewerTitle, closeViewer } = useUI();

    return (
        <div
            className="doc-viewer-overlay"
            style={{ display: isViewerOpen ? 'flex' : 'none' }}
        >
            <div className="doc-viewer-window">
                <div className="doc-viewer-header" style={{ background: '#1e293b', color: 'white', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                    <span style={{ fontWeight: 500 }}>{viewerTitle || 'Documento.pdf'}</span>
                    <button className="btn btn-primary" onClick={closeViewer}>Cerrar</button>
                </div>
                <div className="doc-viewer-body" style={{ background: '#64748b', flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <div className="sim-pdf-page">
                        <h1 style={{ textAlign: 'center' }}>{viewerTitle}</h1>
                        <hr />
                        <p>Vista previa simulada...</p>
                        <p className="mt-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
