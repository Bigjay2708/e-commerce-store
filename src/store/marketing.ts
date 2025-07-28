import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  EmailCampaign, 
  EmailTemplate, 
  EmailSubscription, 
  PushNotification, 
  UserNotificationSettings,
  PromotionalBanner,
  Campaign 
} from '@/types';

interface MarketingStore {
  // Email Marketing
  emailCampaigns: EmailCampaign[];
  emailTemplates: EmailTemplate[];
  emailSubscriptions: EmailSubscription[];
  
  // Push Notifications
  pushNotifications: PushNotification[];
  userNotificationSettings: Record<string, UserNotificationSettings>;
  
  // Promotional Banners
  banners: PromotionalBanner[];
  campaigns: Campaign[];
  
  // Email actions
  createEmailCampaign: (campaign: Omit<EmailCampaign, 'id'>) => string;
  deleteEmailCampaign: (campaignId: string) => void;
  sendEmailCampaign: (campaignId: string) => void;
  subscribeToEmail: (userId: string, email: string, preferences?: Partial<EmailSubscription['preferences']>) => void;
  unsubscribeFromEmail: (userId: string) => void;
  
  // Push notification actions
  createPushNotification: (notification: Omit<PushNotification, 'id' | 'sentDate' | 'clickCount'>) => string;
  deletePushNotification: (notificationId: string) => void;
  sendPushNotification: (notificationId: string) => void;
  updateNotificationSettings: (userId: string, settings: Partial<UserNotificationSettings>) => void;
  
  // Banner actions
  createBanner: (banner: Omit<PromotionalBanner, 'id' | 'analytics'>) => string;
  deleteBanner: (bannerId: string) => void;
  getActiveBanners: (page: string, userTier?: string) => PromotionalBanner[];
  trackBannerView: (bannerId: string) => void;
  trackBannerClick: (bannerId: string) => void;
  
  // Campaign actions
  createCampaign: (campaign: Omit<Campaign, 'id' | 'actualMetrics'>) => string;
  getCampaignAnalytics: (campaignId: string) => Campaign['actualMetrics'];
  
  // Analytics
  getEmailMetrics: () => {
    totalSubscribers: number;
    totalCampaigns: number;
    averageOpenRate: number;
    averageClickRate: number;
  };
  getBannerMetrics: () => {
    totalBanners: number;
    totalViews: number;
    totalClicks: number;
    averageCTR: number;
  };
}

const sampleEmailTemplates: EmailTemplate[] = [
  {
    id: 'welcome_template',
    name: 'Welcome Email',
    subject: 'Welcome to ShopEase, {{name}}!',
    content: `
      <h1>Welcome to ShopEase!</h1>
      <p>Hi {{name}},</p>
      <p>Thank you for joining ShopEase! We're excited to have you as part of our community.</p>
      <p>As a welcome gift, here's a 10% discount code for your first order: <strong>WELCOME10</strong></p>
      <p>Happy shopping!</p>
    `,
    type: 'welcome',
    variables: ['name'],
    isActive: true
  },
  {
    id: 'abandoned_cart_template',
    name: 'Abandoned Cart Reminder',
    subject: 'Don\'t forget your items, {{name}}!',
    content: `
      <h1>Your cart is waiting for you!</h1>
      <p>Hi {{name}},</p>
      <p>You left some amazing items in your cart. Complete your purchase now before they're gone!</p>
      <p>Items in your cart: {{cartItems}}</p>
      <p>Total: ${{cartTotal}}</p>
      <a href="{{cartLink}}">Complete Your Purchase</a>
    `,
    type: 'abandoned_cart',
    variables: ['name', 'cartItems', 'cartTotal', 'cartLink'],
    isActive: true
  }
];

const sampleBanners: PromotionalBanner[] = [
  {
    id: 'summer_sale_hero',
    title: 'Summer Sale - Up to 50% Off!',
    subtitle: 'Limited Time Offer',
    description: 'Discover amazing deals on summer essentials. Shop now and save big!',
    imageUrl: '/banners/summer-sale.jpg',
    ctaText: 'Shop Now',
    ctaLink: '/products?category=summer',
    type: 'hero',
    position: 'top',
    priority: 1,
    isActive: true,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    targetAudience: {
      all: true,
      newUsers: false,
      returningUsers: false,
      tierLevels: [],
      categories: []
    },
    displayRules: {
      maxViews: 10,
      maxClicksPerUser: 3,
      showOnPages: ['home', 'products'],
      deviceTypes: ['desktop', 'mobile', 'tablet']
    },
    analytics: {
      views: 0,
      clicks: 0,
      conversions: 0
    }
  }
];

