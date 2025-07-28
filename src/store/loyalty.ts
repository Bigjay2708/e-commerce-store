import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoyaltyTransaction, LoyaltyReward, UserLoyalty } from '@/types';

interface LoyaltyStore {
  userLoyalty: Record<string, UserLoyalty>; // userId -> loyalty data
  rewards: LoyaltyReward[];
  transactions: LoyaltyTransaction[];
  
  // User loyalty actions
  getUserLoyalty: (userId: string) => UserLoyalty;
  addPoints: (userId: string, points: number, description: string, orderId?: string) => void;
  spendPoints: (userId: string, points: number, description: string, rewardId?: string) => boolean;
  updateTier: (userId: string) => void;
  
  // Rewards actions
  getAvailableRewards: (userId: string) => LoyaltyReward[];
  redeemReward: (userId: string, rewardId: string) => boolean;
  
  // Transaction history
  getUserTransactions: (userId: string) => LoyaltyTransaction[];
  
  // Analytics
  getTotalPointsDistributed: () => number;
  getMostPopularRewards: () => LoyaltyReward[];
}

const tierThresholds = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 15000
};

const sampleRewards: LoyaltyReward[] = [
  {
    id: 'reward_1',
    title: '10% Off Next Order',
    description: 'Get 10% discount on your next purchase',
    pointsCost: 500,
    type: 'discount',
    value: 10,
    category: 'discount',
    isActive: true,
    minOrderValue: 50
  },
  {
    id: 'reward_2',
    title: 'Free Shipping',
    description: 'Free shipping on any order',
    pointsCost: 300,
    type: 'free_shipping',
    value: 0,
    category: 'shipping',
    isActive: true
  },
  {
    id: 'reward_3',
    title: '20% Off Next Order',
    description: 'Get 20% discount on your next purchase',
    pointsCost: 1000,
    type: 'discount',
    value: 20,
    category: 'discount',
    isActive: true,
    minOrderValue: 100
  },
  {
    id: 'reward_4',
    title: 'Exclusive Product Access',
    description: 'Early access to new product launches',
    pointsCost: 2000,
    type: 'experience',
    value: 0,
    category: 'exclusive',
    isActive: true
  }
];

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      userLoyalty: {},
      rewards: sampleRewards,
      transactions: [],

      getUserLoyalty: (userId: string) => {
        const state = get();
        if (!state.userLoyalty[userId]) {
          const newUserLoyalty: UserLoyalty = {
            userId,
            totalPoints: 0,
            availablePoints: 0,
            lifetimePoints: 0,
            tier: 'bronze',
            tierProgress: 0,
            nextTierThreshold: tierThresholds.silver,
            transactions: [],
            redeemedRewards: []
          };
          set((state) => ({
            userLoyalty: { ...state.userLoyalty, [userId]: newUserLoyalty }
          }));
          return newUserLoyalty;
        }
        return state.userLoyalty[userId];
      },

      addPoints: (userId: string, points: number, description: string, orderId?: string) => {
        const transaction: LoyaltyTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          type: 'earned',
          points,
          description,
          orderId,
          date: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        };

        set((state) => {
          const currentLoyalty = state.userLoyalty[userId] || get().getUserLoyalty(userId);
          const updatedLoyalty = {
            ...currentLoyalty,
            totalPoints: currentLoyalty.totalPoints + points,
            availablePoints: currentLoyalty.availablePoints + points,
            lifetimePoints: currentLoyalty.lifetimePoints + points,
            transactions: [...currentLoyalty.transactions, transaction]
          };

          const newState = {
            userLoyalty: { ...state.userLoyalty, [userId]: updatedLoyalty },
            transactions: [...state.transactions, transaction]
          };

          return newState;
        });

        // Update tier after adding points
        get().updateTier(userId);
      },

      spendPoints: (userId: string, points: number, description: string, rewardId?: string) => {
        const currentLoyalty = get().getUserLoyalty(userId);
        
        if (currentLoyalty.availablePoints < points) {
          return false; // Insufficient points
        }

        const transaction: LoyaltyTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          type: 'spent',
          points: -points,
          description,
          date: new Date().toISOString()
        };

        set((state) => {
          const updatedLoyalty = {
            ...currentLoyalty,
            availablePoints: currentLoyalty.availablePoints - points,
            transactions: [...currentLoyalty.transactions, transaction],
            redeemedRewards: rewardId ? [...currentLoyalty.redeemedRewards, rewardId] : currentLoyalty.redeemedRewards
          };

          return {
            userLoyalty: { ...state.userLoyalty, [userId]: updatedLoyalty },
            transactions: [...state.transactions, transaction]
          };
        });

        return true;
      },

      updateTier: (userId: string) => {
        set((state) => {
          const currentLoyalty = state.userLoyalty[userId];
          if (!currentLoyalty) return state;

          let newTier = currentLoyalty.tier;
          let nextThreshold = tierThresholds.silver;

          if (currentLoyalty.lifetimePoints >= tierThresholds.platinum) {
            newTier = 'platinum';
            nextThreshold = tierThresholds.platinum;
          } else if (currentLoyalty.lifetimePoints >= tierThresholds.gold) {
            newTier = 'gold';
            nextThreshold = tierThresholds.platinum;
          } else if (currentLoyalty.lifetimePoints >= tierThresholds.silver) {
            newTier = 'silver';
            nextThreshold = tierThresholds.gold;
          } else {
            newTier = 'bronze';
            nextThreshold = tierThresholds.silver;
          }

          const tierProgress = newTier === 'platinum' ? 100 : 
            ((currentLoyalty.lifetimePoints - tierThresholds[newTier]) / 
             (nextThreshold - tierThresholds[newTier])) * 100;

          const updatedLoyalty = {
            ...currentLoyalty,
            tier: newTier,
            tierProgress: Math.min(100, Math.max(0, tierProgress)),
            nextTierThreshold: nextThreshold
          };

          return {
            userLoyalty: { ...state.userLoyalty, [userId]: updatedLoyalty }
          };
        });
      },

      getAvailableRewards: (userId: string) => {
        const state = get();
        const userLoyalty = state.userLoyalty[userId];
        if (!userLoyalty) return [];

        return state.rewards.filter(reward => 
          reward.isActive && 
          reward.pointsCost <= userLoyalty.availablePoints &&
          (!reward.expiryDate || new Date(reward.expiryDate) > new Date())
        );
      },

      redeemReward: (userId: string, rewardId: string) => {
        const state = get();
        const reward = state.rewards.find(r => r.id === rewardId);
        const userLoyalty = state.userLoyalty[userId];

        if (!reward || !userLoyalty || userLoyalty.availablePoints < reward.pointsCost) {
          return false;
        }

        return get().spendPoints(userId, reward.pointsCost, `Redeemed: ${reward.title}`, rewardId);
      },

      getUserTransactions: (userId: string) => {
        const state = get();
        return state.transactions
          .filter(tx => tx.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getTotalPointsDistributed: () => {
        const state = get();
        return state.transactions
          .filter(tx => tx.type === 'earned')
          .reduce((total, tx) => total + tx.points, 0);
      },

      getMostPopularRewards: () => {
        const state = get();
        const rewardRedemptions = state.transactions
          .filter(tx => tx.type === 'spent')
          .reduce((acc, tx) => {
            const description = tx.description;
            acc[description] = (acc[description] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

        return state.rewards
          .map(reward => ({
            ...reward,
            redemptionCount: rewardRedemptions[`Redeemed: ${reward.title}`] || 0
          }))
          .sort((a, b) => b.redemptionCount - a.redemptionCount);
      }
    }),
    {
      name: 'loyalty-storage'
    }
  )
);
