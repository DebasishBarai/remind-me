'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Users, UserPlus, Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Group {
  id: string;
  name: string;
  contacts: Contact[];
}

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export default function CreateReminderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupIdParam = searchParams.get('groupId');
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [userContacts, setUserContacts] = useState<Contact[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [reminderType, setReminderType] = useState<'individual' | 'group'>(groupIdParam ? 'group' : 'individual');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    dateTime: '',
    frequency: 'once',
    phone: '',
    groupId: groupIdParam || '',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGroups();
      fetchContacts();
    }
  }, [status]);

  useEffect(() => {
    if (groupIdParam && groups.length > 0) {
      const group = groups.find(g => g.id === groupIdParam);
      if (group) {
        setSelectedGroup(group);
        setReminderType('group');
        setFormData(prev => ({ ...prev, groupId: groupIdParam }));
      }
    }
  }, [groupIdParam, groups]);

  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const res = await fetch('/api/groups');
      if (!res.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await res.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setIsLoadingContacts(true);
      const res = await fetch('/api/contacts');
      if (!res.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await res.json();
      setUserContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = reminderType === 'individual' 
        ? { ...formData, groupId: undefined } 
        : { ...formData, phone: '' };

      console.log("Submitting form data:", payload);

      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create reminder');
      }

      if (data.success) {
        toast.success('Reminder created successfully!');
        router.push('/dashboard');
      } else {
        throw new Error('Failed to create reminder');
      }
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast.error(error instanceof Error ? error.message : 'Failed to create reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setFormData({ ...formData, phone: contact.phone });
    setIsContactDialogOpen(false);
  };

  const filteredContacts = userContacts.filter(contact => {
    return (
      contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(contactSearchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Reminder</CardTitle>
          <CardDescription>
            Set up a reminder for yourself or a group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={reminderType} 
            value={reminderType}
            onValueChange={(value) => setReminderType(value as 'individual' | 'group')}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="group">Group</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter reminder title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter reminder message"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTime">Date & Time</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reminderType === 'individual' ? (
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsContactDialogOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="groupId">Select Group</Label>
                {isLoadingGroups ? (
                  <div className="flex items-center space-x-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading groups...</span>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground mb-2">You don&apos;t have any groups yet.</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push('/groups')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Create a Group
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={formData.groupId}
                    onValueChange={(value) => {
                      const group = groups.find(g => g.id === value);
                      setSelectedGroup(group || null);
                      setFormData({ ...formData, groupId: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.contacts.length} contacts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || (reminderType === 'group' && !formData.groupId)}>
              {isLoading ? "Creating..." : "Create Reminder"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Dialog for selecting contacts */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Contact</DialogTitle>
          </DialogHeader>
          
          {isLoadingContacts ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : userContacts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-2">No contacts found</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/contacts')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Contacts
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={contactSearchTerm}
                  onChange={(e) => setContactSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Command className="border rounded-md">
                <CommandList>
                  <CommandEmpty>No contacts found.</CommandEmpty>
                  <CommandGroup>
                    {filteredContacts.map((contact) => (
                      <CommandItem
                        key={contact.id}
                        onSelect={() => handleSelectContact(contact)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p>{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/contacts')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage Contacts
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsContactDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 