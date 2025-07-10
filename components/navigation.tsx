'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Bell, Book, BookOpen, Mic, MessageSquare, User, BarChart2, Settings, Brain } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationsContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  translationKey: string
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart2, translationKey: 'dashboard' },
  { name: 'Grammar', href: '/grammar', icon: Book, translationKey: 'grammar' },
  { name: 'Pronunciation', href: '/pronunciation', icon: Mic, translationKey: 'pronunciation' },
  { name: 'Flashcards', href: '/flashcards', icon: BookOpen, translationKey: 'flashcards' },
  { name: 'Chat', href: '/chat', icon: MessageSquare, translationKey: 'chat' },
  { name: 'Profile', href: '/profile', icon: User, translationKey: 'profile' },
]

export function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth();
  const { unreadCount } = useNotifications()
  const { t } = useLanguage()

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center text-xl font-bold">
                <Brain className="w-6 h-6 mr-2" />
                MindFluent
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation
                .filter(item => item.name !== 'Profile' || user)
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
                    <item.icon className="w-4 h-4 mr-2" />
                    {t(item.translationKey)}
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
            <Link href="/notifications">
              <Button
                variant={pathname === '/notifications' ? 'secondary' : 'ghost'}
                className="mr-4"
              >
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                {t('notifications')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 