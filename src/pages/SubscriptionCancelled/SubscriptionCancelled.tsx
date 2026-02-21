import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, CreditCard, MessageCircle } from 'lucide-react';

const SubscriptionCancelled: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/upgrade');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-full p-4 shadow-lg">
              <XCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your payment was cancelled - no worries! Many developers take time to evaluate their options. Your account remains secure and all your projects are safe.
          </p>

          {/* Current Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Current Status</h3>
            <p className="text-sm text-yellow-700">
              You're still on the <span className="font-medium">Free Plan</span> with limited features.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Complete My Upgrade
            </button>
            
            <button
              onClick={() => navigate('/editor')}
              className="w-full bg-green-100 text-green-700 font-medium py-3 px-6 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Continue with Free Plan
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          {/* Why Upgrade Section */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              🚀 Join 50,000+ developers who chose Premium:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>10x faster</strong> problem-solving with unlimited AI assistance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Debug any language</strong> with instant code explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Learn faster</strong> with personalized tutorial generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>VIP support</strong> - get help when you need it most</span>
              </li>
            </ul>
          </div>

          {/* Current Limits */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Free Plan Limitations:
            </h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="font-medium text-red-800">Chat</div>
                <div className="text-red-600">5 queries</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="font-medium text-red-800">Code Help</div>
                <div className="text-red-600">5 queries</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="font-medium text-red-800">Tutorials</div>
                <div className="text-red-600">5 generated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-6 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm font-medium text-gray-900 mb-1">Limited Time Offer</p>
            <p className="text-xs text-gray-600">Get 30% off your first month when you upgrade today!</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-2">
            Payment questions?{' '}
            <a 
              href="mailto:support@codehub.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              We're here to help
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancelled;