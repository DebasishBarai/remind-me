'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Users, UserPlus, Search, ChevronDown, Check } from 'lucide-react';

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

  const availableContacts = userContacts
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | undefined | null>(null);
  const [temporarilySelectedContact, setTemporarilySelectedContact] = useState<Contact | undefined | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Add click outside listener to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    dateTime: '',
    frequency: 'once',
    contactId: '',
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

  const handleAddExistingContact = async (contactId: string) => {
    try {
      setIsAddingContact(true);

      const contact = userContacts.find(c => c.id === contactId);


      if (!contact) {
        toast.error('Contact not found');
        return;
      }

      setSelectedContact(contact);
      setTemporarilySelectedContact(null);
      setIsContactDialogOpen(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add contact');
    } finally {
      setIsAddingContact(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (reminderType === 'individual' && !selectedContact) {
        toast.error('Please select a contact');
        return;
      }

      const payload = reminderType === 'individual'
        ? { ...formData, contactId: selectedContact?.id, groupId: undefined }
        : { ...formData, contactId: '' };

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
                <Label htmlFor="phone">WhatsApp Contact</Label>
                <div className="flex gap-2">
                  {selectedContact ? (
                    <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      <span className="font-medium">{selectedContact.name}</span>
                      <span className="ml-1 text-muted-foreground">({selectedContact.phone})</span>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      Select Contact
                    </div>
                  )}
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
              {isLoadingContacts ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : availableContacts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-2">No available contacts</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/contacts')}
                  >
                    Manage Contacts
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-select">Select Contact</Label>
                      <div className="relative" ref={dropdownRef}>
                        <div
                          className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text"
                          onClick={() => {
                            if (searchInputRef.current) {
                              searchInputRef.current.focus();
                            }
                            setIsSelectOpen(true);
                          }}
                        >
                          <Search className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                          {temporarilySelectedContact && !isFocused && !contactSearchTerm ? (
                            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                              <span className="font-medium">{temporarilySelectedContact.name}</span>
                              <span className="ml-1 text-muted-foreground">({temporarilySelectedContact.phone})</span>
                            </div>
                          ) : (
                            <Input
                              ref={searchInputRef}
                              id="contact-search"
                              placeholder="Type to search contacts..."
                              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              value={contactSearchTerm}
                              onChange={(e) => {
                                setContactSearchTerm(e.target.value);
                                if (e.target.value) {
                                  setIsSelectOpen(true);
                                }
                              }}
                              onFocus={() => {
                                setIsSelectOpen(true);
                                setIsFocused(true);
                              }}
                              onBlur={() => {
                                setIsFocused(false);
                              }}
                            />
                          )}
                          <ChevronDown
                            className={`ml-auto h-4 w-4 opacity-50 flex-shrink-0 transition-transform duration-200 ${isSelectOpen ? 'transform rotate-180' : ''}`}
                          />
                        </div>

                        {isSelectOpen && (
                          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                            <div className="p-1">
                              {filteredContacts.length === 0 ? (
                                <div className="py-6 text-center text-sm">
                                  No contacts found
                                </div>
                              ) : (
                                filteredContacts.map((contact) => (
                                  <div
                                    key={contact.id}
                                    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${selectedContactId === contact.id ? 'bg-accent text-accent-foreground' : ''}`}
                                    onClick={() => {
                                      setTemporarilySelectedContact(contact)
                                      setContactSearchTerm('');
                                      setIsSelectOpen(false);
                                      if (searchInputRef.current) {
                                        searchInputRef.current.blur();
                                      }
                                    }}
                                  >
                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                      {temporarilySelectedContact?.id === contact.id && (
                                        <Check className="h-4 w-4" />
                                      )}
                                    </span>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{contact.name}</span>
                                      <span className="text-sm text-muted-foreground">{contact.phone}</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsContactDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          if (temporarilySelectedContact) {
                            handleAddExistingContact(temporarilySelectedContact.id);
                            setIsSelectOpen(false);
                          }
                        }}
                        disabled={!temporarilySelectedContact || isAddingContact}
                      >
                        {isAddingContact ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Contact'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
