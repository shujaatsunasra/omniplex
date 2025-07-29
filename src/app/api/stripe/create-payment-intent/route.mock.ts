import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd', description } = await req.json();

    // Mock payment intent for demonstration
    const mockPaymentIntent = {
      id: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
      client_secret: 'pi_mock_' + Math.random().toString(36).substr(2, 9) + '_secret_' + Math.random().toString(36).substr(2, 9),
      amount,
      currency,
      description,
      status: 'requires_payment_method'
    };

    console.log('✅ Mock payment intent created:', mockPaymentIntent.id);

    return NextResponse.json({ 
      clientSecret: mockPaymentIntent.client_secret,
      mockMode: true,
      message: 'Using mock payment for demonstration'
    });
  } catch (error) {
    console.error('Error creating mock payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
