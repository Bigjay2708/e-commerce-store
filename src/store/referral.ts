import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReferralProgram, Referral } from '@/types';

interface ReferralStore {
  programs: ReferralProgram[];
  referrals: Referral[];
  userReferralCodes: Record<string, string>;
  

  getActiveProgram: () => ReferralProgram | null;
  

  getUserReferralCode: (userId: string) => string;
  createReferral: (referrerId: string, refereeEmail: string) => string;
  completeReferral: (referralCode: string, refereeId: string, orderId: string) => boolean;
  

  getUserReferrals: (userId: string) => Referral[];
  getReferralStats: (userId: string) => {
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    totalRewards: number;
  };
  

  validateReferralCode: (code: string) => Referral | null;
  canUseReferralCode: (refereeEmail: string, referralCode: string) => boolean;
}

const defaultProgram: ReferralProgram = {
  id: 'default_program',
  name: 'Friend Referral Program',
  description: 'Refer friends and earn rewards when they make their first purchase',
  referrerReward: 500,
  refereeReward: 10,
  type: 'points',
  isActive: true,
  minOrderValue: 25,
  expiryDays: 30
};

export const useReferralStore = create<ReferralStore>()(
  persist(
    (set, get) => ({
      programs: [defaultProgram],
      referrals: [],
      userReferralCodes: {},

      getActiveProgram: () => {
        const state = get();
        return state.programs.find(program => program.isActive) || null;
      },

      getUserReferralCode: (userId: string) => {
        const state = get();
        if (state.userReferralCodes[userId]) {
          return state.userReferralCodes[userId];
        }


        const code = `REF${userId.slice(-4)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        set((state) => ({
          userReferralCodes: { ...state.userReferralCodes, [userId]: code }
        }));

        return code;
      },

      createReferral: (referrerId: string, refereeEmail: string) => {
        const referralCode = get().getUserReferralCode(referrerId);
        const program = get().getActiveProgram();
        
        if (!program) {
          throw new Error('No active referral program');
        }

        const referral: Referral = {
          id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          referrerId,
          refereeEmail: refereeEmail.toLowerCase(),
          code: referralCode,
          status: 'pending',
          dateCreated: new Date().toISOString(),
          rewardClaimed: false
        };

        set((state) => ({
          referrals: [...state.referrals, referral]
        }));

        return referralCode;
      },

      completeReferral: (referralCode: string, refereeId: string, orderId: string) => {
        const state = get();
        const referral = state.referrals.find(r => r.code === referralCode && r.status === 'pending');
        const program = get().getActiveProgram();

        if (!referral || !program) {
          return false;
        }


        const expiryDate = new Date(referral.dateCreated);
        expiryDate.setDate(expiryDate.getDate() + (program.expiryDays || 30));
        
        if (new Date() > expiryDate) {

          set((state) => ({
            referrals: state.referrals.map(r => 
              r.id === referral.id ? { ...r, status: 'expired' as const } : r
            )
          }));
          return false;
        }


        set((state) => ({
          referrals: state.referrals.map(r => 
            r.id === referral.id ? {
              ...r,
              refereeId,
              orderId,
              status: 'completed' as const,
              dateCompleted: new Date().toISOString()
            } : r
          )
        }));


        if (program.type === 'points') {

          console.log(`Awarding ${program.referrerReward} points to referrer ${referral.referrerId}`);
        }

        return true;
      },

      getUserReferrals: (userId: string) => {
        const state = get();
        return state.referrals
          .filter(referral => referral.referrerId === userId)
          .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      },

      getReferralStats: (userId: string) => {
        const userReferrals = get().getUserReferrals(userId);
        const program = get().getActiveProgram();
        
        const completedReferrals = userReferrals.filter(r => r.status === 'completed');
        const pendingReferrals = userReferrals.filter(r => r.status === 'pending');
        
        const totalRewards = program?.type === 'points' 
          ? completedReferrals.length * (program.referrerReward || 0)
          : 0;

        return {
          totalReferrals: userReferrals.length,
          completedReferrals: completedReferrals.length,
          pendingReferrals: pendingReferrals.length,
          totalRewards
        };
      },

      validateReferralCode: (code: string) => {
        const state = get();
        return state.referrals.find(r => r.code === code && r.status === 'pending') || null;
      },

      canUseReferralCode: (refereeEmail: string, referralCode: string) => {
        const state = get();
        const referral = state.referrals.find(r => r.code === referralCode);
        
        if (!referral) return false;
        if (referral.status !== 'pending') return false;
        

        return referral.refereeEmail === refereeEmail.toLowerCase();
      }
    }),
    {
      name: 'referral-storage'
    }
  )
);
