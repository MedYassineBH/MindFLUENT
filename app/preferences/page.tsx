'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Moon, Sun } from 'lucide-react'

export default function PreferencesPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [notifications, setNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchPreferences()
    }
  }, [user])

  async function fetchPreferences() {
    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', user?.id)
      .single()

    if (error) {
      console.error('Error fetching preferences:', error)
      return
    }

    if (data) {
      setNotifications(data.notifications)
      setLanguage(data.language)
    }
  }

  async function updatePreferences() {
    setIsLoading(true)
    const { error } = await supabase
      .from('preferences')
      .upsert({
        user_id: user?.id,
        language,
        notifications,
        theme,
      })

    setIsLoading(false)

    if (error) {
      toast.error('Error updating preferences')
      return
    }

    toast.success('Preferences updated successfully')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('preferences')}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('languageSettings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('interfaceLanguage')}
                </label>
                <Select
                  value={language}
                  onValueChange={(value) => setLanguage(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('appearance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('theme')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('themeDescription')}
                  </p>
                </div>
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('notifications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('enableNotifications')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('notificationsDescription')}
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={updatePreferences} disabled={isLoading}>
          {isLoading ? t('saving') : t('save')}
        </Button>
      </div>
    </div>
  )
} 