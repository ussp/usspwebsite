"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

const ROLES = [
  { value: "developer", label: "Developer" },
  { value: "qa", label: "QA/Tester" },
  { value: "scrum_master", label: "Scrum Master" },
  { value: "product_owner", label: "Product Owner" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "designer", label: "Designer" },
];

interface MemberForm {
  display_name: string;
  role: string;
}

export default function NewTeamPage() {
  const { id: engagementId } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<MemberForm[]>([
    { display_name: "", role: "developer" },
  ]);

  function addMember() {
    setMembers([...members, { display_name: "", role: "developer" }]);
  }

  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index));
  }

  function updateMember(index: number, field: keyof MemberForm, value: string) {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // Create team
      const teamRes = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engagement_id: engagementId,
          name: teamName,
          team_size: members.length,
        }),
      });

      if (!teamRes.ok) return;
      const team = await teamRes.json();

      // Create members
      for (const member of members) {
        if (!member.display_name.trim()) continue;
        await fetch(`/api/teams/${team.id}/members`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(member),
        });
      }

      router.push(`/engagements/${engagementId}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h1 className="text-2xl font-bold mb-6">Add Team</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg border border-light-gray p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Platform Team"
              required
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Team Members</label>
              <button
                type="button"
                onClick={addMember}
                className="text-xs text-primary hover:underline"
              >
                + Add Member
              </button>
            </div>

            {members.map((member, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <input
                  type="text"
                  value={member.display_name}
                  onChange={(e) => updateMember(i, "display_name", e.target.value)}
                  placeholder={`Member ${i + 1} name`}
                  className="flex-1 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select
                  value={member.role}
                  onChange={(e) => updateMember(i, "role", e.target.value)}
                  className="w-40 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    className="text-danger text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Team"}
          </button>
        </form>
      </main>
    </>
  );
}
