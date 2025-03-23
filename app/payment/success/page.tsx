'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing');
  const subscriptionId = searchParams.get('subscription_id');
  
  // Verify the subscription and activate the account
  useEffect(() => {
    const verifySubscription = async () => {
      if (!subscriptionId) {
        setError('Subscription ID not found');
        setLoading(false);
        return;
      }
      
      try {
        // Here you would typically call your API to verify the subscription
        // and activate the user's account with the selected plan
        
        // For now, we'll just simulate a successful verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to verify subscription');
        setLoading(false);
      }
    };
    
    verifySubscription();
  }, [subscriptionId]);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-card border rounded-xl p-8 shadow-sm text-center">
        {loading ? (
          <div className="py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-primary/20 h-16 w-16 mb-4"></div>
              <div className="h-6 bg-primary/20 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-primary/10 rounded w-1/2"></div>
            </div>
          </div>
        ) : error ? (
          <div className="py-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Subscription Error</h1>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Link href="/pricing">
              <Button>Return to Pricing</Button>
            </Link>
          </div>
        ) : (
          <div className="py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
            <p className="mb-6 text-muted-foreground">
              Thank you for subscribing to our {plan} plan with {billing} billing.
              Your account has been activated and you can now start using our services.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="px-8">Go to Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 