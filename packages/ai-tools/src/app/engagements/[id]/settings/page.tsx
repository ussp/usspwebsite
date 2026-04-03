"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    boardName?: string;
    projectName?: string;
    sprintCount?: number;
  };
}

interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  boardId: string;
}

const EMPTY_CONFIG: JiraConfig = {
  baseUrl: "",
  email: "",
  apiToken: "",
  projectKey: "",
  boardId: "",
};

export default function EngagementSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [engagementName, setEngagementName] = useState("");
  const [integrationType, setIntegrationType] = useState<string>("manual");
  const [config, setConfig] = useState<JiraConfig>(EMPTY_CONFIG);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadEngagement = useCallback(async () => {
    try {
      const res = await fetch(`/api/engagements/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setEngagementName(data.name || "");
      setIntegrationType(data.integration_type || "manual");
      if (data.integration_config) {
        setConfig({
          baseUrl: data.integration_config.baseUrl || "",
          email: data.integration_config.email || "",
          apiToken: data.integration_config.apiToken || "",
          projectKey: data.integration_config.projectKey || "",
          boardId: data.integration_config.boardId || "",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEngagement();
  }, [loadEngagement]);

  async function handleTestConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/integrations/jira/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: config.baseUrl,
          email: config.email,
          apiToken: config.apiToken,
          projectKey: config.projectKey,
          boardId: config.boardId,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ success: false, message: "Network error — could not reach the server." });
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/engagements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integration_type: integrationType,
          integration_config: integrationType === "jira" ? config : null,
        }),
      });
      if (res.ok) {
        setSaveMessage({ type: "success", text: "Configuration saved successfully." });
      } else {
        const err = await res.json();
        setSaveMessage({ type: "error", text: err.error || "Failed to save." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/40">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-dark/40 mb-4">
          <Link href="/engagements" className="hover:text-primary transition-colors">
            Engagements
          </Link>
          <span>/</span>
          <Link href={`/engagements/${id}`} className="hover:text-primary transition-colors">
            {engagementName || "Detail"}
          </Link>
          <span>/</span>
          <span className="text-dark/70">Integration Settings</span>
        </div>

        <h1 className="text-2xl font-bold font-[family-name:var(--font-alata)] mb-2">
          Integration Settings
        </h1>
        <p className="text-sm text-dark/50 font-[family-name:var(--font-montserrat)] mb-6">
          Configure the data source for this engagement. Connect Jira Cloud to automatically
          pull sprint data and compute metrics.
        </p>

        {/* Integration type selector */}
        <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
          <label className="block text-sm font-semibold font-[family-name:var(--font-alata)] mb-2">
            Data Source
          </label>
          <select
            value={integrationType}
            onChange={(e) => {
              setIntegrationType(e.target.value);
              setTestResult(null);
              setSaveMessage(null);
            }}
            className="w-full max-w-xs px-3 py-2 border border-light-gray rounded-lg text-sm font-[family-name:var(--font-montserrat)] focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="manual">Manual Entry</option>
            <option value="jira">Jira Cloud</option>
            <option value="azure_devops">Azure DevOps</option>
            <option value="github">GitHub</option>
            <option value="gitlab">GitLab</option>
            <option value="linear">Linear</option>
          </select>
          <p className="text-[11px] text-dark/40 mt-1 font-[family-name:var(--font-montserrat)]">
            Only Jira Cloud integration is fully supported. Other integrations are coming soon.
          </p>
        </div>

        {/* Jira configuration form */}
        {integrationType === "jira" && (
          <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-alata)] mb-4">
              Jira Cloud Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-[family-name:var(--font-montserrat)] mb-1">
                  Jira Cloud URL
                </label>
                <input
                  type="url"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  placeholder="https://yourorg.atlassian.net"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm font-[family-name:var(--font-montserrat)] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-dark/40 mt-1">
                  Your Atlassian Cloud instance URL. Do not include trailing slashes.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium font-[family-name:var(--font-montserrat)] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm font-[family-name:var(--font-montserrat)] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-dark/40 mt-1">
                  The email address associated with your Jira API token.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium font-[family-name:var(--font-montserrat)] mb-1">
                  Project Key
                </label>
                <input
                  type="text"
                  value={config.projectKey}
                  onChange={(e) => setConfig({ ...config, projectKey: e.target.value.toUpperCase() })}
                  placeholder="PROJ"
                  className="w-full max-w-xs px-3 py-2 border border-light-gray rounded-lg text-sm font-[family-name:var(--font-montserrat)] uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-dark/40 mt-1">
                  The Jira project key (e.g. PROJ, ACME, DEV).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium font-[family-name:var(--font-montserrat)] mb-1">
                  Board ID
                </label>
                <input
                  type="text"
                  value={config.boardId}
                  onChange={(e) => setConfig({ ...config, boardId: e.target.value })}
                  placeholder="123"
                  className="w-full max-w-xs px-3 py-2 border border-light-gray rounded-lg text-sm font-[family-name:var(--font-montserrat)] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-dark/40 mt-1">
                  The Scrum board ID. Find it in the board URL: /board/123.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium font-[family-name:var(--font-montserrat)] mb-1">
                  API Token
                </label>
                <input
                  type="password"
                  value={config.apiToken}
                  onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                  placeholder="Your Jira API token"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm font-[family-name:var(--font-montserrat)] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-dark/40 mt-1">
                  Generate at{" "}
                  <a
                    href="https://id.atlassian.com/manage-profile/security/api-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    id.atlassian.com/manage-profile/security/api-tokens
                  </a>
                  . Stored in the engagement&apos;s integration_config JSONB field.
                </p>
              </div>
            </div>

            {/* Test Connection */}
            <div className="mt-6 pt-4 border-t border-light-gray">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !config.baseUrl || !config.apiToken || !config.boardId}
                className="px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {testing ? "Testing..." : "Test Connection"}
              </button>

              {testResult && (
                <div
                  className={`mt-3 rounded-lg border p-4 text-sm font-[family-name:var(--font-montserrat)] ${
                    testResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <p className="font-medium">
                    {testResult.success ? "Connection successful" : "Connection failed"}
                  </p>
                  <p className="mt-1 opacity-80">{testResult.message}</p>
                  {testResult.details && (
                    <div className="mt-2 text-xs opacity-60">
                      {testResult.details.boardName && (
                        <span className="mr-4">Board: {testResult.details.boardName}</span>
                      )}
                      {testResult.details.sprintCount !== undefined && (
                        <span>Sprints: {testResult.details.sprintCount}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Non-Jira notice */}
        {integrationType !== "manual" && integrationType !== "jira" && (
          <div className="bg-light-gray rounded-lg border border-light-gray p-6 mb-6">
            <p className="text-sm text-dark/50 font-[family-name:var(--font-montserrat)]">
              <span className="font-semibold text-dark/70">{integrationType}</span> integration
              is not yet available. The integration type will be saved, but you will need to enter
              metrics manually until this connector is built. Switch to &quot;Jira Cloud&quot; or
              &quot;Manual Entry&quot; for now.
            </p>
          </div>
        )}

        {/* Save & status messages */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white text-sm rounded-lg font-[family-name:var(--font-alata)] hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/engagements/${id}`)}
            className="px-4 py-2.5 text-sm text-dark/50 hover:text-dark transition-colors font-[family-name:var(--font-montserrat)]"
          >
            Cancel
          </button>
        </div>

        {saveMessage && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm font-[family-name:var(--font-montserrat)] ${
              saveMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {saveMessage.text}
          </div>
        )}
      </main>
    </>
  );
}
