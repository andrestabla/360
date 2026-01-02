import React from 'react';
import { notFound } from 'next/navigation';
import { getDocumentByIdAction } from '@/app/lib/repositoryActions';
import { getUnitsAction } from '@/app/lib/unitActions';
import DocumentViewer from '@/components/repository/DocumentViewer';

interface PageProps {
    params: {
        docId: string;
    };
}

export default async function DocumentPage({ params }: PageProps) {
    const { docId } = params;

    const [doc, unitsRes] = await Promise.all([
        getDocumentByIdAction(docId),
        getUnitsAction()
    ]);

    if (!doc) {
        notFound();
    }

    return (
        <DocumentViewer
            initialDoc={doc}
            units={unitsRes.data || []}
        />
    );
}
