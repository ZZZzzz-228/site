// src/components/ThemeToggle.tsx
import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <button
      aria-label="Переключить тему"
      onClick={() => setIsDark(prev => !prev)}
      className="p-2 rounded-full hover:bg-muted/50 transition"
    >
      {isDark
        ? <Sun className="h-5 w-5 text-foreground" />
        : <Moon className="h-5 w-5 text-foreground" />
      }
    </button>
  )
}
