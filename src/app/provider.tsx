'use client';

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { useEffect, useState } from 'react';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <Toaster />
      <NextTopLoader showSpinner={false} />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  );
}
