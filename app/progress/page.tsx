"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAuth } from '@/contexts/AuthContext'

interface Activity {
  id: string
  type: string
  score: number
  date: string
}

interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  total: number
  completed: boolean
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function ProgressPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState({
    totalExercises: 0,
    averageScore: 0,
    streak: 0,
    level: 1,
  })

  useEffect(() => {
    console.log("Auth user in dashboard:", user, "loading:", loading);
    if (!loading && user === null) {
      router.push("/auth");
    } else if (user) {
      fetchData(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  async function fetchData(userId: string) {
    // Fetch activities
    const { data: activitiesData } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (activitiesData) {
      setActivities(activitiesData)

      // Calculate stats
      const totalExercises = activitiesData.length
      const averageScore =
        activitiesData.reduce((acc, curr) => acc + curr.score, 0) /
        (totalExercises || 1)

      setStats({
        totalExercises,
        averageScore,
        streak: calculateStreak(activitiesData),
        level: Math.floor(totalExercises / 10) + 1,
      })
    }

    // Fetch achievements
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId)

    if (achievementsData) {
      setAchievements(achievementsData)
    }
  }

  function calculateStreak(activities: Activity[]): number {
    if (!activities.length) return 0

    let streak = 1
    const today = new Date()
    const sortedDates = activities
      .map((a) => new Date(a.date))
      .sort((a, b) => b.getTime() - a.getTime())

    // Check if there's an activity today
    const lastActivity = sortedDates[0]
    if (
      lastActivity.getDate() !== today.getDate() ||
      lastActivity.getMonth() !== today.getMonth() ||
      lastActivity.getFullYear() !== today.getFullYear()
    ) {
      return 0
    }

    // Calculate streak
    for (let i = 1; i < sortedDates.length; i++) {
      const curr = sortedDates[i]
      const prev = sortedDates[i - 1]
      const diffDays = Math.floor(
        (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (user === null) {
    // Redirect will happen in useEffect
    return null;
  }

  const activityData = activities.map((activity) => ({
    date: new Date(activity.date).toLocaleDateString(),
    score: activity.score,
  }))

  const activityTypeData = activities.reduce((acc, activity) => {
    const existing = acc.find((item) => item.type === activity.type)
    if (existing) {
      existing.value++
    } else {
      acc.push({ type: activity.type, value: 1 })
    }
    return acc
  }, [] as { type: string; value: number }[])

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Progression</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Niveau</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.level}</p>
            <Progress
              value={
                ((stats.totalExercises % 10) / 10) * 100
              }
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercices Complétés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalExercises}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats.averageScore.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Série Actuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.streak} jours</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progression des Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Activités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityTypeData}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {activityTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Succès</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={achievement.completed ? "border-primary" : ""}
              >
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">{achievement.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <Progress
                    value={(achievement.progress / achievement.total) * 100}
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {achievement.progress} / {achievement.total}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 