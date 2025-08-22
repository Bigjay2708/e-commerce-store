import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Review {
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
  replies: ReviewReply[];
}

interface ReviewReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  comment: string;
  date: string;
  likes: string[];
}

interface Question {
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

interface Answer {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  answer: string;
  date: string;
  likes: string[];
  isVerifiedSeller?: boolean;
}

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  verified: boolean;
  specialty: string;
  bio: string;
}

interface InfluencerPost {
  id: string;
  influencerId: string;
  productId: number;
  title: string;
  content: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  comments: number;
  shares: number;
  date: string;
  engagement: number;
}

interface SocialState {
  reviews: Review[];
  questions: Question[];
  influencers: Influencer[];
  influencerPosts: InfluencerPost[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'likes' | 'replies'>) => void;
  likeReview: (reviewId: string, userId: string) => void;
  addReviewReply: (reviewId: string, reply: Omit<ReviewReply, 'id' | 'date' | 'likes'>) => void;
  getProductReviews: (productId: number) => Review[];
  addQuestion: (question: Omit<Question, 'id' | 'date' | 'likes' | 'answers'>) => void;
  addAnswer: (questionId: string, answer: Omit<Answer, 'id' | 'date' | 'likes'>) => void;
  getProductQuestions: (productId: number) => Question[];
  getProductInfluencerPosts: (productId: number) => InfluencerPost[];
  getInfluencerById: (influencerId: string) => Influencer | undefined;
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
          comment: 'This jacket exceeded my expectations. The fabric is high-quality, the fit is perfect, and it looks exactly like in the photos.',
          images: [],
          helpfulCount: 12,
          verifiedPurchase: true,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          likes: ['user2', 'user3', 'user4'],
          replies: []
        }
      ],

      questions: [
        {
          id: 'q1',
          productId: 1,
          userId: 'user2',
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=400',
          question: 'What sizes are available for this jacket?',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          likes: ['user1', 'user3'],
          answers: []
        }
      ],

      influencers: [
        {
          id: 'inf1',
          name: 'Fashion Forward',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=400',
          followers: 125000,
          verified: true,
          specialty: 'Fashion & Style',
          bio: 'Fashion enthusiast sharing the latest trends and style tips.'
        }
      ],

      influencerPosts: [
        {
          id: 'post1',
          influencerId: 'inf1',
          productId: 1,
          title: 'Fall Fashion Essentials',
          content: 'This jacket is perfect for the fall season! Great quality and style.',
          mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          mediaType: 'image',
          likes: 234,
          comments: 18,
          shares: 12,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          engagement: 8.5
        }
      ],

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `rev_${Date.now()}`,
          date: new Date().toISOString(),
          helpfulCount: 0,
          likes: [],
          replies: []
        };
        set((state) => ({ reviews: [newReview, ...state.reviews] }));
      },

      likeReview: (reviewId, userId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  likes: review.likes.includes(userId)
                    ? review.likes.filter((id) => id !== userId)
                    : [...review.likes, userId]
                }
              : review
          )
        }));
      },

      addReviewReply: (reviewId, reply) => {
        const newReply: ReviewReply = {
          ...reply,
          id: `reply_${Date.now()}`,
          date: new Date().toISOString(),
          likes: []
        };
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? { ...review, replies: [...review.replies, newReply] }
              : review
          )
        }));
      },

      getProductReviews: (productId) =>
        get().reviews
          .filter(review => review.productId === productId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

      addQuestion: (question) => {
        const newQuestion: Question = {
          ...question,
          id: `q_${Date.now()}`,
          date: new Date().toISOString(),
          likes: [],
          answers: []
        };
        set((state) => ({ questions: [newQuestion, ...state.questions] }));
      },

      addAnswer: (questionId, answer) => {
        const newAnswer: Answer = {
          ...answer,
          id: `ans_${Date.now()}`,
          date: new Date().toISOString(),
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

      getProductQuestions: (productId) =>
        get().questions
          .filter(question => question.productId === productId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

      getProductInfluencerPosts: (productId) =>
        get().influencerPosts
          .filter(post => post.productId === productId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

      getInfluencerById: (influencerId) =>
        get().influencers.find(influencer => influencer.id === influencerId)
    }),
    {
      name: 'social-storage'
    }
  )
);
