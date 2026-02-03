'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import DiscoveryChat from './DiscoveryChat';
import { SILO_CONTEXTS, SiloContext } from '@/types';

const getSiloContextFromPath = (pathname: string): SiloContext => {
  if (pathname.startsWith('/sales')) {
    return SILO_CONTEXTS.sales_mentor;
  }
  if (pathname.startsWith('/spiritual')) {
    return SILO_CONTEXTS.spiritual_guide;
  }
  if (pathname.startsWith('/education')) {
    return SILO_CONTEXTS.education_coach;
  }
  return SILO_CONTEXTS.general;
};

export default function SiloedDiscoveryChat() {
  const pathname = usePathname();

  const context = useMemo(() => getSiloContextFromPath(pathname || '/'), [pathname]);

  return (
    <DiscoveryChat
      siloId={context.siloId}
      siloName={context.siloName}
      initialGreeting={context.initialGreeting}
    />
  );
}
