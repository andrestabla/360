import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationEmail, sendWorkflowNotification } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, title, message, tenantName, workflowTitle, stepName, action } = body;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    let result;

    if (type === 'workflow') {
      if (!workflowTitle || !stepName || !action) {
        return NextResponse.json({ 
          error: 'workflowTitle, stepName, and action are required for workflow notifications' 
        }, { status: 400 });
      }
      result = await sendWorkflowNotification(to, workflowTitle, stepName, action, tenantName);
    } else {
      if (!title || !message) {
        return NextResponse.json({ 
          error: 'title and message are required for general notifications' 
        }, { status: 400 });
      }
      result = await sendNotificationEmail(to, title, message, tenantName);
    }

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        messageId: result.messageId 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Notification API error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to send notification' 
    }, { status: 500 });
  }
}
