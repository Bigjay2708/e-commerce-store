'use client'

import { useEffect, useState } from 'react'
import { useMarketingStore } from '@/store/marketing'
import { PushNotification } from '@/types'
import { Bell, X } from 'lucide-react'

interface PushNotificationProps {
  className?: string
}

export default function PushNotificationDisplay({ className = '' }: PushNotificationProps) {
  const { pushNotifications } = useMarketingStore()
  const [notifications, setNotifications] = useState<PushNotification[]>([])
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }

    // Get active notifications that should be displayed now
    const activeNotifications = pushNotifications.filter(notification =>
      notification.sentDate &&
      notification.isActive &&
      (!notification.scheduledDate || new Date() >= new Date(notification.scheduledDate))
    )

    setNotifications(activeNotifications.slice(0, 3)) // Show max 3 notifications
  }, [pushNotifications])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setPermission(permission)
    }
  }

  const showNotification = (notification: PushNotification) => {
    if (permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      })
    }
  }

  const handleNotificationClick = (notificationId: string) => {
    // Remove notification from display after click
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  if (notifications.length === 0 && permission !== 'default') {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Permission Request */}
      {permission === 'default' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">Enable Notifications</h4>
                <p className="text-sm text-blue-700">Get notified about special offers and updates</p>
              </div>
            </div>
            <button
              onClick={requestPermission}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {/* Active Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Bell className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
              </div>
              <p className="text-gray-600 text-sm">{notification.body}</p>
              <div className="mt-2 flex items-center space-x-4">
                <button
                  onClick={() => handleNotificationClick(notification.id)}
                  className="text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  View Details
                </button>
                <button
                  onClick={() => showNotification(notification)}
                  className="text-gray-500 text-sm hover:text-gray-700"
                >
                  Show as Browser Notification
                </button>
              </div>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="flex-shrink-0 ml-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
