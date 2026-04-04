"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

interface Client {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
}

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  active: boolean;
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingContact, setAddingContact] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/clients/${params.id}`).then((r) => r.json()),
      fetch(`/api/clients/${params.id}/contacts`).then((r) => r.json()),
    ])
      .then(([clientData, contactsData]) => {
        setClient(clientData);
        setContacts(contactsData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load client");
        setLoading(false);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      description: form.get("description") || null,
      active: form.get("active") === "on",
    };

    const res = await fetch(`/api/clients/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/clients");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update client");
      setSaving(false);
    }
  }

  async function handleAddContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddingContact(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("contact_name"),
      email: form.get("contact_email") || null,
      phone: form.get("contact_phone") || null,
      title: form.get("contact_title") || null,
    };

    const res = await fetch(`/api/clients/${params.id}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const newContact = await res.json();
      setContacts([...contacts, newContact]);
      setShowContactForm(false);
    }
    setAddingContact(false);
  }

  function startEditing(contact: Contact) {
    setEditingContactId(contact.id);
    setEditForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      title: contact.title,
    });
  }

  async function handleSaveContact(contactId: string) {
    setSavingContact(true);
    const res = await fetch(
      `/api/clients/${params.id}/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email || null,
          phone: editForm.phone || null,
          title: editForm.title || null,
        }),
      }
    );

    if (res.ok) {
      const updated = await res.json();
      setContacts(contacts.map((c) => (c.id === contactId ? updated : c)));
      setEditingContactId(null);
    }
    setSavingContact(false);
  }

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/50">Loading...</p>
        </main>
      </>
    );
  }

  if (!client) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-danger">Client not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">Edit Client</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-light-gray p-6 max-w-2xl space-y-4"
        >
          {error && (
            <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              name="name"
              required
              defaultValue={client.name}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={client.description || ""}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              defaultChecked={client.active}
              className="rounded"
            />
            Active
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Contacts Section */}
        <div className="mt-8 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Contacts</h3>
            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
            >
              + Add Contact
            </button>
          </div>

          {showContactForm && (
            <form
              onSubmit={handleAddContact}
              className="bg-white rounded-lg border border-light-gray p-4 mb-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Name *
                  </label>
                  <input
                    name="contact_name"
                    required
                    placeholder="e.g. Dinkar Karumuri"
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Title
                  </label>
                  <input
                    name="contact_title"
                    placeholder="e.g. Account Manager"
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Email
                  </label>
                  <input
                    name="contact_email"
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Phone
                  </label>
                  <input
                    name="contact_phone"
                    placeholder="+1-555-0123"
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addingContact}
                  className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {addingContact ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-light-gray hover:bg-light-gray"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-lg border border-light-gray overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-light-gray/50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Name</th>
                  <th className="text-left px-4 py-2 font-medium">Title</th>
                  <th className="text-left px-4 py-2 font-medium">Email</th>
                  <th className="text-left px-4 py-2 font-medium">Phone</th>
                  <th className="text-left px-4 py-2 font-medium w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray">
                {contacts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-dark/50"
                    >
                      No contacts yet.
                    </td>
                  </tr>
                )}
                {contacts.map((contact) =>
                  editingContactId === contact.id ? (
                    <tr key={contact.id} className="bg-blue-50/30">
                      <td className="px-4 py-2">
                        <input
                          value={editForm.name || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-light-gray rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={editForm.title || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          placeholder="Title"
                          className="w-full px-2 py-1 border border-light-gray rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={editForm.email || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          type="email"
                          className="w-full px-2 py-1 border border-light-gray rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={editForm.phone || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-light-gray rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSaveContact(contact.id)}
                            disabled={savingContact}
                            className="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary-dark disabled:opacity-50"
                          >
                            {savingContact ? "..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingContactId(null)}
                            className="px-2 py-1 text-xs rounded border border-light-gray hover:bg-light-gray"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={contact.id} className="group">
                      <td className="px-4 py-2 font-medium">{contact.name}</td>
                      <td className="px-4 py-2 text-dark/70">
                        {contact.title || "-"}
                      </td>
                      <td className="px-4 py-2 text-dark/70">
                        {contact.email ? (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-primary hover:underline"
                          >
                            {contact.email}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2 text-dark/70">
                        {contact.phone || "-"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => startEditing(contact)}
                          className="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
