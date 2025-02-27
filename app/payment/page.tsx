import { Suspense } from 'react';
import { PaymentComponent } from '@/components/PaymentComponent';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function PaymentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <PaymentComponent />
    </Suspense>
  );
} 
