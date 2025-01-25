"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Birthday Reminder",
      date: new Date(2024, 3, 15),
      message: "Don't forget to wish happy birthday!",
    },
    {
      id: 2,
      title: "Meeting with Client",
      date: new Date(2024, 3, 20),
      message: "Prepare presentation for the meeting",
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Reminders</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter reminder title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input id="message" placeholder="Enter reminder message" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </div>
            <Button className="w-full">Create Reminder</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{reminder.title}</h3>
                <p className="text-muted-foreground">{reminder.message}</p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(reminder.date, "PPP")}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}