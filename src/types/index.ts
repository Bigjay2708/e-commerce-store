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
