"use client";
import { 
  FaStar, 
  FaUsers, 
  FaQuestionCircle, 
  FaHeart, 
  FaShare, 
  FaChartLine,
  FaTrophy,
  FaFire
} from "react-icons/fa";
import { useSocialStore } from "@/store/social";

export default function SocialCommerceDashboard() {
  const { reviews, questions, influencers, influencerPosts } = useSocialStore();

  // Calculate social commerce metrics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.answers.length > 0).length;
  
  const totalInfluencerReach = influencers.reduce((sum, inf) => sum + inf.followers, 0);
  const activeInfluencerPosts = influencerPosts.length;

  const socialMetrics = [
    {
      icon: <FaStar className="text-yellow-500" />,
      title: "Average Rating",
      value: averageRating.toFixed(1),
      subtitle: `${totalReviews} reviews`,
      trend: "+0.2 this week"
    },
    {
      icon: <FaQuestionCircle className="text-blue-500" />,
      title: "Q&A Activity",
      value: `${answeredQuestions}/${totalQuestions}`,
      subtitle: "Questions answered",
      trend: "96% response rate"
    },
    {
      icon: <FaUsers className="text-purple-500" />,
      title: "Influencer Reach",
      value: `${(totalInfluencerReach / 1000000).toFixed(1)}M`,
      subtitle: `${influencers.length} active influencers`,
      trend: `${activeInfluencerPosts} recent posts`
    },
    {
      icon: <FaFire className="text-red-500" />,
      title: "Social Engagement",
      value: "94%",
      subtitle: "Customer satisfaction",
      trend: "+12% this month"
    }
  ];

  const topProducts = [
    { 
      id: 1, 
      name: "Fjallraven Backpack", 
      rating: 4.8, 
      reviews: 15, 
      shares: 89,
      trend: "up"
    },
    { 
      id: 2, 
      name: "Mens Casual Premium", 
      rating: 4.6, 
      reviews: 12, 
      shares: 67,
      trend: "up"
    },
    { 
      id: 3, 
      name: "Mens Cotton Jacket", 
      rating: 4.5, 
      reviews: 8, 
      shares: 45,
      trend: "stable"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Social Commerce Dashboard
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FaChartLine />
          <span>Live Analytics</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {socialMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">{metric.icon}</div>
              <span className="text-xs text-green-600 font-medium">
                {metric.trend}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {metric.title}
            </h3>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value}
            </div>
            <p className="text-xs text-gray-500">
              {metric.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Top Performing Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" />
            Top Rated Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {product.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span>{product.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{product.reviews} reviews</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <FaShare className="mr-1" />
                        <span>{product.shares}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  product.trend === 'up' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.trend === 'up' ? '↗' : '→'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaHeart className="text-red-500 mr-2" />
            Recent Social Activity
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New 5-star review
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    &quot;Amazing quality!&quot; - Alex Chen
                  </p>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Question answered
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Product material inquiry
                  </p>
                </div>
                <span className="text-xs text-gray-500">4h ago</span>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Influencer post
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    @sarahjstyle featured jacket
                  </p>
                </div>
                <span className="text-xs text-gray-500">1d ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
