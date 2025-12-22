export const APP_CONFIG = {
  DOMAIN: 'maturity.online',
  APP_NAME: 'Maturity 360',
  DEFAULT_LOCALE: 'es',
};

export function getSubdomain(hostname: string): string | null {
  const parts = hostname.split('.');
  
  if (hostname.includes('localhost')) {
    return parts.length > 1 ? parts[0] : null;
  }
  
  if (hostname.endsWith(APP_CONFIG.DOMAIN)) {
    const withoutDomain = hostname.replace(`.${APP_CONFIG.DOMAIN}`, '').replace(APP_CONFIG.DOMAIN, '');
    return withoutDomain && withoutDomain !== 'www' ? withoutDomain : null;
  }
  
  if (parts.length > 2) {
    const subdomain = parts[0];
    return subdomain !== 'www' ? subdomain : null;
  }
  
  return null;
}

export function getTenantUrl(tenantId: string): string {
  return `https://${tenantId}.${APP_CONFIG.DOMAIN}`;
}

export function isMainDomain(hostname: string): boolean {
  return hostname === APP_CONFIG.DOMAIN || 
         hostname === `www.${APP_CONFIG.DOMAIN}` ||
         hostname === 'localhost' ||
         hostname.includes('replit');
}
