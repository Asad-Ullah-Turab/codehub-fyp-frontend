import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession, getSubscriptionStatus, cancelSubscription } from '../../services/subscriptionAPI';
import { useToast } from '../../contexts/ToastContext';
import { Check, Star, Zap, MessageSquare, Code, BookOpen, CreditCard, ArrowLeft, Lightbulb } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{plan: string; status: string; chatQueriesRemaining: number; codeQueriesRemaining: number; tutorialGenRemaining: number} | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getSubscriptionStatus();
        setSubscriptionInfo(status);
        
        // If already premium, show message and offer cancellation option
        if (status.plan === 'premium') {
          showToast('You already have an active premium subscription!', 'info');
          // keep page so they can cancel if desired
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    fetchStatus();
  }, [navigate, showToast]);

  const handleUpgradeToPremium = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await createCheckoutSession();
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to initiate checkout session');
      }
    } catch (err: unknown) {
      console.error('Checkout error', err);
      const message = err instanceof Error ? err.message : 'Unable to start subscription checkout';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (canceling) return;
    setCanceling(true);
    try {
      await cancelSubscription();
      showToast('Subscription cancelled', 'success');
      const status = await getSubscriptionStatus();
      setSubscriptionInfo(status);
      navigate('/profile');
    } catch (err: unknown) {
      console.error('Cancel error', err);
      showToast(err instanceof Error ? err.message : 'Failed to cancel subscription', 'error');
    } finally {
      setCanceling(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unlock Your Coding Potential
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of developers who've accelerated their coding journey with CodeHub Premium.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg">
              <Zap className="w-5 h-5" />
              Limited Time: 30% Off First Month
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Current Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border relative">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h2>
              <p className="text-gray-600">Your current plan</p>
              <div className="mt-4 text-3xl font-bold text-gray-900">
                $0 <span className="text-lg font-normal text-gray-500">/month</span>
              </div>
            </div>

            {subscriptionInfo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-800 mb-3">Remaining Usage:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Chat Queries:</span>
                    <span className="font-medium text-yellow-900">{subscriptionInfo.chatQueriesRemaining}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Code Help:</span>
                    <span className="font-medium text-yellow-900">{subscriptionInfo.codeQueriesRemaining}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Tutorial Generation:</span>
                    <span className="font-medium text-yellow-900">{subscriptionInfo.tutorialGenRemaining}/5</span>
                  </div>
                </div>
              </div>
            )}

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-gray-600 text-xs font-bold">5</span>
                </div>
                <span className="text-gray-700">AI chat queries per day</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-gray-600 text-xs font-bold">5</span>
                </div>
                <span className="text-gray-700">Code debugging sessions per day</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-gray-600 text-xs font-bold">5</span>
                </div>
                <span className="text-gray-700">AI tutorial generations per day</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Access to basic courses</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Community support</span>
              </li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                <Star className="w-4 h-4" />
                RECOMMENDED
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
              <p className="text-blue-100">Everything you need to succeed</p>
              <div className="mt-4">
                <div className="text-lg text-blue-200 line-through">$14.99</div>
                <div className="text-3xl font-bold">
                  $9.99 <span className="text-lg font-normal text-blue-200">/month</span>
                </div>
                <p className="text-sm text-blue-100 mt-1">Save $5/month for first 3 months</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Unlimited AI chat assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <Code className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Unlimited code debugging & explanations</span>
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Unlimited tutorial generation</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Access to all courses & tutorials</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Advanced code analysis tools</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Exclusive premium content</span>
              </li>
            </ul>

            <button
              onClick={handleUpgradeToPremium}
              disabled={loading}
              className="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Start Your Premium Journey
                </>
              )}
            </button>
            
            <p className="text-center text-blue-100 text-sm mt-4">
              <Lightbulb className="inline w-4 h-4 text-yellow-500" /> Cancel anytime • Secure payment with Stripe
            </p>
          </div>
        </div>

        {/* Features Section */}
{/* if premium allow cancellation */}
          {subscriptionInfo?.plan === 'premium' && (
            <div className="text-center mb-6">
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {canceling ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            </div>
          )}

          <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Premium?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast AI</h3>
              <p className="text-gray-600">
                Get instant answers to your coding questions with our advanced AI assistant.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Debugging</h3>
              <p className="text-gray-600">
                Debug complex code issues with detailed explanations and suggested fixes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Learning</h3>
              <p className="text-gray-600">
                Generate personalized tutorials on any topic to accelerate your learning.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof / Testimonials */}
        <div className="mt-16 bg-gray-900 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-8">
            Trusted by Developers Worldwide
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">50,000+</div>
              <p className="text-gray-300 text-sm">Active Premium Users</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1M+</div>
              <p className="text-gray-300 text-sm">AI Queries Solved</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">4.9★</div>
              <p className="text-gray-300 text-sm">User Satisfaction</p>
            </div>
          </div>
          
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-gray-400">Full Stack Developer</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                "CodeHub Premium cut my debugging time by 80%. The AI explanations are incredibly accurate and help me understand complex concepts faster."
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-semibold">Marcus Rodriguez</div>
                  <div className="text-sm text-gray-400">CS Student</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                "As a computer science student, the unlimited tutorial generation has been a game-changer. I can learn any topic at my own pace."
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How secure is my payment information?</h3>
              <p className="text-gray-600">
                We use Stripe, a PCI-compliant payment processor trusted by millions of businesses worldwide. Your payment information is encrypted and never stored on our servers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time from your profile page. You'll continue to have premium access until the end of your current billing period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens to my projects if I cancel?</h3>
              <p className="text-gray-600">
                All your projects, code snippets, and learning progress remain accessible. You'll simply return to the free plan limits for new AI interactions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer student discounts?</h3>
              <p className="text-gray-600">
                Yes! Students can get 50% off with a valid .edu email address. Contact support@codehub.com to apply for student pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-green-800 mb-2">💯 30-Day Money Back Guarantee</h3>
          <p className="text-sm text-green-700">
            Not satisfied? Get a full refund within 30 days, no questions asked. We're confident you'll love CodeHub Premium!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;