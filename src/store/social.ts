import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  helpfulCount: number;
  verifiedPurchase: boolean;
  date: string;
  likes: string[];
}

export interface Question {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  question: string;
  date: string;
  likes: string[];
  answers: Answer[];
}

export interface Answer {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  answer: string;
  date: string;
  helpful: boolean;
  likes: string[];
}

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  followers: number;
  engagementRate: number;
  categories: string[];
}

export interface InfluencerPost {
  id: string;
  influencerId: string;
  productId: number;
  content: string;
  mediaUrl: string;
  mediaType: string;
  likes: number;
  comments: number;
  shares: number;
  date: string;
}

interface SocialState {
  reviews: Review[];
  questions: Question[];
  influencers: Influencer[];
  influencerPosts: InfluencerPost[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'likes'>) => void;
  addQuestion: (question: Omit<Question, 'id' | 'date' | 'likes' | 'answers'>) => void;
  addAnswer: (questionId: string, answer: Omit<Answer, 'id' | 'date' | 'helpful' | 'likes'>) => void;
  likeReview: (reviewId: string, userId: string) => void;
  likeQuestion: (questionId: string, userId: string) => void;
  markAnswerHelpful: (questionId: string, answerId: string) => void;
  getProductReviews: (productId: number) => Review[];
  getProductQuestions: (productId: number) => Question[];
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      reviews: [
        {
          id: 'rev1',
          productId: 1,
          userId: 'user1',
          userName: 'Alex Chen',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=400',
          rating: 5,
          title: 'Excellent quality and style!',
          comment: 'This jacket exceeded my expectations. The fabric is high-quality, the fit is perfect, and it looks exactly like in the photos. I have received multiple compliments when wearing it. Definitely worth the price!',
          images: [],
          helpfulCount: 12,
          verifiedPurchase: true,
          date: '2024-01-15',
          likes: []
        },
        {
          id: 'rev2',
          productId: 1,
          userId: 'user2',
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=400',
          rating: 4,
          title: 'Good value for money',
          comment: 'Nice jacket overall. The color is vibrant and the material feels durable. Took a while to arrive but worth the wait.',
          images: [],
          helpfulCount: 8,
          verifiedPurchase: true,
          date: '2024-01-20',
          likes: []
        }
      ],
      questions: [],
      influencers: [
        {
          id: 'inf1',
          name: 'Fashion Forward',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=400',
          verified: true,
          followers: 150000,
          engagementRate: 4.2,
          categories: ['fashion', 'lifestyle']
        }
      ],
      influencerPosts: [
        {
          id: 'post1',
          influencerId: 'inf1',
          productId: 1,
          content: 'Just got this amazing jacket! The quality is incredible and it fits perfectly. Definitely recommend!',
          mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          mediaType: 'image',
          likes: 245,
          comments: 18,
          shares: 12,
          date: '2024-01-18'
        }
      ],
      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `rev${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          helpfulCount: 0,
          likes: []
        };
        set((state) => ({ reviews: [newReview, ...state.reviews] }));
      },
      likeReview: (reviewId, userId) =>
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  likes: review.likes.includes(userId)
                    ? review.likes.filter((id) => id !== userId)
                    : [...review.likes, userId],
                  helpfulCount: review.likes.includes(userId)
                    ? review.helpfulCount - 1
                    : review.helpfulCount + 1
                }
              : review
          )
        })),
      addQuestion: (question) => {
        const newQuestion: Question = {
          ...question,
          id: `q${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          likes: [],
          answers: []
        };
        set((state) => ({ questions: [newQuestion, ...state.questions] }));
      },
      likeQuestion: (questionId, userId) =>
        set((state) => ({
          questions: state.questions.map((question) =>
            question.id === questionId
              ? {
                  ...question,
                  likes: question.likes.includes(userId)
                    ? question.likes.filter((id) => id !== userId)
                    : [...question.likes, userId]
                }
              : question
          )
        })),
      addAnswer: (questionId, answer) => {
        const newAnswer: Answer = {
          ...answer,
          id: `a${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          helpful: false,
          likes: []
        };
        set((state) => ({
          questions: state.questions.map((question) =>
            question.id === questionId
              ? { ...question, answers: [...question.answers, newAnswer] }
              : question
          )
        }));
      },
      markAnswerHelpful: (questionId, answerId) =>
        set((state) => ({
          questions: state.questions.map((question) =>
            question.id === questionId
              ? {
                  ...question,
                  answers: question.answers.map((answer) =>
                    answer.id === answerId
                      ? { ...answer, helpful: !answer.helpful }
                      : answer
                  )
                }
              : question
          )
        })),
      getProductReviews: (productId) =>
        get().reviews.filter((review) => review.productId === productId),
      getProductQuestions: (productId) =>
        get().questions.filter((question) => question.productId === productId)
    }),
    {
      name: 'social-storage'
    }
  )
);