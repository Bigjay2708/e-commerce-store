import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export interface PaymentIntentData {
  amount: number;
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

// Create payment intent
export async function createPaymentIntent(data: PaymentIntentData) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      customer: data.customerId,
      metadata: data.metadata || {},
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    return {
      success: false,
      error: 'Payment intent creation failed',
    };
  }
}

// Verify payment status
export async function verifyPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: true,
      status: paymentIntent.status,
      paymentIntent,
    };
  } catch (error) {
    console.error('Payment verification failed:', error);
    return {
      success: false,
      error: 'Payment verification failed',
    };
  }
}

// Create Stripe customer
export async function createStripeCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return {
      success: true,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('Stripe customer creation failed:', error);
    return {
      success: false,
      error: 'Customer creation failed',
    };
  }
}

// Calculate order total in cents
export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity * 100); // Convert to cents
  }, 0);
}
