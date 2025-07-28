export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface User {
  id: number;
  email: string;
  username: string;
  name: {
    firstname: string;
    lastname: string;
  };
  avatar?: string;
  bio?: string;
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
  followers: string[]; // userIds
  following: string[]; // userIds
  joined: string;
  isInfluencer?: boolean;
  loyaltyPoints?: number;
  membershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  referralCode?: string;
  referredBy?: string;
  emailSubscribed?: boolean;
  pushNotifications?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  tax: number;
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Social Commerce Types
export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpfulCount: number;
  verifiedPurchase: boolean;
  date: string;
  likes: string[];
  replies: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  date: string;
  likes: string[];
}

export interface Question {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  question: string;
  date: string;
  likes: string[];
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  answer: string;
  date: string;
  likes: string[];
  isExpert: boolean;
  isSeller: boolean;
}

export interface SocialShare {
  platform: 'facebook' | 'twitter' | 'instagram' | 'pinterest' | 'whatsapp' | 'email';
  url: string;
  text: string;
  hashtags?: string[];
}

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  followers: number;
  verified: boolean;
  bio: string;
}

export interface InfluencerPost {
  id: string;
  influencerId: string;
  productId: number;
  content: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  comments: number;
  date: string;
  discount?: {
    code: string;
    percentage: number;
  };
}

// Marketing & Engagement Types

// Loyalty/Rewards Program Types
export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'expired' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  date: string;
  expiryDate?: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_shipping' | 'product' | 'experience';
  value: number; // discount percentage or product value
  imageUrl?: string;
  category: string;
  isActive: boolean;
  expiryDate?: string;
  limitPerUser?: number;
  minOrderValue?: number;
}

export interface UserLoyalty {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierProgress: number; // percentage to next tier
  nextTierThreshold: number;
  transactions: LoyaltyTransaction[];
  redeemedRewards: string[]; // reward IDs
}

// Referral System Types
export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  referrerReward: number; // points or discount percentage
  refereeReward: number;
  type: 'points' | 'discount' | 'cash';
  isActive: boolean;
  minOrderValue?: number;
  expiryDays?: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId?: string;
  refereeEmail: string;
  code: string;
  status: 'pending' | 'completed' | 'expired';
  dateCreated: string;
  dateCompleted?: string;
  rewardClaimed: boolean;
  orderId?: string;
}

// Email Marketing Types
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'promotional' | 'newsletter' | 'abandoned_cart' | 'welcome' | 'order_confirmation';
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  recipients: string[]; // user IDs or emails
  scheduledDate?: string;
  sentDate?: string;
  openRate?: number;
  clickRate?: number;
  tags: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: EmailCampaign['type'];
  variables: string[]; // {{name}}, {{product}}, etc.
  isActive: boolean;
}

export interface EmailSubscription {
  userId: string;
  email: string;
  isSubscribed: boolean;
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    orderUpdates: boolean;
    recommendations: boolean;
  };
  subscribedDate: string;
  unsubscribedDate?: string;
}

// Push Notifications Types
export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  image?: string;
  type: 'promotional' | 'order_update' | 'reminder' | 'general';
  targetUsers: string[]; // user IDs or 'all'
  scheduledDate?: string;
  sentDate?: string;
  clickCount: number;
  data?: Record<string, any>; // additional data for deep linking
  isActive: boolean;
}

export interface UserNotificationSettings {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  preferences: {
    orderUpdates: boolean;
    promotions: boolean;
    recommendations: boolean;
    reminders: boolean;
    social: boolean;
  };
}

// Promotional Banners/Campaigns Types
export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  type: 'hero' | 'sidebar' | 'popup' | 'strip' | 'product_page';
  position: 'top' | 'middle' | 'bottom' | 'floating';
  priority: number; // higher number = higher priority
  isActive: boolean;
  startDate: string;
  endDate: string;
  targetAudience: {
    all: boolean;
    newUsers: boolean;
    returningUsers: boolean;
    tierLevels: string[]; // ['bronze', 'silver']
    categories: string[]; // product categories
  };
  displayRules: {
    maxViews: number;
    maxClicksPerUser: number;
    showOnPages: string[]; // ['home', 'products', 'cart']
    deviceTypes: string[]; // ['desktop', 'mobile', 'tablet']
  };
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
  };
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'sale' | 'new_product' | 'seasonal' | 'loyalty' | 'referral';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  budget?: number;
  targetMetrics: {
    views?: number;
    clicks?: number;
    conversions?: number;
    revenue?: number;
  };
  actualMetrics: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  banners: string[]; // banner IDs
  emailCampaigns: string[]; // email campaign IDs
  pushNotifications: string[]; // notification IDs
  discountCodes: string[];
}
