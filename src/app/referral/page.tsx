"use client";
import { useState, useEffect } from 'react';
import { FaUsers, FaShare, FaCopy, FaEnvelope, FaWhatsapp, FaTwitter, FaFacebook, FaCheck, FaGift } from 'react-icons/fa';
import { useReferralStore } from '@/store/referral';

import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function ReferralPage() {
  const { data: session } = useSession();
  const { 
    getUserReferralCode, 
    createReferral, 
    getUserReferrals, 
    getReferralStats,
    getActiveProgram
  } = useReferralStore();


  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'email' | 'social' | 'link'>('link');

  const userId = session?.user?.email || 'demo_user';
  const referralCode = getUserReferralCode(userId);
  const referrals = getUserReferrals(userId);
  const stats = getReferralStats(userId);
  const program = getActiveProgram();

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register?ref=${referralCode}`
    : `https://localhost:3000/register?ref=${referralCode}`;

  useEffect(() => {

    if (referrals.length === 0) {
      createReferral(userId, 'friend1@example.com');
      createReferral(userId, 'friend2@example.com');
    }
  }, [createReferral, userId, referrals.length]);

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('Clipboard not available');
      }
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleEmailInvite = () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    createReferral(userId, email);
    setEmail('');
    toast.success('Referral invitation sent!');
  };

  const shareToSocial = (platform: string) => {
    const text = `Join me on ShopEase and get ${program?.refereeReward}% off your first order! Use my referral link:`;
    const url = referralLink;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    };

    if (typeof window !== 'undefined') {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <FaUsers className="mr-3 text-blue-500" />
            Refer Friends & Earn Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Share the love and get rewarded when your friends join ShopEase
          </p>
        </div>

        
        {program && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">{program.name}</h2>
                <p className="text-blue-100 mb-4">{program.description}</p>
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{program.referrerReward}</div>
                    <div className="text-sm text-blue-200">Points for you</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{program.refereeReward}%</div>
                    <div className="text-sm text-blue-200">Discount for friends</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <FaGift className="text-6xl mb-4 mx-auto opacity-80" />
                <p className="text-lg font-semibold">Start Referring Today!</p>
              </div>
            </div>
          </div>
        )}

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
            <FaUsers className="text-3xl text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReferrals}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Total Referrals</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
            <FaCheck className="text-3xl text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedReferrals}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Successful</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
            <FaGift className="text-3xl text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRewards}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Points Earned</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
            <FaShare className="text-3xl text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingReferrals}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Pending</div>
          </div>
        </div>

        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Share Your Referral Link
          </h2>

          
          <div className="flex space-x-2 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'link', label: 'Copy Link', icon: FaShare },
              { id: 'email', label: 'Email Invite', icon: FaEnvelope },
              { id: 'social', label: 'Social Media', icon: FaUsers }
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setShareMethod(method.id as 'email' | 'social' | 'link')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                  shareMethod === method.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <method.icon />
                <span>{method.label}</span>
              </button>
            ))}
          </div>

          
          {shareMethod === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Referral Code
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralCode}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-center font-mono text-lg"
                  />
                  <Button onClick={handleCopyLink} variant="outline">
                    {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Referral Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
                  />
                  <Button onClick={handleCopyLink} variant="primary">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {shareMethod === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Friend&apos;s Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your friend&apos;s email"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                />
              </div>
              <Button onClick={handleEmailInvite} variant="primary" className="w-full">
                Send Invitation
              </Button>
            </div>
          )}

          {shareMethod === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => shareToSocial('twitter')}
                className="flex items-center justify-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white"
              >
                <FaTwitter />
                <span>Share on Twitter</span>
              </Button>
              <Button
                onClick={() => shareToSocial('facebook')}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FaFacebook />
                <span>Share on Facebook</span>
              </Button>
              <Button
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white"
              >
                <FaWhatsapp />
                <span>Share on WhatsApp</span>
              </Button>
            </div>
          )}
        </div>

        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Referrals
          </h2>

          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <FaUsers className="mx-auto text-4xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No referrals yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start sharing your referral link to earn rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      referral.status === 'completed' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                        : referral.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {referral.status === 'completed' ? <FaCheck /> : <FaUsers />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {referral.refereeEmail}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Referred on {formatDate(referral.dateCreated)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      referral.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : referral.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                    </span>
                    {referral.status === 'completed' && referral.dateCompleted && (
                      <p className="text-xs text-gray-500 mt-1">
                        Completed {formatDate(referral.dateCompleted)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaShare className="text-2xl" />
              </div>
              <h3 className="font-bold mb-2">1. Share Your Link</h3>
              <p className="text-purple-100">Share your unique referral link with friends and family</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaUsers className="text-2xl" />
              </div>
              <h3 className="font-bold mb-2">2. Friends Sign Up</h3>
              <p className="text-purple-100">Your friends create an account and make their first purchase</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaGift className="text-2xl" />
              </div>
              <h3 className="font-bold mb-2">3. Earn Rewards</h3>
              <p className="text-purple-100">You both get rewarded - you earn points, they get a discount!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
