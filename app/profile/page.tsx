'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Moon, Sun, Upload, Save, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  username: string
  bio: string
  avatar_url: string
  language_level: string
  daily_goal: number
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return
    }

    setProfile(data)
    setEditedProfile(data)
  }

  async function updateProfile() {
    if (!editedProfile) return

    setIsLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        username: editedProfile.username,
        bio: editedProfile.bio,
        language_level: editedProfile.language_level,
        daily_goal: editedProfile.daily_goal,
      })
      .eq('id', user?.id)

    setIsLoading(false)

    if (error) {
      toast.error('Erreur lors de la mise à jour du profil')
      return
    }

    setProfile(editedProfile)
    setIsEditing(false)
    toast.success('Profil mis à jour avec succès')
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${user?.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      toast.error('Erreur lors du téléchargement de l\'avatar')
      setIsLoading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user?.id)

    setIsLoading(false)

    if (updateError) {
      toast.error('Erreur lors de la mise à jour de l\'avatar')
      return
    }

    setProfile({ ...profile!, avatar_url: publicUrl })
    toast.success('Avatar mis à jour avec succès')
  }

  async function handleLogout() {
    try {
      setIsLoading(true)
      await signOut()
      toast.success('Déconnexion réussie')
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
      toast.error('Erreur lors de la déconnexion')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Profil</h1>
        <p>Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Profil</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoading ? 'Déconnexion...' : 'Déconnexion'}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profile?.avatar_url || '/default-avatar.png'}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={uploadAvatar}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{profile?.username || 'Utilisateur'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nom d'utilisateur</label>
                    <Input
                      value={editedProfile?.username || ''}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile!, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={editedProfile?.bio || ''}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile!, bio: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Niveau de langue</label>
                    <Input
                      value={editedProfile?.language_level || ''}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile!, language_level: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Objectif quotidien (minutes)</label>
                    <Input
                      type="number"
                      value={editedProfile?.daily_goal || 0}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile!,
                          daily_goal: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={updateProfile} disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditedProfile(profile)
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Bio</h4>
                    <p className="text-muted-foreground">{profile?.bio || 'Aucune bio'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Niveau de langue</h4>
                    <p className="text-muted-foreground">
                      {profile?.language_level || 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Objectif quotidien</h4>
                    <p className="text-muted-foreground">
                      {profile?.daily_goal || 0} minutes par jour
                    </p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Modifier le profil</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Thème</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez entre le thème clair et sombre
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

              <div>
                <h3 className="font-medium mb-2">Statistiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Cartes étudiées</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Quiz complétés</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 