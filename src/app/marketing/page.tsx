'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useMarketingStore } from '@/store/marketing'
import Button from '@/components/ui/Button'

type TabType = 'campaigns' | 'notifications' | 'banners'

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('campaigns')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    targetAudience: 'all' as 'all' | 'new' | 'returning' | 'vip',
    scheduledDate: ''
  })
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    scheduledDate: '',
    targetAudience: 'all' as 'all' | 'new' | 'returning' | 'vip'
  })
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    imageUrl: '',
    ctaText: '',
    ctaUrl: '',
    targetAudience: 'all' as 'all' | 'new' | 'returning' | 'vip',
    location: 'homepage' as 'homepage' | 'product' | 'cart' | 'checkout',
    startDate: '',
    endDate: ''
  })

  const { 
    emailCampaigns, 
    pushNotifications, 
    promotionalBanners,
    createEmailCampaign,
    createPushNotification,
    createPromotionalBanner,
    deleteEmailCampaign,
    deletePushNotification,
    deletePromotionalBanner
  } = useMarketingStore()

  const handleCreateCampaign = () => {
    createEmailCampaign({
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content,
      targetAudience: newCampaign.targetAudience,
      scheduledDate: new Date(newCampaign.scheduledDate)
    })
    setNewCampaign({ name: '', subject: '', content: '', targetAudience: 'all', scheduledDate: '' })
    setShowCreateForm(false)
  }

  const handleCreateNotification = () => {
    createPushNotification({
      title: newNotification.title,
      message: newNotification.message,
      scheduledDate: new Date(newNotification.scheduledDate),
      targetAudience: newNotification.targetAudience
    })
    setNewNotification({ title: '', message: '', scheduledDate: '', targetAudience: 'all' })
    setShowCreateForm(false)
  }

  const handleCreateBanner = () => {
    createPromotionalBanner({
      title: newBanner.title,
      description: newBanner.description,
      imageUrl: newBanner.imageUrl,
      ctaText: newBanner.ctaText,
      ctaUrl: newBanner.ctaUrl,
      targetAudience: newBanner.targetAudience,
      location: newBanner.location,
      startDate: new Date(newBanner.startDate),
      endDate: new Date(newBanner.endDate)
    })
    setNewBanner({
      title: '', description: '', imageUrl: '', ctaText: '', ctaUrl: '',
      targetAudience: 'all', location: 'homepage', startDate: '', endDate: ''
    })
    setShowCreateForm(false)
  }

  const tabs = [
    { id: 'campaigns', label: 'Email Campaigns', count: emailCampaigns.length },
    { id: 'notifications', label: 'Push Notifications', count: pushNotifications.length },
    { id: 'banners', label: 'Promotional Banners', count: promotionalBanners.length }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Marketing Dashboard</h1>
            <p className="text-gray-600">Manage your email campaigns, push notifications, and promotional banners</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType)
                    setShowCreateForm(false)
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Create Button */}
            <div className="mb-6">
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {showCreateForm ? 'Cancel' : `Create ${activeTab === 'campaigns' ? 'Campaign' : activeTab === 'notifications' ? 'Notification' : 'Banner'}`}
              </Button>
            </div>

            {/* Create Forms */}
            {showCreateForm && (
              <div className="mb-8 bg-gray-50 rounded-lg p-6">
                {activeTab === 'campaigns' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Create Email Campaign</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Campaign Name"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Email Subject"
                        value={newCampaign.subject}
                        onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <select
                        value={newCampaign.targetAudience}
                        onChange={(e) => setNewCampaign({ ...newCampaign, targetAudience: e.target.value as 'all' | 'new' | 'returning' | 'vip' })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="all">All Users</option>
                        <option value="new">New Users</option>
                        <option value="returning">Returning Users</option>
                        <option value="vip">VIP Users</option>
                      </select>
                      <input
                        type="datetime-local"
                        value={newCampaign.scheduledDate}
                        onChange={(e) => setNewCampaign({ ...newCampaign, scheduledDate: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <textarea
                      placeholder="Email Content"
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <Button onClick={handleCreateCampaign} className="bg-green-600 hover:bg-green-700">
                      Create Campaign
                    </Button>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Create Push Notification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Notification Title"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <select
                        value={newNotification.targetAudience}
                        onChange={(e) => setNewNotification({ ...newNotification, targetAudience: e.target.value as 'all' | 'new' | 'returning' | 'vip' })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="all">All Users</option>
                        <option value="new">New Users</option>
                        <option value="returning">Returning Users</option>
                        <option value="vip">VIP Users</option>
                      </select>
                      <input
                        type="datetime-local"
                        value={newNotification.scheduledDate}
                        onChange={(e) => setNewNotification({ ...newNotification, scheduledDate: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"
                      />
                    </div>
                    <textarea
                      placeholder="Notification Message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <Button onClick={handleCreateNotification} className="bg-green-600 hover:bg-green-700">
                      Create Notification
                    </Button>
                  </div>
                )}

                {activeTab === 'banners' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Create Promotional Banner</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Banner Title"
                        value={newBanner.title}
                        onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={newBanner.imageUrl}
                        onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="CTA Text"
                        value={newBanner.ctaText}
                        onChange={(e) => setNewBanner({ ...newBanner, ctaText: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="CTA URL"
                        value={newBanner.ctaUrl}
                        onChange={(e) => setNewBanner({ ...newBanner, ctaUrl: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <select
                        value={newBanner.targetAudience}
                        onChange={(e) => setNewBanner({ ...newBanner, targetAudience: e.target.value as 'all' | 'new' | 'returning' | 'vip' })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="all">All Users</option>
                        <option value="new">New Users</option>
                        <option value="returning">Returning Users</option>
                        <option value="vip">VIP Users</option>
                      </select>
                      <select
                        value={newBanner.location}
                        onChange={(e) => setNewBanner({ ...newBanner, location: e.target.value as 'homepage' | 'product' | 'cart' | 'checkout' })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="homepage">Homepage</option>
                        <option value="product">Product Pages</option>
                        <option value="cart">Cart Page</option>
                        <option value="checkout">Checkout Page</option>
                      </select>
                      <input
                        type="date"
                        placeholder="Start Date"
                        value={newBanner.startDate}
                        onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="date"
                        placeholder="End Date"
                        value={newBanner.endDate}
                        onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <textarea
                      placeholder="Banner Description"
                      value={newBanner.description}
                      onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <Button onClick={handleCreateBanner} className="bg-green-600 hover:bg-green-700">
                      Create Banner
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Content Lists */}
            {activeTab === 'campaigns' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
                {emailCampaigns.length === 0 ? (
                  <p className="text-gray-500">No email campaigns created yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {emailCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">Subject: {campaign.subject}</p>
                            <p className="text-sm text-gray-600 mb-2">Content: {campaign.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Target: {campaign.targetAudience}</span>
                              <span>Status: {campaign.status}</span>
                              <span>Scheduled: {campaign.scheduledDate.toLocaleDateString()}</span>
                              <span>Sent: {campaign.sentCount}</span>
                              <span>Opened: {campaign.openCount}</span>
                              <span>Clicked: {campaign.clickCount}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteEmailCampaign(campaign.id)}
                            className="bg-red-600 hover:bg-red-700 text-sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
                {pushNotifications.length === 0 ? (
                  <p className="text-gray-500">No push notifications created yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {pushNotifications.map((notification) => (
                      <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Target: {notification.targetAudience}</span>
                              <span>Status: {notification.status}</span>
                              <span>Scheduled: {notification.scheduledDate.toLocaleDateString()}</span>
                              <span>Sent: {notification.sentCount}</span>
                              <span>Clicked: {notification.clickCount}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => deletePushNotification(notification.id)}
                            className="bg-red-600 hover:bg-red-700 text-sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'banners' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Promotional Banners</h3>
                {promotionalBanners.length === 0 ? (
                  <p className="text-gray-500">No promotional banners created yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {promotionalBanners.map((banner) => (
                      <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{banner.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
                            {banner.imageUrl && (
                              <Image 
                                src={banner.imageUrl} 
                                alt={banner.title}
                                width={128}
                                height={80}
                                className="w-32 h-20 object-cover rounded mb-2"
                              />
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Target: {banner.targetAudience}</span>
                              <span>Location: {banner.location}</span>
                              <span>Status: {banner.isActive ? 'Active' : 'Inactive'}</span>
                              <span>Views: {banner.viewCount}</span>
                              <span>Clicks: {banner.clickCount}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>Start: {banner.startDate.toLocaleDateString()}</span>
                              <span>End: {banner.endDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => deletePromotionalBanner(banner.id)}
                            className="bg-red-600 hover:bg-red-700 text-sm ml-4"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
