'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Megaphone, Users, TrendingUp } from "lucide-react";
import { PricingCards } from "@/components/PricingCards";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold">
              Boost Your Business with Scheduled WhatsApp Campaigns
            </h1>
            <p className="text-xl text-muted-foreground">
              Engage customers, promote offers, and drive sales with automated WhatsApp marketing campaigns.
            </p>
            <div className="flex justify-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <Button size="lg" onClick={() => signIn()}>Start Marketing</Button>
              )}
              <Link href="/pricing">
                <Button variant="outline" size="lg">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose PromoWhatsApp?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Megaphone className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Targeted Promotions</h3>
              <p className="text-muted-foreground">
                Send personalized offers and discounts directly to your customers' WhatsApp, increasing conversion rates.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Engagement</h3>
              <p className="text-muted-foreground">
                Build stronger relationships with automated yet personalized campaign messages to your customer base.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Increased Sales</h3>
              <p className="text-muted-foreground">
                Drive more revenue with timely promotional campaigns that reach customers where they're most active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20">
        <PricingCards />
      </section>
    </div>
  );
}
