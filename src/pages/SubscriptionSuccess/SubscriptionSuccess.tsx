import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Sparkles, 
  Rocket, 
  Lightbulb, 
  Zap,
  Award,
  Star,
  Code,
  BookOpen,
  MessageSquare,
  Target,
  Crown,
  Gift
} from 'lucide-react';
import { getSubscriptionStatus } from '../../services/subscriptionAPI';
import { useToast } from '../../contexts/ToastContext';

const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [subscription, setSubscription] = useState<{plan: string; status: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const status = await getSubscriptionStatus();
        setSubscription(status);
        
        // Show success toast
        showToast('Welcome to CodeHub Premium!', 'success');
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        showToast('There was an issue confirming your subscription. Please contact support.', 'error');
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure webhook has processed
    setTimeout(fetchSubscriptionStatus, 3000);
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200/30 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-20 h-20 bg-purple-200/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-200/30 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-indigo-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-200/10 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Main Success Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Celebration Header */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-center relative overflow-hidden">
            {/* Floating Icons */}
            <div className="absolute inset-0">
              <Star className="absolute top-4 left-6 w-6 h-6 text-yellow-300 animate-pulse" />
              <Sparkles className="absolute top-6 right-8 w-5 h-5 text-yellow-200 animate-bounce" />
              <Award className="absolute bottom-4 left-8 w-7 h-7 text-yellow-300 animate-pulse delay-1000" />
              <Crown className="absolute bottom-6 right-6 w-6 h-6 text-yellow-200 animate-bounce delay-500" />
            </div>
            
            <div className="relative z-10">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-full p-6 shadow-2xl animate-bounce">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 animate-pulse">
                    <Crown className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                🎉 Welcome to
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Premium!
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-indigo-100 font-light leading-relaxed">
                You've unlocked unlimited coding superpowers!
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Description */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                🚀 Your premium subscription is now <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">active</span>! 
                Join <span className="font-bold text-indigo-600">10,000+</span> developers already accelerating their coding journey.
              </p>
            </div>

            {/* Subscription Status */}
            {loading ? (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-200">
                <div className="animate-pulse flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                  <span className="text-indigo-700 font-medium">Activating your premium features...</span>
                </div>
              </div>
            ) : subscription && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-emerald-500 rounded-full p-2 mr-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-emerald-800 text-xl">Subscription Active!</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Plan</p>
                    <p className="font-bold text-emerald-800 capitalize">{subscription.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Status</p>
                    <p className="font-bold text-emerald-800 capitalize">{subscription.status}</p>
                  </div>
                </div>
              </div>
            )}

            {/* What's Unlocked */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-6 flex items-center justify-center gap-2">
                <Gift className="w-7 h-7 text-indigo-600" />
                What's Unlocked For You
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    icon: MessageSquare, 
                    title: "Unlimited AI Chat", 
                    description: "Ask anything, anytime",
                    color: "from-blue-500 to-blue-600"
                  },
                  { 
                    icon: Code, 
                    title: "Code Help", 
                    description: "Debug, review, optimize",
                    color: "from-green-500 to-green-600"
                  },
                  { 
                    icon: BookOpen, 
                    title: "Premium Tutorials", 
                    description: "1000+ expert guides",
                    color: "from-purple-500 to-purple-600"
                  },
                  { 
                    icon: Zap, 
                    title: "Priority Support", 
                    description: "< 2 hour response",
                    color: "from-indigo-500 to-purple-600"
                  }
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-center mb-1 text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-600 text-center">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => navigate('/editor?welcome=premium')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Coding with AI</span>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/profile?tab=subscription')}
                  className="bg-indigo-50 text-indigo-700 font-semibold py-3 px-4 rounded-xl hover:bg-indigo-100 transition-colors duration-200 flex items-center justify-center gap-2 border border-indigo-200"
                >
                  <Target className="w-4 h-4" />
                  <span>Manage Plan</span>
                </button>
                
                <button
                  onClick={() => navigate('/tutorials')}
                  className="bg-purple-50 text-purple-700 font-semibold py-3 px-4 rounded-xl hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center gap-2 border border-purple-200"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Tutorials</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Need help getting started?{' '}
            <a href="mailto:support@codehub.com" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors">
              Contact our team
            </a>
          </p>
          
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full inline-block shadow-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="w-4 h-4 text-yellow-300" />
              <span>Pro Tip: Try asking "Generate a React tutorial for components"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;