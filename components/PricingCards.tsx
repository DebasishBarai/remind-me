import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PricingCards = () => {
  return (
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
      <p className="text-muted-foreground mb-12">Start with a 7-day free trial. No credit card required.</p>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-card p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Basic Plan</h3>
          <div className="text-4xl font-bold mb-2">$19</div>
          <p className="text-muted-foreground mb-6">One-time payment</p>
          <div className="bg-primary/10 text-primary rounded-full text-sm font-medium py-1 px-3 mb-6">
            7 days free trial
          </div>
          <ul className="space-y-3 text-left mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>Up to 10 reminders per month</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>WhatsApp notifications</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>Recurring reminders</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>Basic customization</span>
            </li>
          </ul>
          <Link href="/payment?plan=basic">
            <Button className="w-full">Choose Basic</Button>
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="bg-card p-8 rounded-lg shadow-lg border-2 border-primary">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
          <div className="text-4xl font-bold mb-2">$29</div>
          <p className="text-muted-foreground mb-6">One-time payment</p>
          <div className="bg-primary/10 text-primary rounded-full text-sm font-medium py-1 px-3 mb-6">
            7 days free trial
          </div>
          <ul className="space-y-3 text-left mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>Unlimited reminders</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>Priority WhatsApp delivery</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>Advanced recurring options</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>Premium customization</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>Priority support</span>
            </li>
          </ul>
          <Link href="/payment?plan=premium">
            <Button className="w-full" variant="default">
              Choose Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}; 
