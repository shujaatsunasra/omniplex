// Test Stripe API Keys
const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

async function testStripeKeys() {
  try {
    // Test by creating a small payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1.00 in cents
      currency: 'usd',
      description: 'Test payment intent',
    });
    
    console.log('✅ Stripe keys are working! Payment intent ID:', paymentIntent.id);
    return true;
  } catch (error) {
    console.error('❌ Stripe keys are not working:', error.message);
    return false;
  }
}

testStripeKeys();
