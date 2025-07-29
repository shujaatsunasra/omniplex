"use client";

import React, { useState } from 'react';
import StripeCheckout from '../../components/StripeCheckout/StripeCheckout';
import MockStripeCheckout from '../../components/MockStripeCheckout/MockStripeCheckout';

export default function Pricing() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [useMockPayment, setUseMockPayment] = useState(false); // Use real Stripe now

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setShowCheckout(false);
    // Redirect to success page after a brief delay
    setTimeout(() => {
      window.location.href = '/payment/success?session_id=payment_intent_success';
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setTimeout(() => setPaymentError(''), 5000);
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Complete Your Purchase
          </h1>
          <p className="text-xl text-blue-100">
            Upgrade to Pro Plan - $10/month
          </p>
          
          {useMockPayment && (
            <div className="max-w-md mx-auto mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
              <p className="text-sm">
                <strong>Demo Mode:</strong> This is a demonstration. For real payments, 
                <button 
                  onClick={() => setUseMockPayment(false)}
                  className="underline ml-1"
                >
                  switch to real Stripe
                </button>
                (requires API keys).
              </p>
            </div>
          )}
        </div>          {paymentError && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {paymentError}
            </div>
          )}

          {paymentSuccess && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
              Payment successful! Redirecting...
            </div>
          )}

          {useMockPayment ? (
            <MockStripeCheckout 
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          ) : (
            <StripeCheckout 
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}

          <div className="text-center mt-4">
            <button
              onClick={() => setUseMockPayment(!useMockPayment)}
              className="text-blue-100 hover:text-white text-sm underline mb-4"
            >
              {useMockPayment ? 'Switch to Real Stripe' : 'Switch to Demo Mode'}
            </button>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setShowCheckout(false)}
              className="text-blue-100 hover:text-white underline"
            >
              ← Back to Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-blue-100">
            Upgrade to Pro for enhanced features and unlimited access
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Plan</h3>
            <div className="text-4xl font-bold text-purple-600 mb-6">
              $0<span className="text-lg text-purple-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic AI Chat
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Limited searches per day
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic features
              </li>
            </ul>
            <button 
              className="w-full bg-gray-300 text-purple-600 font-bold py-3 px-4 rounded-lg cursor-not-allowed"
              disabled
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-xl p-8 border-4 border-purple-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                RECOMMENDED
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro Plan</h3>
            <div className="text-4xl font-bold text-purple-600 mb-6">
              $10<span className="text-lg text-purple-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited AI Chat
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited searches
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced features
              </li>
            </ul>
            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Upgrade to Pro
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Secure payment with Stripe. Test card: 4242 4242 4242 4242
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-100 hover:text-white underline"
          >
            Back to App
          </button>
        </div>
      </div>
    </div>
  );
}
