-- Row Level Security (RLS) for Multi-Tenant Data Isolation
-- This script enables RLS on all tenant-scoped tables
-- Run with: psql $DATABASE_URL -f scripts/enable-rls.sql

-- Create custom settings for tenant context
-- These are set per-transaction by the application
DO $$
BEGIN
    PERFORM set_config('app.current_tenant', '', false);
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Function to get current tenant (with fallback)
CREATE OR REPLACE FUNCTION get_current_tenant_id() RETURNS TEXT AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant', true), '');
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if super admin
CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(current_setting('app.is_super_admin', true)::boolean, false);
EXCEPTION WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_users ON users;
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Enable RLS on units table
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE units FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_units ON units;
CREATE POLICY tenant_isolation_units ON units
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Enable RLS on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_documents ON documents;
CREATE POLICY tenant_isolation_documents ON documents
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Enable RLS on conversations table
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_conversations ON conversations;
CREATE POLICY tenant_isolation_conversations ON conversations
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_messages ON messages;
CREATE POLICY tenant_isolation_messages ON messages
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Enable RLS on workflows table
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_workflows ON workflows;
CREATE POLICY tenant_isolation_workflows ON workflows
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Enable RLS on surveys table
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_surveys ON surveys;
CREATE POLICY tenant_isolation_surveys ON surveys
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Enable RLS on tenant_email_configs table
ALTER TABLE tenant_email_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_email_configs FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_email_configs ON tenant_email_configs;
CREATE POLICY tenant_isolation_email_configs ON tenant_email_configs
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Enable RLS on audit_logs table (read-only access for tenants)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_audit_logs ON audit_logs;
CREATE POLICY tenant_isolation_audit_logs ON audit_logs
    FOR ALL
    USING (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin() OR 
        tenant_id = get_current_tenant_id()
    );

-- Tenants table: Only super admins can see all, regular users see their own
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_tenants ON tenants;
CREATE POLICY tenant_isolation_tenants ON tenants
    FOR ALL
    USING (
        is_super_admin() OR 
        id = get_current_tenant_id()
    )
    WITH CHECK (
        is_super_admin()
    );

-- Platform admins table: Only super admins
ALTER TABLE platform_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_admins FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS superadmin_only_platform_admins ON platform_admins;
CREATE POLICY superadmin_only_platform_admins ON platform_admins
    FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- Grant usage on functions
GRANT EXECUTE ON FUNCTION get_current_tenant_id() TO PUBLIC;
GRANT EXECUTE ON FUNCTION is_super_admin() TO PUBLIC;

-- Verification query
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'units', 'documents', 'conversations', 'messages', 
    'workflows', 'surveys', 'tenant_email_configs', 'audit_logs', 
    'tenants', 'platform_admins'
);
