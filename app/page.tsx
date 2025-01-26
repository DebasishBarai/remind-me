'use client';

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Bell, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            RemindMe
          </Link>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Link href="/pricing">
              <Button variant="outline">Pricing</Button>
            </Link>
              <Button onClick={() => signIn()}>Login</Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Never Miss Important Dates
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule custom WhatsApp reminders for all your important dates and events
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <Bell className="w-4 h-4" />
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="gap-2">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <Calendar className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-muted-foreground">
              Set up reminders in seconds with our intuitive scheduling interface
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <Clock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Recurring Reminders</h3>
            <p className="text-muted-foreground">
              Schedule daily, weekly, monthly, or yearly recurring reminders
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <Bell className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">WhatsApp Integration</h3>
            <p className="text-muted-foreground">
              Receive reminders directly on WhatsApp - no extra apps needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
