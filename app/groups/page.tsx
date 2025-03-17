'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, UserPlus, Users, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Group {
  id: string;
  name: string;
  createdAt: string;
  contacts: Contact[];
}

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export default function GroupsPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [activeTab, setActiveTab] = useState('groups');
  const [groups, setGroups] = useState<Group[]>([]);
  const [userContacts, setUserContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactDialogTab, setContactDialogTab] = useState<'new' | 'existing'>('existing');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGroups();
      fetchContacts();
    }
  }, [status]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
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

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      setIsAddingGroup(true);
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newGroupName }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create group');
      }

      const newGroup = await res.json();
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      toast.success('Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create group');
    } finally {
      setIsAddingGroup(false);
    }
  };

  const handleAddNewContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) {
      toast.error('Please select a group first');
      return;
    }

    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast.error('Name and phone number are required');
      return;
    }

    try {
      setIsAddingContact(true);
      const res = await fetch(`/api/groups/${selectedGroup.id}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add contact');
      }

      const newContactData = await res.json();

      // Update the groups state with the new contact
      setGroups(groups.map(group => {
        if (group.id === selectedGroup.id) {
          return {
            ...group,
            contacts: [...group.contacts, newContactData]
          };
        }
        return group;
      }));

      setNewContact({ name: '', phone: '' });
      setIsContactDialogOpen(false);
      toast.success('Contact added successfully');
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add contact');
    } finally {
      setIsAddingContact(false);
    }
  };

  const handleAddExistingContact = async (contactId: string) => {
    if (!selectedGroup) {
      toast.error('Please select a group first');
      return;
    }

    const selectedContact = userContacts.find(c => c.id === contactId);
    if (!selectedContact) {
      toast.error('Contact not found');
      return;
    }

    // Check if contact is already in the group
    if (selectedGroup.contacts.some(c => c.phone === selectedContact.phone)) {
      toast.error('Contact already exists in this group');
      return;
    }

    try {
      setIsAddingContact(true);
      const res = await fetch(`/api/groups/${selectedGroup.id}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedContact.name,
          phone: selectedContact.phone
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add contact');
      }

      const newContactData = await res.json();

      // Update the groups state with the new contact
      setGroups(groups.map(group => {
        if (group.id === selectedGroup.id) {
          return {
            ...group,
            contacts: [...group.contacts, newContactData]
          };
        }
        return group;
      }));

      setIsContactDialogOpen(false);
      toast.success('Contact added to group successfully');
    } catch (error) {
      console.error('Error adding contact to group:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add contact to group');
    } finally {
      setIsAddingContact(false);
    }
  };

  const handleDeleteContact = async (groupId: string, contactId: string) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete contact');
      }

      // Update the groups state by removing the deleted contact
      setGroups(groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            contacts: group.contacts.filter(contact => contact.id !== contactId)
          };
        }
        return group;
      }));

      toast.success('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete group');
      }

      // Remove the deleted group from state
      setGroups(groups.filter(group => group.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }

      toast.success('Group deleted successfully');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  // Filter out contacts that are already in the selected group
  const availableContacts = userContacts.filter(contact =>
    !selectedGroup?.contacts.some(groupContact =>
      groupContact.phone === contact.phone
    )
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Groups</h1>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="groups">My Groups</TabsTrigger>
          <TabsTrigger value="create">Create Group</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          {groups.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">You don't have any groups yet.</p>
                <Button onClick={() => setActiveTab('create')}>
                  Create Your First Group
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {groups.map(group => (
                <Card key={group.id} className={`${selectedGroup?.id === group.id ? 'border-primary' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{group.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {group.contacts.length} contact{group.contacts.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {group.contacts.length > 0 ? (
                        group.contacts.map(contact => (
                          <div key={contact.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteContact(group.id, contact.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No contacts in this group</p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedGroup(group);
                          setContactDialogTab('existing');
                          setIsContactDialogOpen(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push(`/create?groupId=${group.id}`)}
                      >
                        Create Reminder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
              <CardDescription>
                Create a group to manage multiple contacts for your reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                    required
                  />
                </div>
                <Button type="submit" disabled={isAddingGroup}>
                  {isAddingGroup ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Create Group
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for adding contacts */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contact to {selectedGroup?.name}</DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue={contactDialogTab}
            value={contactDialogTab}
            onValueChange={(value) => setContactDialogTab(value as 'new' | 'existing')}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Existing Contact</TabsTrigger>
              <TabsTrigger value="new">New Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="mt-4">
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
                <Command className="border rounded-md">
                  <CommandInput placeholder="Search contacts..." />
                  <CommandList>
                    <CommandEmpty>No contacts found.</CommandEmpty>
                    <CommandGroup>
                      {availableContacts.map((contact) => (
                        <CommandItem
                          key={contact.id}
                          onSelect={() => handleAddExistingContact(contact.id)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <p>{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddExistingContact(contact.id);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              )}
            </TabsContent>

            <TabsContent value="new" className="mt-4">
              <form onSubmit={handleAddNewContact} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Name</Label>
                  <Input
                    id="contactName"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">WhatsApp Number</Label>
                  <Input
                    id="contactPhone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAddingContact}>
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
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
