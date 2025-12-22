'use client';

import { useParams } from 'next/navigation';
import AuthScreen from '@/components/AuthScreen';

export default function TenantLoginPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  return <AuthScreen tenantSlug={slug} />;
}
