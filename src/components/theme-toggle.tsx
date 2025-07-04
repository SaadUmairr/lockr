"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "./ui/button"

export default function ThemeToggler({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"

    setTheme(newTheme)
  }

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
              className={cn(
                "rounded-full bg-gray-100 p-2 dark:bg-gray-900",
                className
              )}
            >
              <Moon className="block h-6 w-6 text-black transition-all dark:hidden" />
              <Sun className="hidden h-6 w-6 text-white transition-all dark:block" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
