'use client'

import Link from "next/link";
import { Check, Star, Zap, BarChart, Users, MessageSquare, FileSpreadsheet, PhoneCall, CalendarDays, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  // Calculate yearly prices (33% discount)
  const basicMonthly = 99;
  const premiumMonthly = 199;
  const basicYearly = Math.round(basicMonthly * 12 * 0.67); // 33% off
  const premiumYearly = Math.round(premiumMonthly * 12 * 0.67); // 33% off
  
  // Calculate monthly equivalent for yearly plans
  const basicMonthlyEquivalent = Math.round(basicYearly / 12);
  const premiumMonthlyEquivalent = Math.round(premiumYearly / 12);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Choose the perfect plan for your business marketing needs
        </p>
        
        {/* Billing toggle */}
        <div className="inline-flex items-center bg-muted p-1 rounded-lg mb-8">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "monthly" 
                ? "bg-card shadow-sm" 
                : "text-muted-foreground hover:bg-muted-foreground/10"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
              billingCycle === "yearly" 
                ? "bg-card shadow-sm" 
                : "text-muted-foreground hover:bg-muted-foreground/10"
            }`}
          >
            Yearly
            {billingCycle === "yearly" && (
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                Save 33%
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <div className="border rounded-xl p-8 bg-card flex flex-col hover:shadow-lg transition-shadow duration-300 relative group">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div> */}
          {billingCycle === "yearly" && (
            <div className="absolute -top-3 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
              <Gift className="h-3 w-3 mr-1" /> Save 33%
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Basic Plan</h3>
            <div className="bg-primary/10 text-primary rounded-full text-sm font-medium py-1 px-3">
              For Growing Businesses
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline">
              <span className="text-5xl font-bold">
                ${billingCycle === "monthly" ? basicMonthly : basicYearly}
              </span>
              <span className="text-xl text-muted-foreground font-normal ml-2">
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-green-600 font-medium mt-2 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                Just ${basicMonthlyEquivalent}/mo when billed annually
              </p>
            )}
            <p className="text-muted-foreground mt-3">Ideal for medium-sized businesses, e-commerce stores, and service agencies.</p>
          </div>

          <div className="bg-muted/50 h-px w-full mb-8"></div>

          <ul className="space-y-4 text-left mb-10 flex-grow">
            <li className="flex items-start">
              <MessageSquare className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Send up to 1000 messages/month</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Advanced scheduling & recurring messages</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Message templates & personalization</span>
            </li>
            {/* <li className="flex items-start"> */}
            {/*   <BarChart className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" /> */}
            {/*   <span>Basic analytics (delivery reports, open rates)</span> */}
            {/* </li> */}
            <li className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Email support</span>
            </li>
          </ul>

          <Link href={`/payment?plan=basic&billing=${billingCycle}`} className="mt-auto cursor-pointer">
            <Button className="w-full py-6 text-lg cursor-pointer">
              Choose Basic
            </Button>
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="border-2 border-primary rounded-xl p-8 bg-card flex flex-col relative group hover:shadow-xl transition-shadow duration-300">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div> */}
          {billingCycle === "yearly" && (
            <div className="absolute -top-3 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
              <Gift className="h-3 w-3 mr-1" /> Save 33%
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Premium Plan</h3>
            <div className="bg-primary/10 text-primary rounded-full text-sm font-medium py-1 px-3">
              For Large-Scale Enterprises
            </div>
          </div>

          <div className="flex items-center justify-center -mt-2 mb-6">
            <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-md flex items-center">
              <Star className="h-4 w-4 mr-1.5" /> Most Popular
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline">
              <span className="text-5xl font-bold">
                ${billingCycle === "monthly" ? premiumMonthly : premiumYearly}
              </span>
              <span className="text-xl text-muted-foreground font-normal ml-2">
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-green-600 font-medium mt-2 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                Just ${premiumMonthlyEquivalent}/mo when billed annually
              </p>
            )}
            <p className="text-muted-foreground mt-3">Ideal for large enterprises, call centers, and marketing agencies.</p>
          </div>

          <div className="bg-muted/50 h-px w-full mb-8"></div>

          <ul className="space-y-4 text-left mb-10 flex-grow">
            <li className="flex items-start">
              <Zap className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="font-medium">Send 10000 messages/month</span>
            </li>
            <li className="flex items-start">
              <FileSpreadsheet className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Bulk import of customer lists</span>
            </li>
            <li className="flex items-start">
              <Users className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Link your WhatsApp Business number to send messages</span>
            </li>
            {/* <li className="flex items-start"> */}
            {/*   <BarChart className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" /> */}
            {/*   <span>Advanced analytics and reporting</span> */}
            {/* </li> */}
            <li className="flex items-start">
              <PhoneCall className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Priority support</span>
            </li>
          </ul>

          <Link href={`/payment?plan=premium&billing=${billingCycle}`} className="mt-auto cursor-pointer">
            <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 cursor-pointer">
              Choose Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
