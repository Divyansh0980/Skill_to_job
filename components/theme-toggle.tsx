"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="fixed bottom-6 right-6 z-50 p-3 h-14 w-14" />
  }

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const corners = [
      { x: '0%', y: '0%' },
      { x: '100%', y: '0%' },
      { x: '0%', y: '100%' },
      { x: '100%', y: '100%' },
      { x: '50%', y: '0%' },
      { x: '50%', y: '100%' },
      { x: '0%', y: '50%' },
      { x: '100%', y: '50%' }
    ];
    const pt = corners[Math.floor(Math.random() * corners.length)];
    
    document.documentElement.style.setProperty('--wave-origin-x', pt.x);
    document.documentElement.style.setProperty('--wave-origin-y', pt.y);

    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] bg-background/80 backdrop-blur-md border-border transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center overflow-hidden relative"
        onClick={handleToggleTheme}
      >
        <Sun className="h-[1.5rem] w-[1.5rem] transition-all duration-500 absolute rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-orange-500" />
        <Moon className="h-[1.5rem] w-[1.5rem] transition-all duration-500 absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-violet-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
