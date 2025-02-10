import { Suspense } from 'react';
import { PaymentSuccessComponent } from '@/components/PaymentSuccessComponent';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Processing payment...</div>}>
      <PaymentSuccessComponent />
    </Suspense>
  );
} 