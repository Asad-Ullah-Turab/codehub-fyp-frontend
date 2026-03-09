import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, Rocket, Lightbulb, Infinity, Zap } from 'lucide-react';
import { getSubscriptionStatus } from '../../services/subscriptionAPI';
import { useToast } from '../../contexts/ToastContext';

const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <div className="inline-flex items-center gap-2">
              Welcome to Premium!
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Welcome to the CodeHub family! Your premium subscription is now active and you have instant access to all our advanced features. Let's accelerate your coding journey together.
          </p>

          {/* Subscription Info */}
          {loading ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : subscription && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Subscription Active</h3>
              <p className="text-sm text-green-700">
                Plan: <span className="font-medium capitalize">{subscription.plan}</span>
              </p>
              <p className="text-sm text-green-700">
                Status: <span className="font-medium capitalize">{subscription.status}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Manage Subscription
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate('/editor')}
              className="w-full bg-green-100 text-green-700 font-medium py-3 px-6 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Start Coding Now
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Explore CodeHub
            </button>
          </div>

          {/* Premium Features */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              <div className="flex items-center gap-1">
                <Rocket className="w-5 h-5 text-blue-600" />
                What's New With Premium:
              </div>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <Infinity className="w-6 h-6 text-blue-800 mx-auto" />
                <div className="text-xs">AI Assistance</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <Infinity className="w-6 h-6 text-green-800 mx-auto" />
                <div className="text-xs">Code Help</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <Infinity className="w-6 h-6 text-purple-800 mx-auto" />
                <div className="text-xs">Tutorials</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <Zap className="w-6 h-6 text-yellow-800 mx-auto" />
                <div className="text-xs">Priority Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-500">
            Need help getting started?{' '}
            <a href="mailto:support@codehub.com" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact our team
            </a>
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-medium inline-block">
            <div className="inline-flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Pro Tip: Try asking the AI to "Generate a Python tutorial for beginners"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;