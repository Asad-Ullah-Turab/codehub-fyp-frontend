import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription,
} from "../../services/subscriptionAPI";
import { useToast } from "../../contexts/ToastContext";
import {
  Check,
  CreditCard,
  ArrowLeft,
  Award,
  Shield,
  Sparkles,
  Clock,
  Infinity,
} from "lucide-react";

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    plan: string;
    status: string;
    chatQueriesRemaining: number;
    codeQueriesRemaining: number;
    tutorialGenRemaining: number;
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getSubscriptionStatus();
        setSubscriptionInfo(status);

        // If already premium, show message and offer cancellation option
        if (status.plan === "premium") {
          showToast("You already have an active premium subscription!", "info");
          // keep page so they can cancel if desired
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
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
        throw new Error("Failed to initiate checkout session");
      }
    } catch (err: unknown) {
      console.error("Checkout error", err);
      const message =
        err instanceof Error
          ? err.message
          : "Unable to start subscription checkout";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (canceling) return;
    setCanceling(true);
    try {
      await cancelSubscription();
      showToast("Subscription cancelled", "success");
      const status = await getSubscriptionStatus();
      setSubscriptionInfo(status);
      navigate("/profile");
    } catch (err: unknown) {
      console.error("Cancel error", err);
      showToast(
        err instanceof Error ? err.message : "Failed to cancel subscription",
        "error",
      );
    } finally {
      setCanceling(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Checking subscription status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the plan that works best for you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Free Plan
              </h3>
              <p className="text-gray-600 mb-4">Perfect for getting started</p>
              <div className="text-4xl font-bold text-gray-900">
                $0
                <span className="text-lg font-normal text-gray-500 ml-1">
                  /month
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    5 AI Chat Queries
                  </p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    5 Code Help Queries
                  </p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    5 Tutorial Generations
                  </p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Basic Course Access
                  </p>
                  <p className="text-sm text-gray-600">Community support</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium">
                {subscriptionInfo?.plan === "free"
                  ? "Your Current Plan"
                  : "Always Free"}
              </p>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-indigo-600 rounded-2xl shadow-lg p-8 text-white relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full font-bold text-sm shadow-md">
                MOST POPULAR
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
              <p className="text-indigo-200 mb-4">Unlimited everything</p>
              <div className="text-4xl font-bold">
                $9.99
                <span className="text-lg font-normal text-indigo-200 ml-1">
                  /month
                </span>
              </div>
              <p className="text-sm text-indigo-200 mt-2">
                Cancel anytime
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Infinity className="w-3 h-3 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Unlimited AI Chat
                  </p>
                  <p className="text-sm text-indigo-200">
                    Ask unlimited questions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Infinity className="w-3 h-3 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Unlimited Code Help
                  </p>
                  <p className="text-sm text-indigo-200">
                    Get instant debugging assistance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Infinity className="w-3 h-3 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Unlimited Tutorials
                  </p>
                  <p className="text-sm text-indigo-200">
                    Generate personalized learning content
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-white">Priority Support</p>
                  <p className="text-sm text-indigo-200">
                    Fast response times
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Certificates & Portfolio
                  </p>
                  <p className="text-sm text-indigo-200">
                    Showcase your achievements
                  </p>
                </div>
              </div>
            </div>

            {subscriptionInfo?.plan === "premium" ? (
              <div className="space-y-4">
                <div className="text-center bg-white/10 rounded-xl p-4">
                  <p className="font-semibold text-white mb-2">
                    ✨ You're Already Premium!
                  </p>
                  <p className="text-sm text-indigo-200">
                    Enjoying unlimited access
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="w-full bg-white/10 border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canceling ? "Cancelling..." : "Manage Subscription"}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleUpgradeToPremium}
                  disabled={loading}
                  className="w-full bg-white text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md mb-4"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Upgrade to Premium</span>
                    </>
                  )}
                </button>

                <div className="text-center space-y-1">
                  <p className="text-indigo-200 text-xs flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>Secure payment with Stripe</span>
                  </p>
                  <p className="text-indigo-200 text-xs flex items-center justify-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>Cancel anytime</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
