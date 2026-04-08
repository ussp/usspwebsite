"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import type { EngagementDetail, AIEngagementContact, ContactCategory, TeamMemberRole } from "@ussp-platform/core";
import { TEAM_MEMBER_ROLE_LABELS, CONTACT_CATEGORY_LABELS } from "@ussp-platform/core";

const EMPTY_CONTACT = { display_name: "", full_name: "", email: "", title: "", organization: "", category: "working_team" as ContactCategory, notes: "" };
const CATEGORIES: { key: ContactCategory; color: string; bg: string }[] = [
  { key: "executive", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  { key: "state", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  { key: "leadership", color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
  { key: "working_team", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
];

export default function TeamDirectoryPage() {
  const { id } = useParams<{ id: string }>();
  const [eng, setEng] = useState<EngagementDetail | null>(null);
  const [contacts, setContacts] = useState<AIEngagementContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_CONTACT);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadContacts = useCallback(() => {
    fetch(`/api/engagements/${id}/contacts`).then((r) => r.json()).then(setContacts);
  }, [id]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/engagements/${id}`).then((r) => r.json()),
      fetch(`/api/engagements/${id}/contacts`).then((r) => r.json()),
    ]).then(([engData, contactData]) => {
      setEng(engData);
      setContacts(contactData);
    }).finally(() => setLoading(false));
  }, [id]);

  const addContact = async () => {
    if (!form.display_name || !form.title) return;
    setSaving(true);
    await fetch(`/api/engagements/${id}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(EMPTY_CONTACT);
    setShowAdd(false);
    setSaving(false);
    loadContacts();
  };

  const removeContact = async (contactId: string) => {
    if (!confirm("Remove this contact?")) return;
    await fetch(`/api/engagements/${id}/contacts?contactId=${contactId}`, { method: "DELETE" });
    loadContacts();
  };

  if (loading) return (<><AdminSidebar /><AdminTopbar /><main className="ml-60 mt-14 p-6"><p className="text-dark/40">Loading...</p></main></>);
  if (!eng) return (<><AdminSidebar /><AdminTopbar /><main className="ml-60 mt-14 p-6"><p className="text-red-600">Not found</p></main></>);

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-1">
          <Link href={`/engagements/${id}`} className="text-sm text-primary hover:underline">&larr; {eng.name}</Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Team Directory & Org Structure</h1>
            <p className="text-sm text-dark/50 mt-1">{eng.client_name} — {eng.name}</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">
            Add Person
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
            <h3 className="font-semibold mb-3">Add to Directory</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-dark/60 block mb-1">Display Name *</label>
                <input type="text" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="w-full border border-light-gray rounded-lg p-2 text-sm" placeholder="e.g. Romi" />
              </div>
              <div>
                <label className="text-xs font-medium text-dark/60 block mb-1">Full Name</label>
                <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full border border-light-gray rounded-lg p-2 text-sm" placeholder="e.g. Emil Romulus Kovacs" />
              </div>
              <div>
                <label className="text-xs font-medium text-dark/60 block mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-light-gray rounded-lg p-2 text-sm" placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-dark/60 block mb-1">Role / Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-light-gray rounded-lg p-2 text-sm" placeholder="e.g. Project Manager" />
              </div>
              <div>
                <label className="text-xs font-medium text-dark/60 block mb-1">Organization</label>
                <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="w-full border border-light-gray rounded-lg p-2 text-sm" placeholder="e.g. Krasan" />
              </div>
              <div>
                <label className="text-xs font-medium text-dark/60 block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ContactCategory })} className="w-full border border-light-gray rounded-lg p-2 text-sm">
                  {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{CONTACT_CATEGORY_LABELS[c.key]}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 block mb-1 mt-3">Notes</label>
              <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border border-light-gray rounded-lg p-2 text-sm" placeholder="e.g. Responsible for JIRA/Confluence access" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={addContact} disabled={saving} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50">{saving ? "Saving..." : "Add"}</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-light-gray text-sm rounded-lg hover:bg-light-gray">Cancel</button>
            </div>
          </div>
        )}

        {/* Org chart by category */}
        {CATEGORIES.map((cat) => {
          const people = contacts.filter((c) => c.category === cat.key);
          if (people.length === 0) return null;
          return (
            <div key={cat.key} className="mb-6">
              <h2 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${cat.color}`}>{CONTACT_CATEGORY_LABELS[cat.key]}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {people.map((person) => (
                  <div key={person.id} className={`rounded-lg border p-4 ${cat.bg} relative group`}>
                    <button onClick={() => removeContact(person.id)} className="absolute top-2 right-2 text-dark/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs" title="Remove">✕</button>
                    <h3 className="font-semibold text-sm">{person.display_name}</h3>
                    {person.full_name && person.full_name !== person.display_name && <p className="text-xs text-dark/40">{person.full_name}</p>}
                    <p className="text-xs text-dark/60 mt-1">{person.title}</p>
                    {person.organization && <p className="text-xs text-dark/40">{person.organization}</p>}
                    {person.email && <a href={`mailto:${person.email}`} className="text-xs text-primary hover:underline mt-1 block">{person.email}</a>}
                    {person.notes && <p className="text-[11px] text-dark/30 mt-2 italic">{person.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {contacts.length === 0 && !showAdd && (
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <p className="text-dark/40 text-sm mb-2">No people in the directory yet.</p>
            <p className="text-dark/30 text-xs">Click &ldquo;Add Person&rdquo; to start building the org chart.</p>
          </div>
        )}

        {/* Enrolled Scrum Teams */}
        {eng.teams.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3 text-dark/50">Enrolled Scrum Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eng.teams.map((team) => (
                <div key={team.id} className="bg-white rounded-lg border border-light-gray p-4">
                  <h3 className="font-semibold text-sm mb-2">{team.name}</h3>
                  {team.members.length > 0 ? (
                    <div className="space-y-1">
                      {team.members.map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-xs">
                          <span>{m.display_name}</span>
                          <span className="text-dark/40">{TEAM_MEMBER_ROLE_LABELS[m.role as TeamMemberRole] || m.role}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-dark/30">No members added yet</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
