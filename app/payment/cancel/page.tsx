'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error('Payment was cancelled.');
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p>Redirecting you back to the dashboard...</p>
    </div>
  );
} 