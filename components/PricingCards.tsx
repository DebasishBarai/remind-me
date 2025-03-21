import Link from "next/link";
import { Check, Star, Zap, BarChart, Users, MessageSquare, FileSpreadsheet, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingCards() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose the perfect plan for your business marketing needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <div className="border rounded-xl p-8 bg-card flex flex-col hover:shadow-lg transition-shadow duration-300 relative group">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div> */}

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Basic Plan</h3>
            <div className="bg-primary/10 text-primary rounded-full text-sm font-medium py-1 px-3">
              For Growing Businesses
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline">
              <span className="text-5xl font-bold">$99</span>
              <span className="text-xl text-muted-foreground font-normal ml-2">/month</span>
            </div>
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

          <Link href="/payment?plan=basic" className="mt-auto cursor-pointer">
            <Button className="w-full py-6 text-lg cursor-pointer">Choose Basic</Button>
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="border-2 border-primary rounded-xl p-8 bg-card flex flex-col relative group hover:shadow-xl transition-shadow duration-300">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div> */}

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
              <span className="text-5xl font-bold">$199</span>
              <span className="text-xl text-muted-foreground font-normal ml-2">/month</span>
            </div>
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

          <Link href="/payment?plan=premium" className="mt-auto cursor-pointer">
            <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 cursor-pointer">
              Choose Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
