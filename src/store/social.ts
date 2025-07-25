import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review, Question, Answer, ReviewReply, Influencer, InfluencerPost } from '@/types';

interface SocialStore {
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'likes' | 'replies'>) => void;
  likeReview: (reviewId: string, userId: string) => void;
  addReviewReply: (reviewId: string, reply: Omit<ReviewReply, 'id' | 'date' | 'likes'>) => void;
  getProductReviews: (productId: number) => Review[];
  getAverageRating: (productId: number) => number;
  
  // Q&A
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'date' | 'likes' | 'answers'>) => void;
  addAnswer: (questionId: string, answer: Omit<Answer, 'id' | 'date' | 'likes'>) => void;
  likeQuestion: (questionId: string, userId: string) => void;
  likeAnswer: (questionId: string, answerId: string, userId: string) => void;
  getProductQuestions: (productId: number) => Question[];
  
  // Influencers
  influencers: Influencer[];
  influencerPosts: InfluencerPost[];
  getProductInfluencerPosts: (productId: number) => InfluencerPost[];
  getInfluencerById: (influencerId: string) => Influencer | undefined;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      reviews: [
        {
          id: 'rev1',
          productId: 1,
          userId: 'user1',
          userName: 'Alex Chen',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          rating: 5,
          title: 'Excellent quality and style!',
          comment: 'This jacket exceeded my expectations. The fabric is high-quality, the fit is perfect, and it looks exactly like in the photos. I\'ve received multiple compliments when wearing it. Definitely worth the price!',
          images: [],
          helpfulCount: 12,
          verifiedPurchase: true,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          likes: ['user2', 'user3', 'user4'],
          replies: [
            {
              id: 'reply1',
              userId: 'seller',
              userName: 'ShopEase Team',
              userAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
              comment: 'Thank you for the wonderful review! We\'re thrilled you love your jacket. 😊',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              likes: ['user1']
            }
          ]
        },
        {
          id: 'rev2',
          productId: 1,
          userId: 'user5',
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          rating: 4,
          title: 'Great jacket, runs a bit large',
          comment: 'Love the style and quality of this jacket. Only issue is it runs slightly larger than expected. I ordered medium but could have gone with small. Still keeping it though!',
          images: [],
          helpfulCount: 8,
          verifiedPurchase: true,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          likes: ['user1', 'user6'],
          replies: []
        }
      ],
      questions: [
        {
          id: 'q1',
          productId: 1,
          userId: 'user7',
          userName: 'Mike Davis',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          question: 'What material is this jacket made from? Is it suitable for winter weather?',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          likes: ['user8', 'user9'],
          answers: [
            {
              id: 'ans1',
              questionId: 'q1',
              userId: 'expert1',
              userName: 'Fashion Expert',
              userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
              answer: 'This jacket is made from a cotton-polyester blend with a water-resistant coating. It\'s perfect for fall and mild winter weather, but for very cold climates, you might want to layer it.',
              date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              likes: ['user7', 'user10'],
              isExpert: true,
              isSeller: false
            }
          ]
        }
      ],
      influencers: [
        {
          id: 'inf1',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
          handle: '@sarahjstyle',
          platform: 'instagram',
          followers: 125000,
          verified: true,
          bio: 'Fashion & Lifestyle Influencer | Mom of 2 | Sharing daily outfits & home decor'
        },
        {
          id: 'inf2',
          name: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          handle: '@techreviewmike',
          platform: 'youtube',
          followers: 89000,
          verified: true,
          bio: 'Tech Reviewer | Unboxing the latest gadgets | Honest reviews you can trust'
        },
        {
          id: 'inf3',
          name: 'Emma Wilson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
          handle: '@emmawilson',
          platform: 'tiktok',
          followers: 340000,
          verified: true,
          bio: 'Beauty & Skincare Expert | Makeup tutorials | Product recommendations'
        }
      ],
      influencerPosts: [
        {
          id: 'post1',
          influencerId: 'inf1',
          productId: 1,
          content: 'Obsessed with this jacket! Perfect for fall weather and the quality is amazing. Use my code for 15% off! 🧥✨',
          mediaUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600',
          mediaType: 'image',
          likes: 2340,
          comments: 156,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          discount: {
            code: 'SARAH15',
            percentage: 15
          }
        },
        {
          id: 'post2',
          influencerId: 'inf2',
          productId: 9,
          content: 'Full review of this external hard drive is up! Great for creators who need reliable storage. Link in bio!',
          mediaUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600',
          mediaType: 'video',
          likes: 1890,
          comments: 89,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          discount: {
            code: 'TECH20',
            percentage: 20
          }
        }
      ],

      addReview: (reviewData) =>
        set((state) => {
          const newReview: Review = {
            ...reviewData,
            id: generateId(),
            date: new Date().toISOString(),
            helpfulCount: 0,
            likes: [],
            replies: []
          };
          return { reviews: [...state.reviews, newReview] };
        }),

      likeReview: (reviewId, userId) =>
        set((state) => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? {
                  ...review,
                  likes: review.likes.includes(userId)
                    ? review.likes.filter(id => id !== userId)
                    : [...review.likes, userId],
                  helpfulCount: review.likes.includes(userId)
                    ? review.helpfulCount - 1
                    : review.helpfulCount + 1
                }
              : review
          )
        })),

      addReviewReply: (reviewId, replyData) =>
        set((state) => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? {
                  ...review,
                  replies: [
                    ...review.replies,
                    {
                      ...replyData,
                      id: generateId(),
                      date: new Date().toISOString(),
                      likes: []
                    }
                  ]
                }
              : review
          )
        })),

      getProductReviews: (productId) =>
        get().reviews
          .filter(review => review.productId === productId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

      getAverageRating: (productId) => {
        const productReviews = get().reviews.filter(review => review.productId === productId);
        if (productReviews.length === 0) return 0;
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / productReviews.length;
      },

      addQuestion: (questionData) =>
        set((state) => {
          const newQuestion: Question = {
            ...questionData,
            id: generateId(),
            date: new Date().toISOString(),
            likes: [],
            answers: []
          };
          return { questions: [...state.questions, newQuestion] };
        }),

      addAnswer: (questionId, answerData) =>
        set((state) => ({
          questions: state.questions.map(question =>
            question.id === questionId
              ? {
                  ...question,
                  answers: [
                    ...question.answers,
                    {
                      ...answerData,
                      id: generateId(),
                      date: new Date().toISOString(),
                      likes: []
                    }
                  ]
                }
              : question
          )
        })),

      likeQuestion: (questionId, userId) =>
        set((state) => ({
          questions: state.questions.map(question =>
            question.id === questionId
              ? {
                  ...question,
                  likes: question.likes.includes(userId)
                    ? question.likes.filter(id => id !== userId)
                    : [...question.likes, userId]
                }
              : question
          )
        })),

      likeAnswer: (questionId, answerId, userId) =>
        set((state) => ({
          questions: state.questions.map(question =>
            question.id === questionId
              ? {
                  ...question,
                  answers: question.answers.map(answer =>
                    answer.id === answerId
                      ? {
                          ...answer,
                          likes: answer.likes.includes(userId)
                            ? answer.likes.filter(id => id !== userId)
                            : [...answer.likes, userId]
                        }
                      : answer
                  )
                }
              : question
          )
        })),

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
