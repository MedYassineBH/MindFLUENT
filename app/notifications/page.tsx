'use client'

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Notifications</h1>
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-muted-foreground">
          Vous n'avez pas de nouvelles notifications.
        </p>
      </div>
    </div>
  )
} 