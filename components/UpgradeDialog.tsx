'use client';

import { useState } from "react";
import { SubscriptionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface UpgradeDialogProps {
  currentPlan: SubscriptionType;
  isTrialExpired?: boolean;
}

export function UpgradeDialog({ currentPlan, isTrialExpired }: UpgradeDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isPaymentPage = pathname.startsWith('/payment');

  const handlePayment = (plan: 'basic' | 'premium') => {
    router.push(`/payment?plan=${plan}`);
    setOpen(false);
  };

  if (currentPlan === 'premium') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="hidden md:flex"
          disabled={isPaymentPage}
        >
          Upgrade{currentPlan === 'basic' ? ' to Premium' : ' Plan'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {currentPlan === 'basic' ? 'Upgrade to Premium' : 'Choose Your Plan'}
          </DialogTitle>
          <DialogDescription>
            {currentPlan === 'basic' 
              ? 'Get access to all premium features and unlimited reminders'
              : 'Select the plan that best fits your needs'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {currentPlan === 'free' && (
            <div className="bg-card border-2 rounded-lg border-primary/20 p-6">
              <h3 className="text-xl font-semibold">Basic Plan</h3>
              <div className="text-2xl font-bold mt-2">$19</div>
              <p className="text-sm text-muted-foreground">One-time payment</p>
              <ul className="space-y-2 my-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Up to 10 reminders per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">WhatsApp notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Basic customization</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => handlePayment('basic')}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          <div className="bg-card border-2 rounded-lg border-primary p-6">
            <h3 className="text-xl font-semibold">Premium Plan</h3>
            <div className="text-2xl font-bold mt-2">$29</div>
            <p className="text-sm text-muted-foreground">One-time payment</p>
            <ul className="space-y-2 my-6">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Unlimited reminders</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Priority WhatsApp delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Premium customization</span>
              </li>
            </ul>
            <Button 
              className="w-full"
              onClick={() => handlePayment('premium')}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 