'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage as any)
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_language: newLanguage })
        .eq('id', user.id)
      
      if (error) {
        toast.error(t('failedToUpdateSettings'))
      } else {
        toast.success(t('settingsUpdated'))
      }
    }
  }

  const handleThemeChange = async (newTheme: string) => {
    toggleTheme()
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_theme: newTheme })
        .eq('id', user.id)
      
      if (error) {
        toast.error(t('failedToUpdateSettings'))
      } else {
        toast.success(t('settingsUpdated'))
      }
    }
  }

  const languageNames = {
    fr: t('french'),
    en: t('english'),
    es: t('spanish'),
    de: t('german')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t('preferences')}</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('languageSettings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('interfaceLanguage')}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{languageNames.fr}</SelectItem>
                    <SelectItem value="en">{languageNames.en}</SelectItem>
                    <SelectItem value="es">{languageNames.es}</SelectItem>
                    <SelectItem value="de">{languageNames.de}</SelectItem>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('theme')}</Label>
                <p className="text-sm text-muted-foreground">{t('themeDescription')}</p>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
                  />
                  <Label>{theme === 'dark' ? t('darkMode') : t('lightMode')}</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('notifications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">{t('enableNotifications')}</Label>
                </div>
                <p className="text-sm text-muted-foreground">{t('notificationsDescription')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 