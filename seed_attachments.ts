import { DB } from '@/lib/data';

// Helper to seed a conversation with attachments to verify rendering
export const seedAttachments = () => {
    const convo = DB.conversations.find(c => c.type === 'dm');
    if (!convo) return console.log('No DM found to seed');

    console.log('Seeding attachments to conversation:', convo.id);

    // 1. Image Message
    DB.messages.push({
        id: 'MSG-IMG-TEST',
        conversation_id: convo.id,
        sender_id: convo.participants?.[0] || 'system', // Use first participant
        body: 'Mira esta imagen',
        body_type: 'image',
        created_at: new Date().toISOString(),
        senderName: 'Test Bot',
        attachments: [{
            id: 'ATT-1',
            message_id: 'MSG-IMG-TEST',
            file_name: 'demo-image.jpg',
            mime_type: 'image/jpeg',
            size: 1024 * 500,
            storage_key: 'mock',
            url: 'https://picsum.photos/400/300', // External image for verification
            created_at: new Date().toISOString()
        }]
    });

    // 2. File Message
    DB.messages.push({
        id: 'MSG-FILE-TEST',
        conversation_id: convo.id,
        sender_id: convo.participants?.[0] || 'system',
        body: 'Aquí tienes el reporte',
        body_type: 'file',
        created_at: new Date().toISOString(),
        senderName: 'Test Bot',
        attachments: [{
            id: 'ATT-2',
            message_id: 'MSG-FILE-TEST',
            file_name: 'reporte-anual.pdf',
            mime_type: 'application/pdf',
            size: 1024 * 1024 * 2.5,
            storage_key: 'mock',
            url: '#',
            created_at: new Date().toISOString()
        }]
    });

    console.log('Seeded 2 messages with attachments.');
};
