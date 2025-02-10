'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PLAN_PRICES = {
  basic: 19,
  premium: 29,
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("");

  const plan = searchParams.get('plan') as 'basic' | 'premium';
  const amount = PLAN_PRICES[plan];

  useEffect(() => {
    if (!plan || !['basic', 'premium'].includes(plan)) {
      router.push('/dashboard');
    }
  }, [plan, router]);

  const paypalOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            Complete your payment for the {plan} plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold">${amount}</div>
            <div className="text-sm text-muted-foreground">One-time payment</div>
          </div>

          <div className="w-full p-4 border rounded-lg">
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons 
                style={{
                  layout: "vertical",
                  shape: "rect",
                }}
                createOrder={async () => {
                  try {
                    const response = await fetch("/api/payment", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ plan }),
                    });

                    const orderData = await response.json();

                    if (orderData.id) {
                      return orderData.id;
                    } else {
                      const errorDetail = orderData?.details?.[0];
                      const errorMessage = errorDetail
                        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                        : JSON.stringify(orderData);

                      throw new Error(errorMessage);
                    }
                  } catch (error) {
                    console.error(error);
                    setMessage(`Could not initiate PayPal Checkout...${error}`);
                    toast.error('Failed to initialize payment');
                    throw error;
                  }
                }}
                onApprove={async (data, actions) => {
                  try {
                    const response = await fetch("/api/payment", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        orderID: data.orderID,
                        plan,
                      }),
                    });

                    const orderData = await response.json();

                    if (!response.ok) {
                      throw new Error(orderData.error || 'Payment failed');
                    }

                    toast.success('Payment successful! Your plan has been upgraded.');
                    router.push('/dashboard');
                  } catch (error) {
                    console.error(error);
                    toast.error('Payment failed. Please try again.');
                  }
                }}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  toast.error('Payment failed. Please try again.');
                }}
              />
            </PayPalScriptProvider>
          </div>

          {message && (
            <div className="mt-4 text-center text-sm text-red-500">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 