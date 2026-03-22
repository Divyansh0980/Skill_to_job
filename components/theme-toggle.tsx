"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const COLORS = [
  { name: "violet", class: "bg-violet-500" },
  { name: "blue", class: "bg-blue-500" },
  { name: "emerald", class: "bg-emerald-500" },
  { name: "rose", class: "bg-rose-500" },
  { name: "orange", class: "bg-orange-500" },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [activeColor, setActiveColor] = React.useState("violet")

  React.useEffect(() => {
    setMounted(true)
    const savedColor = localStorage.getItem("theme-color") || "violet"
    setActiveColor(savedColor)
    document.documentElement.setAttribute("data-color", savedColor)
  }, [])

  if (!mounted) {
    return <div className="fixed bottom-6 right-6 z-50 p-3 h-14 w-[280px] bg-background/80 backdrop-blur-md border border-border rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)]" />
  }

  const handleColorChange = (color: string) => {
    setActiveColor(color)
    localStorage.setItem("theme-color", color)
    document.documentElement.setAttribute("data-color", color)
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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-2 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] bg-background/80 backdrop-blur-md border border-border">
      <div className="flex gap-2 px-3 border-r border-border/50">
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => handleColorChange(c.name)}
            className={`w-6 h-6 rounded-full transition-all active:scale-95 block ${c.class} ${activeColor === c.name ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "hover:scale-110 opacity-70 hover:opacity-100"}`}
            aria-label={`Set theme color to ${c.name}`}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center overflow-hidden relative"
        onClick={handleToggleTheme}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-500 absolute rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-orange-500" />
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-500 absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-violet-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
