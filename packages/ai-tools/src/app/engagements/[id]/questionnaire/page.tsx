"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import type { EngagementDetail } from "@ussp-platform/core";

export default function QuestionnairePage() {
  const { id } = useParams<{ id: string }>();
  const [eng, setEng] = useState<EngagementDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/engagements/${id}`)
      .then((r) => r.json())
      .then(setEng)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (<><AdminSidebar /><AdminTopbar /><main className="ml-60 mt-14 p-6"><p className="text-dark/40">Loading...</p></main></>);
  if (!eng) return (<><AdminSidebar /><AdminTopbar /><main className="ml-60 mt-14 p-6"><p className="text-red-600">Engagement not found</p></main></>);

  const client = eng.client_name || "Client";

  const sections = [
    {
      num: 1, title: "Defining Success", context: "",
      questions: [
        { id: "1.1", q: "When you picture the AI pilot being a success 6 months from now, what does that look like? What would you point to as evidence?", type: "text" },
        { id: "1.2", q: "Beyond a productivity target, are there other outcomes that would make this a win?", type: "text" },
        { id: "1.3", q: "Who else needs to see the results? (Governor's office, agency leadership?) What would convince them?", type: "text" },
        { id: "1.4", q: "If you had to rank these three, what order?", type: "radio", options: ["Teams deliver more work per sprint (velocity/throughput)", "The quality of what's delivered improves (fewer defects, better docs)", "Teams are happier and more efficient (satisfaction/efficiency)"] },
      ],
    },
    {
      num: 2, title: "Story & Requirements Quality", context: "Story quality, BA productivity, and review cycle time are common areas where AI helps.",
      questions: [
        { id: "2.1", q: "How satisfied are you with the quality of user stories today? (1-5)", type: "text", hint: "What's the biggest issue? (unclear requirements, missing AC, too vague?)" },
        { id: "2.2", q: "How long does it typically take for a story to go from first draft to approved/ready-for-dev?", type: "text", hint: "Is that acceptable, or is it a bottleneck?" },
        { id: "2.3", q: "What percentage of stories get sent back for rework after initial review?", type: "text" },
        { id: "2.4", q: "Would you value a metric that measures story quality against a checklist?", type: "radio", options: ["Yes, very important", "Nice to have", "Not a priority"] },
        { id: "2.5", q: "How important is planning accuracy — are stories consistently sized correctly?", type: "radio", options: ["Critical — we often miss commitments", "Moderate — some variance but manageable", "Not a concern"] },
      ],
    },
    {
      num: 3, title: "Testing Quality", context: "",
      questions: [
        { id: "3.1", q: "How satisfied are you with test coverage today? (1-5)", type: "text" },
        { id: "3.2", q: "How long does it typically take to create test scripts for a 5-point story?", type: "text" },
        { id: "3.3", q: "What's your first-pass yield — % of stories passing QA on first attempt?", type: "text" },
        { id: "3.4", q: "Do you track defect density (bugs per story point) or bug escape rate?", type: "text" },
        { id: "3.5", q: "Which testing metric would be most valuable to improve?", type: "check", options: ["Speed of test creation", "Test coverage (% of AC with tests)", "Test script quality (thoroughness)", "First-pass yield (fewer defects)", "All of the above"] },
      ],
    },
    {
      num: 4, title: "Documentation", context: "",
      questions: [
        { id: "4.1", q: "How important is documentation in your delivery assessment?", type: "radio", options: ["Critical — compliance/audit requires it", "Important — teams reference it regularly", "Secondary — working software matters more"] },
        { id: "4.2", q: "What percentage of completed features have up-to-date documentation?", type: "text" },
        { id: "4.3", q: "Would measuring documentation coverage be valuable?", type: "text" },
      ],
    },
    {
      num: 5, title: "Team Communication & Alignment", context: "Architect-to-dev communication is often an area with room for improvement.",
      questions: [
        { id: "5.1", q: "How well do architects communicate technical direction to dev teams? (1-5)", type: "text" },
        { id: "5.2", q: "How often do developers discover requirements were misunderstood after starting?", type: "text" },
        { id: "5.3", q: "Would you value a metric that captures team alignment?", type: "text" },
      ],
    },
    {
      num: 6, title: "What's Already Measured", context: "",
      questions: [
        { id: "6.1", q: `What metrics does ${client} already track today?`, type: "check", options: ["Sprint velocity", "Sprint burndown", "Cycle time", "Throughput", "Bug counts", "Test pass rates"] },
        { id: "6.2", q: "Where is this data? (JIRA reports, spreadsheets, PI reviews?)", type: "text" },
        { id: "6.3", q: "Are there metrics that leadership reviews regularly?", type: "text" },
      ],
    },
    {
      num: 7, title: "Measurement Approach", context: "",
      questions: [
        { id: "7.1", q: "For the pilot comparison, which approach do you prefer?", type: "radio", options: ["Compare same teams before vs after", "Compare AI pilot teams vs control teams", "Both"] },
        { id: "7.2", q: "How often would you like to see progress reports?", type: "radio", options: ["Weekly", "Per sprint (every 2 weeks)", "Monthly", "At PI boundaries only"] },
        { id: "7.3", q: "What format works best?", type: "radio", options: ["Dashboard I can check anytime", "Periodic report / deck", "Both"] },
      ],
    },
    {
      num: 8, title: "Constraints & Guardrails", context: "",
      questions: [
        { id: "8.1", q: "Beyond 'no autonomous code generation' — any other specific AI restrictions?", type: "text" },
        { id: "8.2", q: "Can we access project management data programmatically (API)?", type: "text" },
        { id: "8.3", q: "Data sensitivity concerns with running metrics through our measurement tool?", type: "text" },
      ],
    },
    {
      num: 9, title: "DoIT AI Policy Compliance", context: "CRITICAL — The DoIT policy has a 30-day advance notice requirement that could gate the pilot start date.",
      questions: [
        { id: "9.1", q: `Has ${client} produced an AI System Assessment Report for any AI tools?`, type: "text", hint: "If yes: can we get a copy? If no: do we need to produce one? (§5f)" },
        { id: "9.2", q: "Has the 30-day advance notice been submitted to DoIT?", type: "text", hint: "If not, this is a potential 30-day gate before pilot launch." },
        { id: "9.3", q: `Does ${client} consider source code "State data for AI purposes"? (§5e)`, type: "text" },
        { id: "9.4", q: `Has ${client} designated an AI Policy employee? (§2)`, type: "text" },
        { id: "9.5", q: "Bottom line: What do we need to deliver before the pilot can start?", type: "check", options: ["Assessment report", "DoIT notification", "Agency Head written consent", "Training certification", "Already handled — we can proceed"] },
      ],
    },
  ];

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-1">
          <Link href={`/engagements/${id}`} className="text-sm text-primary hover:underline">&larr; {eng.name}</Link>
        </div>
        <h1 className="text-2xl font-bold mb-1">Executive Discovery Questionnaire</h1>
        <p className="text-sm text-dark/50 mb-6">
          {client} — Identify which quality and productivity dimensions matter most. Answers determine which metrics we track during the AI pilot.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-900 italic">
          &ldquo;Before we finalize the measurement plan, we want to make sure we&apos;re measuring what matters most to you and {client}. We have a research-backed framework with multiple dimensions, but we want to focus on the dimensions that prove value to your stakeholders.&rdquo;
        </div>

        {sections.map((section) => (
          <div key={section.num} className="bg-white rounded-lg border border-light-gray p-5 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{section.num}</span>
              <h2 className="text-lg font-semibold">{section.title}</h2>
            </div>
            {section.context && <p className="text-xs text-dark/40 italic ml-10 mb-3">{section.context}</p>}
            <div className="ml-10 space-y-4">
              {section.questions.map((q) => (
                <div key={q.id}>
                  <label className="text-sm font-medium text-dark block mb-1">
                    <span className="text-dark/40 mr-1">{q.id}</span> {q.q}
                  </label>
                  {q.hint && <p className="text-xs text-dark/40 mb-1">{q.hint}</p>}
                  {q.type === "text" && (
                    <textarea
                      className="w-full border border-light-gray rounded-lg p-2.5 text-sm min-h-[50px] focus:outline-none focus:border-primary"
                      placeholder="Notes..."
                    />
                  )}
                  {q.type === "radio" && q.options && (
                    <div className="space-y-1 mt-1">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer hover:bg-light-gray/50 p-1.5 rounded">
                          <input type="radio" name={q.id} className="accent-primary" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === "check" && q.options && (
                    <div className="space-y-1 mt-1">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer hover:bg-light-gray/50 p-1.5 rounded">
                          <input type="checkbox" className="accent-primary" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Metric Selection Grid */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h2 className="text-lg font-semibold mb-3">Post-Interview: Metric Selection Grid</h2>
          <p className="text-xs text-dark/40 mb-3">Based on responses, fill in to finalize. Rule: pick 8-12 max.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-gray text-left">
                  <th className="py-2 font-medium text-dark/60">Metric</th>
                  <th className="py-2 font-medium text-dark/60">Priority</th>
                  <th className="py-2 font-medium text-dark/60">Data Available?</th>
                  <th className="py-2 font-medium text-dark/60">Effort</th>
                  <th className="py-2 font-medium text-dark/60">Include?</th>
                </tr>
              </thead>
              <tbody className="text-dark/70">
                {["Sprint velocity", "Cycle time", "Sprint predictability", "Throughput", "Story quality score", "Story rejection rate", "First pass yield", "Test coverage %", "Test creation time", "Story review cycle time", "Defect density", "Documentation coverage", "Planning accuracy", "Requirement clarity", "SPACE survey", "DevEx survey", "DORA (4 metrics)"].map((m) => (
                  <tr key={m} className="border-b border-light-gray/50">
                    <td className="py-2">{m}</td>
                    <td className="py-2"><input type="text" className="w-full border border-light-gray rounded p-1 text-xs" /></td>
                    <td className="py-2"><input type="text" className="w-full border border-light-gray rounded p-1 text-xs" /></td>
                    <td className="py-2"><input type="text" className="w-full border border-light-gray rounded p-1 text-xs" /></td>
                    <td className="py-2"><input type="checkbox" className="accent-primary" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3 text-xs text-amber-800">
            <strong>Recommended starter set:</strong> Velocity (3): sprint velocity, cycle time, throughput · Quality (4): story quality, rejection rate, first pass yield, test coverage · Efficiency (2): review cycle time, test creation time · Team Health (2): SPACE, requirement clarity · <strong>Total: 11 metrics</strong>
          </div>
        </div>
      </main>
    </>
  );
}
