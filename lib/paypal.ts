import { SubscriptionType } from "@prisma/client";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY!;

interface PaymentDetails {
  plan: 'basic' | 'premium';
  amount: number;
}

const PLAN_PRICES = {
  basic: 19,
  premium: 29,
};

export async function createPayPalOrder(plan: 'basic' | 'premium') {
  try {
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString('base64')}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: PLAN_PRICES[plan].toString(),
            },
            description: `RemindMe ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          },
        ],
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
} 
