import { NextRequest, NextResponse } from 'next/server';
import { getEmailConfig, saveEmailConfig, testEmailConfig, deleteEmailConfig } from '@/lib/services/tenantEmailService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    const config = await getEmailConfig(tenantId);
    
    return NextResponse.json({ 
      success: true, 
      config: config || null 
    });
  } catch (error: any) {
    console.error('Error getting email config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      tenantId, 
      smtpHost, 
      smtpPort, 
      smtpUser, 
      smtpPassword, 
      smtpSecure, 
      fromName, 
      fromEmail, 
      replyToEmail,
      createdBy 
    } = body;

    if (!smtpHost || !smtpPort || !smtpUser || !fromEmail) {
      return NextResponse.json({ 
        success: false, 
        error: 'Campos requeridos: smtpHost, smtpPort, smtpUser, fromEmail' 
      }, { status: 400 });
    }

    const result = await saveEmailConfig({
      tenantId,
      smtpHost,
      smtpPort: parseInt(smtpPort),
      smtpUser,
      smtpPassword,
      smtpSecure: smtpSecure === true || smtpSecure === 'true',
      fromName: fromName || 'Maturity 360',
      fromEmail,
      replyToEmail,
      createdBy: createdBy || 'admin',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error saving email config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    const result = await deleteEmailConfig(tenantId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error deleting email config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
