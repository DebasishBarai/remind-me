'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing') || 'monthly';
  
  // Plan details for display
  const planDetails = {
    basic: {
      name: 'Basic Plan',
      monthly: {
        price: '$99',
        interval: 'month'
      },
      yearly: {
        price: '$795',
        interval: 'year'
      }
    },
    premium: {
      name: 'Premium Plan',
      monthly: {
        price: '$199',
        interval: 'month'
      },
      yearly: {
        price: '$1,599',
        interval: 'year'
      }
    }
  };
  
  // Get current plan details
  const currentPlan = plan === 'basic' ? planDetails.basic : planDetails.premium;
  const currentBilling = billing === 'yearly' ? currentPlan.yearly : currentPlan.monthly;
  
  const handleSubscribe = async () => {
    if (!plan) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = window.location.origin;
      
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          billing,
          baseUrl
        }),
      });
      
      const data = await response.json();
      
      if (data.approvalUrl) {
        // Redirect to PayPal for subscription approval
        window.location.href = data.approvalUrl;
      } else {
        setError(data.error || 'Failed to create subscription');
      }
    } catch (err) {
      setError('An error occurred while processing your payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect if no plan is selected
  useEffect(() => {
    if (!plan) {
      router.push('/pricing');
    }
  }, [plan, router]);
  
  if (!plan) return null;
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-card border rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-6">Complete Your Subscription</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Plan:</span>
              <span className="font-medium">{currentPlan.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Billing Cycle:</span>
              <span className="font-medium capitalize">{billing}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Price:</span>
              <span className="font-medium">{currentBilling.price}/{currentBilling.interval}</span>
            </div>
            {billing === 'yearly' && (
              <div className="mt-2 text-green-600 text-sm font-medium">
                You save 33% with annual billing!
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <Button 
            onClick={handleSubscribe} 
            className="w-full py-6 text-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe with PayPal'
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            You can cancel your subscription at any time.
          </p>
        </div>
      </div>
    </div>
  );
} 
