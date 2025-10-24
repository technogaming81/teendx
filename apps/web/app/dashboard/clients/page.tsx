'use client';

import { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const dynamic = 'force-dynamic';

export default function ClientsPage() {
  const clients = useQuery(api.clients.list);
  const createClient = useMutation(api.clients.create);
  const updateClient = useMutation(api.clients.update);
  const deleteClient = useMutation(api.clients.remove);

  const [showForm, setShowForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState<Id<"clients"> | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingClientId) {
        await updateClient({
          id: editingClientId,
          ...formData,
        });
      } else {
        await createClient(formData);
      }

      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
      setEditingClientId(null);
    } catch (error) {
      console.error('Failed to save client:', error);
      alert('Failed to save client');
    }
  };

  const handleEdit = (client: any) => {
    setEditingClientId(client._id);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      notes: client.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: Id<"clients">) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await deleteClient({ id });
    } catch (error) {
      console.error('Failed to delete client:', error);
      alert('Failed to delete client');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (clients === undefined) {
    return <div className="text-center py-10">Loading clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Button onClick={() => {
          setShowForm(!showForm);
          setEditingClientId(null);
          setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
        }}>
          {showForm ? 'Cancel' : 'Add Client'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingClientId ? 'Edit Client' : 'New Client'}</CardTitle>
            <CardDescription>
              {editingClientId ? 'Update client information' : 'Add a new client to your portfolio'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">
                {editingClientId ? 'Update Client' : 'Add Client'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-10 text-center text-muted-foreground">
              No clients yet. Add your first client to get started!
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client._id}>
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
                {client.company && (
                  <CardDescription>{client.company}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {client.email && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email: </span>
                    {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Phone: </span>
                    {client.phone}
                  </div>
                )}
                <div className="text-sm">
                  <span className="text-muted-foreground">LTV: </span>
                  ₹{client.lifetimeValue.toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {client._count.invoices} invoices · {client._count.projects} projects
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(client)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(client._id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
