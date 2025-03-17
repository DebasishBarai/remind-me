'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Bell, Calendar, Phone } from "lucide-react";
import { PricingCards } from "@/components/PricingCards";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold">
              Never Miss Important Reminders with WhatsApp
            </h1>
            <p className="text-xl text-muted-foreground">
              Set up automated WhatsApp reminders for important events, tasks, and meetings.
              Stay organized and never forget what matters most.
            </p>
            <div className="flex justify-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg">Get Started</Button>
                </Link>
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
            Why Choose RemindMe?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Bell className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Notifications</h3>
              <p className="text-muted-foreground">
                Receive reminders directly on WhatsApp, ensuring you never miss important updates.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-muted-foreground">
                Set one-time or recurring reminders with custom frequencies to match your needs.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Phone className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
              <p className="text-muted-foreground">
                Simple integration with WhatsApp - no additional apps or installations required.
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
