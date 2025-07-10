'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Moon, Sun, Upload, Save, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useTranslation } from 'react-i18next'

const VALID_LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it'] as const;
const MIN_DAILY_GOAL = 1;
const MAX_DAILY_GOAL = 100;

type LanguageLevel = typeof VALID_LANGUAGE_LEVELS[number];
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

interface UserProfile {
  id: string;
  username: string;
  bio: string;
  avatar_url?: string | null;
  language_level: string;
  daily_goal: number;
  preferred_language: SupportedLanguage;
  notifications_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient();
  const { t: translationT } = useTranslation();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel | ''>('');
  const [dailyGoal, setDailyGoal] = useState(MIN_DAILY_GOAL);
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage | ''>('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  async function fetchProfile() {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // First try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        toast.error(t('errorFetchingProfile'));
        return;
      }

      if (existingProfile) {
        // Update state with existing profile
        setProfile(existingProfile);
        setUsername(existingProfile.username || '');
        setBio(existingProfile.bio || '');
        setLanguageLevel((existingProfile.language_level as LanguageLevel) || '');
        setDailyGoal(existingProfile.daily_goal || MIN_DAILY_GOAL);
        setPreferredLanguage((existingProfile.preferred_language as SupportedLanguage) || language);
        setNotificationsEnabled(existingProfile.notifications_enabled || false);
        setAvatarUrl(existingProfile.avatar_url || null);

        if (existingProfile.preferred_language && existingProfile.preferred_language !== language) {
          setLanguage(existingProfile.preferred_language);
        }
      } else {
        // Create new profile if none exists
        const timestamp = new Date().toISOString();
        const initialProfile = {
          id: user.id,
          username: `user_${user.id.slice(0, 8)}`,
          bio: '',
          avatar_url: null,
          language_level: 'A1',
          daily_goal: MIN_DAILY_GOAL,
          preferred_language: language,
          notifications_enabled: false,
          created_at: timestamp,
          updated_at: timestamp
        };

        // First try to insert the profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([initialProfile])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          
          // If the error is due to a duplicate username, try with a different username
          if (insertError.code === '23505') { // Unique violation
            const retryProfile = {
              ...initialProfile,
              username: `user_${user.id.slice(0, 8)}_${Date.now()}`
            };
            
            const { data: retryNewProfile, error: retryError } = await supabase
              .from('profiles')
              .insert([retryProfile])
              .select()
              .single();
              
            if (retryError) {
              console.error('Error creating profile (retry):', retryError);
              toast.error(t('errorCreatingProfile'));
              return;
            }
            
            if (retryNewProfile) {
              setProfile(retryNewProfile);
              setUsername(retryNewProfile.username);
              setBio(retryNewProfile.bio || '');
              setLanguageLevel(retryNewProfile.language_level as LanguageLevel);
              setDailyGoal(retryNewProfile.daily_goal);
              setPreferredLanguage(retryNewProfile.preferred_language as SupportedLanguage);
              setNotificationsEnabled(retryNewProfile.notifications_enabled);
              setAvatarUrl(retryNewProfile.avatar_url);
            }
          } else {
            toast.error(t('errorCreatingProfile'));
            return;
          }
        } else if (newProfile) {
          setProfile(newProfile);
          setUsername(newProfile.username);
          setBio(newProfile.bio || '');
          setLanguageLevel(newProfile.language_level as LanguageLevel);
          setDailyGoal(newProfile.daily_goal);
          setPreferredLanguage(newProfile.preferred_language as SupportedLanguage);
          setNotificationsEnabled(newProfile.notifications_enabled);
          setAvatarUrl(newProfile.avatar_url);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('errorFetchingProfile'));
    } finally {
      setIsLoading(false);
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate language level
      if (languageLevel && !VALID_LANGUAGE_LEVELS.includes(languageLevel as LanguageLevel)) {
        toast.error('Invalid language level selected');
        return;
      }

      // Validate daily goal
      if (dailyGoal < MIN_DAILY_GOAL || dailyGoal > MAX_DAILY_GOAL) {
        toast.error(`Daily goal must be between ${MIN_DAILY_GOAL} and ${MAX_DAILY_GOAL}`);
        return;
      }

      // Validate preferred language
      if (preferredLanguage && !SUPPORTED_LANGUAGES.includes(preferredLanguage as SupportedLanguage)) {
        toast.error('Invalid preferred language selected');
        return;
      }

      // Validate username
      if (username && (username.length < 3 || username.length > 30)) {
        toast.error('Username must be between 3 and 30 characters');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          language_level: languageLevel,
          daily_goal: dailyGoal,
          preferred_language: preferredLanguage,
          notifications_enabled: notificationsEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      toast.success('Profile updated successfully!');
      fetchProfile(); // Refresh the profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsLoading(true)
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64String = e.target?.result as string
        
        // Update profile with base64 avatar
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            avatar_url: base64String,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) throw updateError

        setProfile(prev => prev ? { ...prev, avatar_url: base64String } : null)
        toast.success('Avatar updated successfully')
      }

      reader.onerror = () => {
        throw new Error('Error reading file')
      }

      reader.readAsDataURL(file)
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Error updating avatar')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    try {
      setIsLoading(true)
      await signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
      toast.error('Error logging out')
    } finally {
      setIsLoading(false)
    }
  }

  const Avatar = () => {
    if (avatarUrl) {
      return (
        <div className="relative w-24 h-24 mb-4">
          <img
            src={avatarUrl}
            alt="Profile avatar"
            className="rounded-full w-full h-full object-cover"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600"
          >
            <Upload className="w-4 h-4 text-white" />
          </label>
        </div>
      );
    }
    return (
      <div className="relative w-24 h-24 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600"
        >
          <Upload className="w-4 h-4 text-white" />
        </label>
        <span className="text-2xl text-gray-500">{username ? username[0].toUpperCase() : '?'}</span>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{t('profile')}</h1>
        <p>Please log in to access your profile.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('profile')}</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          {t('logout')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('username')}</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('enterUsername')}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t('bio')}</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t('enterBio')}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t('languageLevel')}</label>
                  <Select
                    value={languageLevel}
                    onValueChange={(value: LanguageLevel) => setLanguageLevel(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectLanguageLevel')} />
                    </SelectTrigger>
                    <SelectContent>
                      {VALID_LANGUAGE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t('dailyGoal')}</label>
                  <Input
                    type="number"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                    min={MIN_DAILY_GOAL}
                    max={MAX_DAILY_GOAL}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t('preferredLanguage')}</label>
                  <Select
                    value={preferredLanguage}
                    onValueChange={(value: SupportedLanguage) => setPreferredLanguage(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectPreferredLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {t(`languages.${lang}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⌛</span>
                      {t('saving')}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      {t('save')}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('preferences')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{t('languageSettings')}</h3>
                <div className="space-y-2">
                  <label className="block text-sm text-gray-500">{t('interfaceLanguage')}</label>
                  <Select
                    value={language}
                    onValueChange={(value: SupportedLanguage) => setLanguage(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {t(`languages.${lang}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t('appearance')}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('theme')}</p>
                    <p className="text-sm text-gray-500">{t('chooseTheme')}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-10 w-10"
                  >
                    {theme === 'dark' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t('notifications')}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('enableNotifications')}</p>
                    <p className="text-sm text-gray-500">{t('notificationsDescription')}</p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 