import { SubscriptionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

interface UpgradeOptionsProps {
  currentPlan: SubscriptionType;
  isTrialExpired?: boolean;
}

export function UpgradeOptions({ currentPlan, isTrialExpired }: UpgradeOptionsProps) {
  const handleUpgrade = (plan: 'basic' | 'premium') => {
    // Add payment logic here
    console.log(`Upgrading to ${plan}`);
  };

  if (currentPlan === 'premium') return null;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>
          {currentPlan === 'basic' ? 'Upgrade to Premium' : 'Upgrade Your Plan'}
        </CardTitle>
        <CardDescription>
          {currentPlan === 'basic' 
            ? 'Get access to all premium features and unlimited reminders'
            : isTrialExpired 
              ? 'Your free trial has expired. Choose a plan to continue using RemindMe'
              : 'Upgrade now to unlock more features and reminders'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {currentPlan === 'free' && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">Basic Plan</CardTitle>
                <div className="text-2xl font-bold">$19</div>
                <CardDescription>One-time payment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
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
                  onClick={() => handleUpgrade('basic')}
                >
                  Upgrade to Basic
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-xl">Premium Plan</CardTitle>
              <div className="text-2xl font-bold">$29</div>
              <CardDescription>One-time payment</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
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
                onClick={() => handleUpgrade('premium')}
              >
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 