export const useMarketingStore = create<MarketingStore>()(
  persist(
    (set, get) => ({
      emailCampaigns: [],
      emailTemplates: sampleEmailTemplates,
      emailSubscriptions: [],
      pushNotifications: [],
      userNotificationSettings: {},
      banners: sampleBanners,
      campaigns: [],

      // Email Marketing Functions
      createEmailCampaign: (campaignData) => {
        const campaign: EmailCampaign = {
          ...campaignData,
          id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          openRate: 0,
          clickRate: 0
        };

        set((state) => ({
          emailCampaigns: [...state.emailCampaigns, campaign]
        }));

        return campaign.id;
      },

      sendEmailCampaign: (campaignId) => {
        set((state) => ({
          emailCampaigns: state.emailCampaigns.map(campaign =>
            campaign.id === campaignId
              ? { ...campaign, status: 'sent' as const, sentDate: new Date().toISOString() }
              : campaign
          )
        }));
      },

      deleteEmailCampaign: (campaignId) => {
        set((state) => ({
          emailCampaigns: state.emailCampaigns.filter(campaign => campaign.id !== campaignId)
        }));
      },

      subscribeToEmail: (userId, email, preferences = {}) => {
        const subscription: EmailSubscription = {
          userId,
          email,
          isSubscribed: true,
          preferences: {
            newsletter: true,
            promotions: true,
            orderUpdates: true,
            recommendations: true,
            ...preferences
          },
          subscribedDate: new Date().toISOString()
        };

        set((state) => ({
          emailSubscriptions: [
            ...state.emailSubscriptions.filter(sub => sub.userId !== userId),
            subscription
          ]
        }));
      },

      unsubscribeFromEmail: (userId) => {
        set((state) => ({
          emailSubscriptions: state.emailSubscriptions.map(sub =>
            sub.userId === userId
              ? { ...sub, isSubscribed: false, unsubscribedDate: new Date().toISOString() }
              : sub
          )
        }));
      },

      // Push Notification Functions
      createPushNotification: (notificationData) => {
        const notification: PushNotification = {
          ...notificationData,
          id: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          clickCount: 0
        };

        set((state) => ({
          pushNotifications: [...state.pushNotifications, notification]
        }));

        return notification.id;
      },

      sendPushNotification: (notificationId) => {
        set((state) => ({
          pushNotifications: state.pushNotifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, sentDate: new Date().toISOString() }
              : notification
          )
        }));
      },

      deletePushNotification: (notificationId) => {
        set((state) => ({
          pushNotifications: state.pushNotifications.filter(notification => notification.id !== notificationId)
        }));
      },

      updateNotificationSettings: (userId, settings) => {
        set((state) => ({
          userNotificationSettings: {
            ...state.userNotificationSettings,
            [userId]: {
              userId,
              pushEnabled: true,
              emailEnabled: true,
              preferences: {
                orderUpdates: true,
                promotions: true,
                recommendations: true,
                reminders: true,
                social: true
              },
              ...state.userNotificationSettings[userId],
              ...settings
            }
          }
        }));
      },

      // Banner Functions
      createBanner: (bannerData) => {
        const banner: PromotionalBanner = {
          ...bannerData,
          id: `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          analytics: {
            views: 0,
            clicks: 0,
            conversions: 0
          }
        };

        set((state) => ({
          banners: [...state.banners, banner]
        }));

        return banner.id;
      },

      getActiveBanners: (page, userTier) => {
        const state = get();
        const now = new Date();

        return state.banners
          .filter(banner => {
            // Check if banner is active and within date range
            if (!banner.isActive) return false;
            if (new Date(banner.startDate) > now) return false;
            if (new Date(banner.endDate) < now) return false;

            // Check page targeting
            if (!banner.displayRules.showOnPages.includes(page)) return false;

            // Check tier targeting
            if (userTier && banner.targetAudience.tierLevels.length > 0) {
              if (!banner.targetAudience.tierLevels.includes(userTier)) return false;
            }

            return true;
          })
          .sort((a, b) => b.priority - a.priority);
      },

      trackBannerView: (bannerId) => {
        set((state) => ({
          banners: state.banners.map(banner =>
            banner.id === bannerId
              ? { ...banner, analytics: { ...banner.analytics, views: banner.analytics.views + 1 } }
              : banner
          )
        }));
      },

      trackBannerClick: (bannerId) => {
        set((state) => ({
          banners: state.banners.map(banner =>
            banner.id === bannerId
              ? { ...banner, analytics: { ...banner.analytics, clicks: banner.analytics.clicks + 1 } }
              : banner
          )
        }));
      },

      deleteBanner: (bannerId) => {
        set((state) => ({
          banners: state.banners.filter(banner => banner.id !== bannerId)
        }));
      },

      // Campaign Functions
      createCampaign: (campaignData) => {
        const campaign: Campaign = {
          ...campaignData,
          id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          actualMetrics: {
            views: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0
          }
        };

        set((state) => ({
          campaigns: [...state.campaigns, campaign]
        }));

        return campaign.id;
      },

      getCampaignAnalytics: (campaignId) => {
        const state = get();
        const campaign = state.campaigns.find(c => c.id === campaignId);
        return campaign?.actualMetrics || { views: 0, clicks: 0, conversions: 0, revenue: 0 };
      },

      // Analytics Functions
      getEmailMetrics: () => {
        const state = get();
        const totalSubscribers = state.emailSubscriptions.filter(sub => sub.isSubscribed).length;
        const totalCampaigns = state.emailCampaigns.filter(c => c.status === 'sent').length;
        
        const sentCampaigns = state.emailCampaigns.filter(c => c.status === 'sent');
        const averageOpenRate = sentCampaigns.length > 0 
          ? sentCampaigns.reduce((sum, c) => sum + (c.openRate || 0), 0) / sentCampaigns.length 
          : 0;
        const averageClickRate = sentCampaigns.length > 0 
          ? sentCampaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0) / sentCampaigns.length 
          : 0;

        return {
          totalSubscribers,
          totalCampaigns,
          averageOpenRate,
          averageClickRate
        };
      },

      getBannerMetrics: () => {
        const state = get();
        const totalBanners = state.banners.length;
        const totalViews = state.banners.reduce((sum, b) => sum + b.analytics.views, 0);
        const totalClicks = state.banners.reduce((sum, b) => sum + b.analytics.clicks, 0);
        const averageCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

        return {
          totalBanners,
          totalViews,
          totalClicks,
          averageCTR
        };
      }
    }),
    {
      name: 'marketing-storage'
    }
  )
);
