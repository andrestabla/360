import { NextRequest, NextResponse } from 'next/server';
import { getEmailConfig, saveEmailConfig, deleteEmailConfig } from '@/lib/services/tenantEmailService';

export async function GET(request: NextRequest) {
  try {
    // Removed tenantId param
    const config = await getEmailConfig();

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
      // Removed tenantId
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
      // Removed tenantId arg
      smtpHost,
      smtpPort: parseInt(smtpPort),
      smtpUser,
      smtpPassword,
      smtpSecure: smtpSecure === true || smtpSecure === 'true',
      fromName: fromName || 'Maturity 360',
      fromEmail,
      replyToEmail,
      // createdBy ignored by service currently but fine to pass if we update service later
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error saving email config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Removed tenantId param
    const result = await deleteEmailConfig();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error deleting email config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
