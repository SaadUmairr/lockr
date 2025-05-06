'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function ThemeToggler() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;

    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="rounded-full bg-gray-100 p-2 dark:bg-gray-900"
              aria-label='theme-toggler'
            >
              <Moon
                className={`h-6 w-6 transition-all ${theme === 'dark' ? 'hidden' : 'block'}`}
              />
              <Sun
                className={`h-6 w-6 transition-all ${theme === 'dark' ? 'block' : 'hidden'}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
