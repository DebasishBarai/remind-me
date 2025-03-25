'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Megaphone, Users, TrendingUp, BarChart, MessageCircle, ArrowUpRight, Sparkles, Zap, MailOpen } from "lucide-react";
import { PricingCards } from "@/components/PricingCards";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  const marketingStats = [
    { icon: <Users className="h-8 w-8 text-blue-500" />, title: "3 Billion Users", description: "Monthly active users worldwide" },
    { icon: <MailOpen className="h-8 w-8 text-green-500" />, title: "98% Open Rate", description: "Compared to 20-30% for email" },
    { icon: <ArrowUpRight className="h-8 w-8 text-purple-500" />, title: "45-60% CTR", description: "For marketing messages on WhatsApp" },
    { icon: <MessageCircle className="h-8 w-8 text-indigo-500" />, title: "83% Daily Usage", description: "Users open the app every day" },
    { icon: <Check className="h-8 w-8 text-emerald-500" />, title: "66% Conversion", description: "Make purchases after brand communication" },
    { icon: <Zap className="h-8 w-8 text-amber-500" />, title: "30+ Daily Minutes", description: "Average time spent on WhatsApp" },
  ];

  // Auto-rotate through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % marketingStats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [marketingStats.length]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-[15%] w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text and CTA */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                WhatsApp Marketing Platform
              </div>

              <h1 className="md:py-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Boost Your Business with WhatsApp Campaigns
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300">
                Engage customers, promote offers, and drive sales with automated marketing messages.
              </p>

              <div className="flex flex-wrap gap-4">
                {session ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => signIn()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0"
                  >
                    Start Marketing
                  </Button>
                )}
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="border-2 shadow-sm">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Animated Stats - Modern Design */}
              <div className="mt-12 relative">
                <div className="relative h-32 overflow-hidden">
                  {marketingStats.map((stat, index) => (
                    <div
                      key={index}
                      className={`absolute w-full transition-all duration-700 ease-out ${index === activeStatIndex
                        ? "opacity-100 translate-y-0"
                        : index < activeStatIndex
                          ? "opacity-0 -translate-y-full"
                          : "opacity-0 translate-y-full"
                        }`}
                    >
                      <div className="flex items-start">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl mr-5 shadow-md backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-3xl font-bold mb-1">{stat.title}</div>
                          <div className="text-lg text-slate-600 dark:text-slate-400">{stat.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modern indicator pills */}
                <div className="flex space-x-1.5 mt-6">
                  {marketingStats.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStatIndex(index)}
                      className={`transition-all duration-300 ${index === activeStatIndex
                        ? "w-10 h-2 bg-blue-500 rounded-full"
                        : "w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-blue-300 dark:hover:bg-blue-700"
                        }`}
                      aria-label={`View stat ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative h-[520px] hidden md:block">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-amber-500/10 rounded-2xl blur"></div>
              <div className="relative h-full w-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
                <Image
                  src="/remind-me.jpg"
                  alt="Woman using WhatsApp on tablet"
                  fill
                  className="object-cover object-center"
                  priority
                />

                {/* WhatsApp message bubbles */}
                <div className="absolute right-10 top-24 bg-green-100 dark:bg-green-900/90 p-4 rounded-lg rounded-tr-none shadow-lg transform rotate-3 z-10 max-w-[180px] backdrop-blur-sm border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Check out our new promotion! 🎉</p>
                </div>
                <div className="absolute left-10 bottom-36 bg-white dark:bg-slate-700 p-4 rounded-lg rounded-tl-none shadow-lg transform -rotate-2 z-10 max-w-[180px] backdrop-blur-sm border border-slate-200 dark:border-slate-600">
                  <p className="text-sm font-medium dark:text-white">I&apos;m interested! Tell me more about the offer. 👍</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 inline-block">
              Why Choose RemindMe
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful tools to boost your business marketing through WhatsApp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-blue-500/10 p-3 rounded-xl inline-block mb-5">
                <Megaphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Targeted Promotions</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Send personalized offers and discounts directly to your customers&apos; WhatsApp, increasing conversion rates.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-purple-500/10 p-3 rounded-xl inline-block mb-5">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Engagement</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Build stronger relationships with automated yet personalized campaign messages to your customer base.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-amber-500/10 p-3 rounded-xl inline-block mb-5">
                <TrendingUp className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Increased Sales</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Drive more revenue with timely promotional campaigns that reach customers where they&apos;re most active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section with Enhanced Background */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 left-[10%] w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <PricingCards />
        </div>
      </section>
    </div>
  );
}
