"use client";

import { useState, useEffect } from "react";

interface Requirements {
  required_skills: string[];
  preferred_skills: string[];
  min_experience_years: number | null;
  max_experience_years: number | null;
  education_level: string | null;
  required_certifications: string[];
  location_requirement: string | null;
  work_mode: string | null;
  salary_min: number | null;
  salary_max: number | null;
  industry: string | null;
}

const EMPTY_REQS: Requirements = {
  required_skills: [],
  preferred_skills: [],
  min_experience_years: null,
  max_experience_years: null,
  education_level: null,
  required_certifications: [],
  location_requirement: null,
  work_mode: null,
  salary_min: null,
  salary_max: null,
  industry: null,
};

function TagInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  return (
    <div>
      <label className="block text-xs font-medium text-dark/70 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-1 mb-1">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="hover:text-red-500"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Type and press Enter"
          className="flex-1 px-2 py-1 border border-light-gray rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-2 py-1 text-xs bg-light-gray rounded hover:bg-dark/10 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function PositionRequirementsCard({
  positionId,
}: {
  positionId: string;
}) {
  const [reqs, setReqs] = useState<Requirements>(EMPTY_REQS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/positions/${positionId}/requirements`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.id) {
          setReqs({
            required_skills: data.required_skills || [],
            preferred_skills: data.preferred_skills || [],
            min_experience_years: data.min_experience_years,
            max_experience_years: data.max_experience_years,
            education_level: data.education_level,
            required_certifications: data.required_certifications || [],
            location_requirement: data.location_requirement,
            work_mode: data.work_mode,
            salary_min: data.salary_min,
            salary_max: data.salary_max,
            industry: data.industry,
          });
          setHasData(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [positionId]);

  async function handleSave() {
    setSaving(true);
    setMsg("");
    const res = await fetch(`/api/positions/${positionId}/requirements`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqs),
    });
    if (res.ok) {
      setMsg("Saved");
      setHasData(true);
      setEditing(false);
      setTimeout(() => setMsg(""), 2000);
    } else {
      const data = await res.json();
      setMsg(data.error || "Failed to save");
    }
    setSaving(false);
  }

  const isEmpty =
    !hasData &&
    reqs.required_skills.length === 0 &&
    reqs.preferred_skills.length === 0;

  return (
    <div className="bg-white rounded-lg border border-light-gray p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          Matching Requirements
        </h3>
        <div className="flex items-center gap-2">
          {msg && (
            <span
              className={`text-xs ${msg === "Saved" ? "text-emerald-600" : "text-red-600"}`}
            >
              {msg}
            </span>
          )}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 text-xs rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
            >
              {hasData ? "Edit" : "Add Requirements"}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-xs rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <p className="text-xs text-dark/40">Loading...</p>}

      {!loading && !editing && isEmpty && (
        <p className="text-sm text-dark/40">
          No matching requirements set. Add required skills, experience level, and
          certifications to improve candidate matching accuracy.
        </p>
      )}

      {!loading && !editing && hasData && (
        <div className="space-y-3 text-sm">
          {reqs.required_skills.length > 0 && (
            <div>
              <span className="text-xs font-medium text-dark/50">
                Required Skills
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {reqs.required_skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {reqs.preferred_skills.length > 0 && (
            <div>
              <span className="text-xs font-medium text-dark/50">
                Preferred Skills
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {reqs.preferred_skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {(reqs.min_experience_years != null ||
              reqs.max_experience_years != null) && (
              <div>
                <span className="text-xs font-medium text-dark/50">
                  Experience
                </span>
                <p className="text-xs">
                  {reqs.min_experience_years ?? 0}&ndash;
                  {reqs.max_experience_years ?? "any"} years
                </p>
              </div>
            )}
            {reqs.education_level && (
              <div>
                <span className="text-xs font-medium text-dark/50">
                  Education
                </span>
                <p className="text-xs">{reqs.education_level}</p>
              </div>
            )}
            {reqs.work_mode && (
              <div>
                <span className="text-xs font-medium text-dark/50">
                  Work Mode
                </span>
                <p className="text-xs">{reqs.work_mode}</p>
              </div>
            )}
            {reqs.industry && (
              <div>
                <span className="text-xs font-medium text-dark/50">
                  Industry
                </span>
                <p className="text-xs">{reqs.industry}</p>
              </div>
            )}
            {(reqs.salary_min != null || reqs.salary_max != null) && (
              <div>
                <span className="text-xs font-medium text-dark/50">
                  Salary Range
                </span>
                <p className="text-xs">
                  ${reqs.salary_min?.toLocaleString() ?? "—"} &ndash; $
                  {reqs.salary_max?.toLocaleString() ?? "—"}
                </p>
              </div>
            )}
          </div>
          {reqs.required_certifications.length > 0 && (
            <div>
              <span className="text-xs font-medium text-dark/50">
                Required Certifications
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {reqs.required_certifications.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && editing && (
        <div className="space-y-4">
          <TagInput
            label="Required Skills"
            value={reqs.required_skills}
            onChange={(v) => setReqs({ ...reqs, required_skills: v })}
          />
          <TagInput
            label="Preferred Skills"
            value={reqs.preferred_skills}
            onChange={(v) => setReqs({ ...reqs, preferred_skills: v })}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-dark/70 mb-1">
                Min Experience (years)
              </label>
              <input
                type="number"
                min="0"
                value={reqs.min_experience_years ?? ""}
                onChange={(e) =>
                  setReqs({
                    ...reqs,
                    min_experience_years: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-2 py-1 border border-light-gray rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark/70 mb-1">
                Max Experience (years)
              </label>
              <input
                type="number"
                min="0"
                value={reqs.max_experience_years ?? ""}
                onChange={(e) =>
                  setReqs({
                    ...reqs,
                    max_experience_years: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-2 py-1 border border-light-gray rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-dark/70 mb-1">
                Education Level
              </label>
              <select
                value={reqs.education_level || ""}
                onChange={(e) =>
                  setReqs({
                    ...reqs,
                    education_level: e.target.value || null,
                  })
                }
                className="w-full px-2 py-1 border border-light-gray rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="">-- Any --</option>
                <option value="High School">High School</option>
                <option value="Associate">Associate</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark/70 mb-1">
                Work Mode
              </label>
              <select
                value={reqs.work_mode || ""}
                onChange={(e) =>
                  setReqs({ ...reqs, work_mode: e.target.value || null })
                }
                className="w-full px-2 py-1 border border-light-gray rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="">-- Any --</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-dark/70 mb-1">
                Min Salary ($)
              </label>
              <input
                type="number"
                min="0"
                value={reqs.salary_min ?? ""}
                onChange={(e) =>
                  setReqs({
                    ...reqs,
                    salary_min: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-2 py-1 border border-light-gray rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark/70 mb-1">
                Max Salary ($)
              </label>
              <input
                type="number"
                min="0"
                value={reqs.salary_max ?? ""}
                onChange={(e) =>
                  setReqs({
                    ...reqs,
                    salary_max: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full px-2 py-1 border border-light-gray rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-dark/70 mb-1">
              Industry
            </label>
            <input
              value={reqs.industry || ""}
              onChange={(e) =>
                setReqs({ ...reqs, industry: e.target.value || null })
              }
              placeholder="e.g. Healthcare, Finance, Government"
              className="w-full px-2 py-1 border border-light-gray rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <TagInput
            label="Required Certifications"
            value={reqs.required_certifications}
            onChange={(v) =>
              setReqs({ ...reqs, required_certifications: v })
            }
          />
        </div>
      )}
    </div>
  );
}
