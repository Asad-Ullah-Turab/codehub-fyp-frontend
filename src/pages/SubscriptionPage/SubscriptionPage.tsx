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
  Star,
  Zap,
  MessageSquare,
  Code,
  BookOpen,
  CreditCard,
  ArrowLeft,
  Lightbulb,
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
              Join thousands of developers who've accelerated their coding
              journey with CodeHub Premium.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Current Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border relative">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Free Plan
              </h2>
              <p className="text-gray-600">Your current plan</p>
              <div className="mt-4 text-3xl font-bold text-gray-900">
                $0{" "}
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Basic courses & tutorials (≈10)
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-gray-400" />5 AI chat/code queries
                per day
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-400" />
                Up to 5 tutorial generations/day
              </li>
            </ul>

            <p className="text-center text-gray-500 text-xs">
              Upgrade for unlimited access, premium content, and more tools.
            </p>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl shadow-2xl p-10 text-white relative hover:shadow-3xl transition-shadow duration-300">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-5 py-2 rounded-full text-base font-bold flex items-center gap-2">
                <Star className="w-5 h-5" />
                BEST VALUE
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold mb-2 flex items-center justify-center gap-2">
                <span className="inline-block w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </span>
                Premium Plan
              </h2>
              <p className="text-blue-100">Full access, no limits</p>
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  $9.99{" "}
                  <span className="text-lg font-normal text-blue-200">
                    /month
                  </span>
                </div>
                <p className="text-sm text-blue-200 mt-1">
                  Access 200+ premium courses & 1k+ tutorials
                </p>
              </div>
            </div>

            <ul className="space-y-4 mb-8 text-white text-sm">
              <li className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Unlimited AI chat & code help
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-yellow-400" />
                Unlimited premium courses & tutorials
              </li>
              <li className="flex items-center gap-2">
                <Code className="w-5 h-5 text-yellow-400" />
                Unlimited tutorial generation
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-yellow-400" />
                Priority 24/7 support
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-yellow-400" />
                Certificates & downloadable materials
              </li>
            </ul>

            {subscriptionInfo?.plan === 'premium' ? (
              <div className="space-y-4">
                <div className="text-center text-blue-200 font-semibold">
                  You are already on the Premium Plan
                </div>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="w-full bg-red-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canceling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            ) : (
              <>
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
                  <Lightbulb className="inline w-4 h-4 text-yellow-500" /> Cancel
                  anytime • Secure payment with Stripe
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
