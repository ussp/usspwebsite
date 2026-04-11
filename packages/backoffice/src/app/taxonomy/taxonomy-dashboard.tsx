"use client";

import { useState } from "react";
import type {
  TaxonomyNodeRow,
  UnresolvedSkillRow,
} from "@ussp-platform/core/queries/admin/taxonomy";

const TREES = [
  { id: "technology", label: "Technology" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Education" },
  { id: "domain-knowledge", label: "Domain Knowledge" },
  { id: "soft-skills", label: "Soft Skills" },
];

interface Props {
  customNodes: TaxonomyNodeRow[];
  unresolvedSkills: UnresolvedSkillRow[];
  summary: {
    trees: { tree: string; nodeCount: number }[];
    totalCustom: number;
    totalUnresolved: number;
  };
}

export function TaxonomyDashboard({ customNodes, unresolvedSkills, summary }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTree, setSelectedTree] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-2xl font-bold text-primary">650+</div>
          <div className="text-sm text-gray-500">Base Taxonomy Nodes</div>
          <div className="text-xs text-gray-400 mt-1">Ships with the matching engine</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-2xl font-bold text-emerald-600">{summary.totalCustom}</div>
          <div className="text-sm text-gray-500">Custom Nodes</div>
          <div className="text-xs text-gray-400 mt-1">Added by your team</div>
        </div>
        <div className={`bg-white rounded-lg border p-4 ${summary.totalUnresolved > 0 ? "border-amber-300" : ""}`}>
          <div className={`text-2xl font-bold ${summary.totalUnresolved > 0 ? "text-amber-600" : "text-gray-400"}`}>
            {summary.totalUnresolved}
          </div>
          <div className="text-sm text-gray-500">Unresolved Skills</div>
          <div className="text-xs text-gray-400 mt-1">Found in matching, need taxonomy nodes</div>
        </div>
      </div>

      {/* Unresolved Skills */}
      {unresolvedSkills.length > 0 && (
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-3 border-b bg-amber-50">
            <h3 className="font-semibold text-amber-800">
              Unresolved Skills ({unresolvedSkills.length})
            </h3>
            <p className="text-xs text-amber-600 mt-1">
              These skills were found in positions or resumes but couldn&apos;t be matched in the taxonomy.
              Add them as custom nodes to improve matching quality.
            </p>
          </div>
          <div className="divide-y">
            {unresolvedSkills.map((skill) => (
              <div key={skill.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">&ldquo;{skill.raw_text}&rdquo;</span>
                  <span className="text-xs text-gray-400 ml-2">
                    seen {skill.occurrence_count}x · from {skill.source}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    // Pre-fill would go here
                  }}
                  className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark"
                >
                  + Add to Taxonomy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Nodes */}
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">
            Custom Taxonomy Nodes ({customNodes.length})
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedTree || ""}
              onChange={(e) => setSelectedTree(e.target.value || null)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="">All Trees</option>
              {TREES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
            >
              + Add Node
            </button>
          </div>
        </div>

        {showAddForm && <AddNodeForm onClose={() => setShowAddForm(false)} />}

        {customNodes.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">
            No custom taxonomy nodes yet. Add one when you encounter a skill not in the base taxonomy.
          </div>
        ) : (
          <div className="divide-y">
            {customNodes
              .filter((n) => !selectedTree || n.tree === selectedTree)
              .map((node) => (
                <div key={node.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{node.label}</span>
                      <span className="text-xs text-gray-400 ml-2">{node.tree} / {node.path}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">used {node.usage_count}x</span>
                      {node.promoted && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">promoted</span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{node.source}</span>
                    </div>
                  </div>
                  {(node.aliases?.length > 0) && (
                    <div className="text-xs text-gray-400 mt-1">
                      Aliases: {node.aliases.join(", ")}
                    </div>
                  )}
                  {node.description && (
                    <div className="text-xs text-gray-500 mt-1">{node.description}</div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Tree Overview */}
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold">Base Taxonomy Trees</h3>
        </div>
        <div className="grid grid-cols-5 gap-4 p-4">
          {TREES.map((tree) => {
            const customCount = summary.trees.find((t) => t.tree === tree.id)?.nodeCount || 0;
            return (
              <div key={tree.id} className="text-center p-3 rounded-lg bg-gray-50">
                <div className="text-sm font-medium">{tree.label}</div>
                {customCount > 0 && (
                  <div className="text-xs text-emerald-600 mt-1">+{customCount} custom</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AddNodeForm({ onClose }: { onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const label = form.get("label") as string;
    const tree = form.get("tree") as string;
    const parentPath = form.get("parent_path") as string;
    const aliasesRaw = form.get("aliases") as string;
    const description = form.get("description") as string;

    // Generate node_id and path from label
    const nodeId = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const path = parentPath ? `${parentPath}.${nodeId}` : nodeId;

    const aliases = aliasesRaw
      ? aliasesRaw.split(",").map((a) => a.trim()).filter(Boolean)
      : [];

    const res = await fetch("/api/taxonomy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tree, node_id: nodeId, path, label, parent_path: parentPath || undefined, aliases, description: description || undefined }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create node");
      setSaving(false);
      return;
    }

    // Reload page to show the new node
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 bg-blue-50 border-b space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Skill/Term Name *</label>
          <input name="label" required className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. Power BI" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Tree *</label>
          <select name="tree" required className="w-full border rounded px-2 py-1.5 text-sm">
            {TREES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Parent Path (optional)</label>
          <input name="parent_path" className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. data.analytics" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Aliases (comma-separated)</label>
          <input name="aliases" className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. powerbi, microsoft power bi" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Description (optional)</label>
        <input name="description" className="w-full border rounded px-2 py-1.5 text-sm" placeholder="What is this skill/tool/certification?" />
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50">
          {saving ? "Saving..." : "Add Node"}
        </button>
      </div>
    </form>
  );
}
