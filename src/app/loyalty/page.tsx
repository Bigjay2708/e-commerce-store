"use client";
import { useEffect, useState } from 'react';
import { FaCrown, FaStar, FaGift, FaTrophy, FaHistory, FaShoppingCart } from 'react-icons/fa';
import { useLoyaltyStore } from '@/store/loyalty';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600'
};

const tierIcons = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎'
};

export default function LoyaltyPage() {
  const { data: session } = useSession();
  const {
    getUserLoyalty,
    getAvailableRewards,
    redeemReward,
    getUserTransactions,
    addPoints
  } = useLoyaltyStore();

  const [activeTab, setActiveTab] = useState('overview');
  const userId = session?.user?.email || 'demo_user';
  
  const userLoyalty = getUserLoyalty(userId);
  const availableRewards = getAvailableRewards(userId);
  const transactions = getUserTransactions(userId);

  // Demo: Add welcome points for new users
  useEffect(() => {
    if (userLoyalty.totalPoints === 0) {
      addPoints(userId, 100, 'Welcome bonus');
      toast.success('Welcome! You received 100 loyalty points!');
    }
  }, [addPoints, userId, userLoyalty.totalPoints]);

  const handleRedeemReward = (rewardId: string, rewardTitle: string) => {
    const success = redeemReward(userId, rewardId);
    if (success) {
      toast.success(`Successfully redeemed: ${rewardTitle}`);
    } else {
      toast.error('Failed to redeem reward. Insufficient points.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <FaCrown className="mr-3 text-yellow-500" />
            Loyalty Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Earn points with every purchase and unlock amazing rewards
          </p>
        </div>

        {/* Loyalty Overview Card */}
        <div className={`bg-gradient-to-r ${tierColors[userLoyalty.tier]} rounded-2xl p-8 mb-8 text-white shadow-2xl`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier Status */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-2">
                <span className="text-4xl mr-3">{tierIcons[userLoyalty.tier]}</span>
                <div>
                  <h2 className="text-2xl font-bold capitalize">{userLoyalty.tier} Member</h2>
                  <p className="text-white/80">Current Tier</p>
                </div>
              </div>
            </div>

            {/* Points Balance */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{userLoyalty.availablePoints.toLocaleString()}</div>
              <p className="text-white/80">Available Points</p>
              <p className="text-sm text-white/60 mt-1">
                {userLoyalty.lifetimePoints.toLocaleString()} lifetime points
              </p>
            </div>

            {/* Tier Progress */}
            <div className="text-center md:text-right">
              <div className="mb-2">
                <span className="text-sm text-white/80">Progress to Next Tier</span>
                <div className="w-full bg-white/20 rounded-full h-3 mt-1">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${userLoyalty.tierProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-white/80 mt-1">
                  {userLoyalty.tier === 'platinum' 
                    ? 'Max tier reached!' 
                    : `${Math.round(userLoyalty.tierProgress)}% complete`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 mb-8 shadow-lg">
          {[
            { id: 'overview', label: 'Overview', icon: FaTrophy },
            { id: 'rewards', label: 'Rewards', icon: FaGift },
            { id: 'history', label: 'History', icon: FaHistory }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center">
                <FaStar className="text-2xl text-yellow-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userLoyalty.availablePoints}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Available Points</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center">
                <FaGift className="text-2xl text-green-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userLoyalty.redeemedRewards.length}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Rewards Redeemed</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center">
                <FaCrown className="text-2xl text-purple-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {userLoyalty.tier}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Current Tier</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center">
                <FaTrophy className="text-2xl text-blue-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userLoyalty.lifetimePoints}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Lifetime Points</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {reward.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {reward.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <FaStar className="text-yellow-500" />
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {reward.pointsCost} points
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {reward.type === 'discount' && (
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm px-3 py-1 rounded-full inline-block mb-4">
                      {reward.value}% OFF
                    </div>
                  )}
                  
                  {reward.minOrderValue && (
                    <p className="text-xs text-gray-500 mb-4">
                      Min. order value: ${reward.minOrderValue}
                    </p>
                  )}

                  <Button
                    onClick={() => handleRedeemReward(reward.id, reward.title)}
                    disabled={userLoyalty.availablePoints < reward.pointsCost}
                    className="w-full"
                    variant={userLoyalty.availablePoints >= reward.pointsCost ? 'primary' : 'outline'}
                  >
                    {userLoyalty.availablePoints >= reward.pointsCost 
                      ? 'Redeem Reward' 
                      : 'Insufficient Points'
                    }
                  </Button>
                </div>
              </div>
            ))}

            {availableRewards.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FaGift className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No rewards available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Earn more points to unlock amazing rewards!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Points History
              </h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <FaHistory className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No transaction history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'earned' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {transaction.type === 'earned' ? '+' : '-'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        transaction.type === 'earned' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Start Earning More Points!</h2>
          <p className="text-blue-100 mb-6">
            Shop now and earn points with every purchase. The more you shop, the more you save!
          </p>
          <Button
            variant="outline"
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 border-white"
            onClick={() => window.location.href = '/products'}
          >
            <FaShoppingCart className="mr-2" />
            Start Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
