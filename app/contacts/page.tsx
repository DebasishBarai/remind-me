'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Search, Edit, UserPlus, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes, type CountryCode } from '@/lib/country-codes';

interface Contact {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export default function ContactsPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newContact, setNewContact] = useState({ name: '', countryCode: '+1', phoneNumber: '' });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingContactForm, setEditingContactForm] = useState({ name: '', countryCode: '+1', phoneNumber: '' });
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchContacts();
    }
  }, [status]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/contacts');
      if (!res.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newContact.name.trim() || !newContact.phoneNumber.trim()) {
      toast.error('Name and phone number are required');
      return;
    }

    // Combine country code and phone number
    const fullPhoneNumber = `${newContact.countryCode}${newContact.phoneNumber.startsWith('0') ? newContact.phoneNumber.substring(1) : newContact.phoneNumber}`;

    try {
      setIsAddingContact(true);
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newContact.name,
          phone: fullPhoneNumber,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add contact');
      }

      const newContactData = await res.json();
      setContacts([...contacts, newContactData]);
      setNewContact({ name: '', countryCode: '+1', phoneNumber: '' });
      setIsContactDialogOpen(false);
      toast.success('Contact added successfully');
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add contact');
    } finally {
      setIsAddingContact(false);
    }
  };

  const handleStartEditing = (contact: Contact) => {
    // More robust parsing of the phone number to extract country code
    let countryCode = '+1'; // Default
    let phoneNumber = contact.phone;
    
    // Find the longest matching country code
    const matchingCode = countryCodes
      .map(country => country.dial_code)
      .sort((a, b) => b.length - a.length) // Sort by length descending to match longest codes first
      .find(code => contact.phone.startsWith(code));
    
    if (matchingCode) {
      countryCode = matchingCode;
      phoneNumber = contact.phone.substring(matchingCode.length);
    }
    
    setEditingContact(contact);
    setEditingContactForm({
      name: contact.name,
      countryCode,
      phoneNumber,
    });
    setIsContactDialogOpen(true);
  };

  const handleEditContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingContact) return;

    if (!editingContactForm.name.trim() || !editingContactForm.phoneNumber.trim()) {
      toast.error('Name and phone number are required');
      return;
    }

    // Combine country code and phone number
    const fullPhoneNumber = `${editingContactForm.countryCode}${editingContactForm.phoneNumber.startsWith('0') ? editingContactForm.phoneNumber.substring(1) : editingContactForm.phoneNumber}`;

    try {
      setIsEditingContact(true);
      const res = await fetch(`/api/contacts/${editingContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingContactForm.name,
          phone: fullPhoneNumber,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update contact');
      }

      const updatedContact = await res.json();
      setContacts(contacts.map(contact =>
        contact.id === updatedContact.id ? updatedContact : contact
      ));
      setEditingContact(null);
      setIsContactDialogOpen(false);
      toast.success('Contact updated successfully');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update contact');
    } finally {
      setIsEditingContact(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete contact');
      }

      setContacts(contacts.filter(contact => contact.id !== contactId));
      toast.success('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    return (
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Contacts</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => {
          setNewContact({ name: '', countryCode: '+1', phoneNumber: '' });
          setEditingContact(null);
          setIsContactDialogOpen(true);
        }}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">You don&apos;t have any contacts yet.</p>
            <Button onClick={() => {
              setNewContact({ name: '', countryCode: '+1', phoneNumber: '' });
              setEditingContact(null);
              setIsContactDialogOpen(true);
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Contacts</CardTitle>
            <CardDescription>
              Manage your contacts for reminders and groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                        No contacts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStartEditing(contact)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this contact? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteContact(contact.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog for adding/editing contacts */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={editingContact ? handleEditContact : handleAddContact} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Name</Label>
              <Input
                id="contactName"
                value={editingContact ? editingContactForm.name : newContact.name}
                onChange={(e) => {
                  if (editingContact) {
                    setEditingContactForm({ ...editingContactForm, name: e.target.value });
                  } else {
                    setNewContact({ ...newContact, name: e.target.value });
                  }
                }}
                placeholder="Enter contact name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">WhatsApp Number</Label>
              <div className="flex gap-2">
                <Select
                  value={editingContact ? editingContactForm.countryCode : newContact.countryCode}
                  onValueChange={(value) => {
                    if (editingContact) {
                      setEditingContactForm({ ...editingContactForm, countryCode: value });
                    } else {
                      setNewContact({ ...newContact, countryCode: value });
                    }
                  }}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.dial_code}>
                        <span className="flex items-center">
                          {country.dial_code} ({country.code})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="contactPhone"
                  value={editingContact ? editingContactForm.phoneNumber : newContact.phoneNumber}
                  onChange={(e) => {
                    if (editingContact) {
                      setEditingContactForm({ ...editingContactForm, phoneNumber: e.target.value });
                    } else {
                      setNewContact({ ...newContact, phoneNumber: e.target.value });
                    }
                  }}
                  placeholder="Phone number without country code"
                  className="flex-1"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Example: Select +1, then enter 2025550123
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingContact || isEditingContact}>
                {isAddingContact || isEditingContact ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingContact ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingContact ? 'Update Contact' : 'Add Contact'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
