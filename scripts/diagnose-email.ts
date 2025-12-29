import { db } from '../server/db';
import { emailSettings, users } from '../shared/schema';
import { sendEmail } from '../lib/services/tenantEmailService';

async function diagnoseEmailIssue() {
    console.log('🔍 DIAGNÓSTICO DE EMAIL - Maturity 360\n');
    console.log('='.repeat(60));

    // 1. Verificar configuración de email en BD
    console.log('\n📧 1. Verificando configuración de email en base de datos...');
    try {
        const configs = await db.select().from(emailSettings).limit(1);

        if (configs.length === 0) {
            console.log('❌ ERROR: No hay configuración de email en la base de datos');
            console.log('   Solución: Configurar SMTP en /dashboard/admin/settings');
            return;
        }

        const config = configs[0];
        console.log('✅ Configuración encontrada:');
        console.log(`   Provider: ${config.provider}`);
        console.log(`   SMTP Host: ${config.smtpHost}`);
        console.log(`   SMTP Port: ${config.smtpPort}`);
        console.log(`   SMTP User: ${config.smtpUser}`);
        console.log(`   SMTP Secure: ${config.smtpSecure}`);
        console.log(`   From Name: ${config.fromName}`);
        console.log(`   From Email: ${config.fromEmail}`);
        console.log(`   Reply To: ${config.replyToEmail}`);
        console.log(`   Enabled: ${config.isEnabled}`);
        console.log(`   Password Encrypted: ${config.smtpPasswordEncrypted ? 'Sí (****)' : 'NO'}`);

        if (!config.isEnabled) {
            console.log('\n⚠️  ADVERTENCIA: La configuración de email está DESHABILITADA');
            console.log('   Solución: Habilitar en /dashboard/admin/settings');
        }

        if (!config.smtpHost || !config.smtpUser || !config.smtpPasswordEncrypted) {
            console.log('\n❌ ERROR: Configuración SMTP incompleta');
            console.log('   Faltan campos requeridos');
            return;
        }

    } catch (error) {
        console.log('❌ ERROR al leer configuración:', error);
        return;
    }

    // 2. Verificar variables de entorno
    console.log('\n🔧 2. Verificando variables de entorno...');
    console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'NO CONFIGURADA (usando http://localhost:3000)'}`);
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurada' : 'NO CONFIGURADA'}`);
    console.log(`   EMAIL_ENCRYPTION_KEY: ${process.env.EMAIL_ENCRYPTION_KEY ? 'Configurada' : 'NO CONFIGURADA (usando fallback dev)'}`);

    // 3. Verificar usuarios con invitaciones pendientes
    console.log('\n👥 3. Verificando usuarios recientes...');
    try {
        const recentUsers = await db.select().from(users).limit(5);
        console.log(`   Total usuarios en BD: ${recentUsers.length}`);

        const usersWithInvites = recentUsers.filter(u => u.inviteSentAt);
        console.log(`   Usuarios con invitación enviada: ${usersWithInvites.length}`);

        if (usersWithInvites.length > 0) {
            console.log('\n   Últimas invitaciones:');
            usersWithInvites.forEach(u => {
                console.log(`   - ${u.name} (${u.email})`);
                console.log(`     Enviada: ${u.inviteSentAt?.toLocaleString('es')}`);
                console.log(`     Expira: ${u.inviteExpiresAt?.toLocaleString('es')}`);
            });
        }
    } catch (error) {
        console.log('❌ ERROR al leer usuarios:', error);
    }

    // 4. Probar envío de email de prueba
    console.log('\n📨 4. Probando envío de email...');
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    console.log(`   Enviando email de prueba a: ${testEmail}`);

    try {
        const result = await sendEmail({
            to: testEmail,
            subject: 'Test - Maturity 360',
            html: '<h1>Email de Prueba</h1><p>Si recibes este email, la configuración SMTP está funcionando correctamente.</p>'
        });

        if (result.success) {
            console.log('✅ Email enviado exitosamente!');
            console.log('   Verifica la bandeja de entrada de:', testEmail);
        } else {
            console.log('❌ ERROR al enviar email:', result.error);
            console.log('\n🔍 Posibles causas:');
            console.log('   1. Credenciales SMTP incorrectas');
            console.log('   2. Puerto bloqueado por firewall');
            console.log('   3. Email "From" no verificado en Amazon SES');
            console.log('   4. Límite de envío alcanzado');
            console.log('   5. IP bloqueada por spam');
        }
    } catch (error: any) {
        console.log('❌ EXCEPCIÓN al enviar email:', error.message);
        console.log('   Stack:', error.stack);
    }

    console.log('\n' + '='.repeat(60));
    console.log('Diagnóstico completado\n');
}

diagnoseEmailIssue()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error fatal:', error);
        process.exit(1);
    });
