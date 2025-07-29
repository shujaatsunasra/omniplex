"use client";

import React, { useState } from 'react';

interface MockStripeCheckoutProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function MockStripeCheckout({ onSuccess, onError }: MockStripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Simulate payment processing
    try {
      // Mock validation
      if (cardNumber.length < 16) {
        throw new Error('Please enter a valid card number');
      }
      
      if (!expiry || !cvc || !name) {
        throw new Error('Please fill in all fields');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test card numbers
      if (cardNumber === '4242424242424242') {
        console.log('✅ Mock payment successful!');
        onSuccess();
      } else if (cardNumber === '4000000000000002') {
        throw new Error('Your card was declined.');
      } else {
        // Default success for demo
        console.log('✅ Mock payment successful!');
        onSuccess();
      }
    } catch (error: any) {
      console.error('❌ Mock payment failed:', error.message);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-700">
          <strong>Demo Mode:</strong> Use test card 4242 4242 4242 4242 for success
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry
            </label>
            <input
              type="text"
              value={formatExpiry(expiry)}
              onChange={(e) => setExpiry(e.target.value.replace(/\D/g, ''))}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              maxLength={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } transition-colors`}
        >
          {loading ? 'Processing...' : 'Pay $10.00'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Test Cards:</strong></p>
        <p>• Success: 4242 4242 4242 4242</p>
        <p>• Declined: 4000 0000 0000 0002</p>
        <p>• Use any future date and any CVC</p>
      </div>
    </div>
  );
}
