'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'

const navigationItems = [
  
  {
    title: "Progress",
    href: "/progress",
  },
  {
    title: "Flashcards",
    href: "/flashcards",
  },
  {
    title: "Quiz",
    href: "/quiz",
  },
  {
    title: "Prononciation",
    href: "/pronunciation",
  },
  {
    title: "Grammaire",
    href: "/grammar",
  },
  {
    title: "Chatbot AI",
    href: "/chat",
  },
  {
    title: "Notifications",
    href: "/notifications",
  },
  {
    title: "Profil",
    href: "/profile",
  },
]

export function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold">
                MindFluent
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems
                .filter(item => item.title !== 'Profil' || user)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                      pathname === item.href
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-4"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 