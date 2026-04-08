"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { EngagementDetail } from "@ussp-platform/core";

export default function PresentationPage() {
  const { id } = useParams<{ id: string }>();
  const [eng, setEng] = useState<EngagementDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/engagements/${id}`)
      .then((r) => r.json())
      .then(setEng)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 60, fontFamily: "Inter, system-ui, sans-serif", color: "#94a3b8" }}>Loading presentation...</div>;
  if (!eng) return <div style={{ padding: 60, fontFamily: "Inter, system-ui, sans-serif", color: "#dc2626" }}>Engagement not found</div>;

  const clientName = eng.client_name || "Client";
  const engName = eng.name || "AI Transformation";
  const teamCount = eng.teams.length;
  const memberCount = eng.teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);
  const hasBaseline = eng.teams.some((t) => t.baseline);
  const hasPost = eng.teams.some((t) => t.post_training);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --navy: #0f172a; --dark: #1e293b; --blue: #2563eb; --blue-light: #3b82f6;
          --blue-glow: rgba(37,99,235,0.15); --teal: #0d9488; --white: #fff;
          --gray-100: #f1f5f9; --gray-200: #e2e8f0; --gray-400: #94a3b8; --gray-600: #475569;
          --red: #dc2626; --red-bg: rgba(220,38,38,0.08); --red-border: rgba(220,38,38,0.25);
          --amber: #d97706; --green: #16a34a;
        }
        body { font-family: 'Inter', system-ui, sans-serif; background: var(--gray-100); color: var(--dark); }
        .slide { width: 1280px; min-height: 720px; margin: 40px auto; background: var(--white); border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; position: relative; page-break-after: always; }
        .slide-title { background: linear-gradient(135deg, var(--navy) 0%, #1e3a5f 50%, var(--blue) 100%); color: var(--white); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 80px 100px; }
        .slide-title .draft-badge { background: var(--red); color: white; font-size: 13px; font-weight: 700; letter-spacing: 2px; padding: 6px 20px; border-radius: 20px; margin-bottom: 40px; text-transform: uppercase; }
        .slide-title h1 { font-size: 48px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; }
        .slide-title h2 { font-size: 24px; font-weight: 300; color: rgba(255,255,255,0.85); margin-bottom: 50px; }
        .slide-title .meta { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.8; }
        .slide-title .meta strong { color: rgba(255,255,255,0.9); }
        .slide-header { background: var(--navy); padding: 28px 60px; display: flex; justify-content: space-between; align-items: center; }
        .slide-header h2 { color: var(--white); font-size: 26px; font-weight: 700; }
        .slide-header .sn { color: var(--gray-400); font-size: 14px; }
        .slide-body { padding: 45px 60px; }
        .open-q { background: var(--red-bg); border: 1.5px solid var(--red-border); border-left: 4px solid var(--red); border-radius: 8px; padding: 14px 18px; margin: 10px 0; color: var(--red); font-weight: 500; font-size: 14px; display: flex; align-items: flex-start; gap: 10px; }
        .open-q::before { content: "?"; background: var(--red); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .tbd { color: var(--red); font-weight: 600; background: var(--red-bg); padding: 2px 8px; border-radius: 4px; font-size: 0.9em; }
        .grid { display: grid; gap: 18px; margin-top: 18px; }
        .g2 { grid-template-columns: 1fr 1fr; }
        .g3 { grid-template-columns: 1fr 1fr 1fr; }
        .card { background: var(--gray-100); border-radius: 10px; padding: 24px; border: 1px solid var(--gray-200); }
        .card h3 { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
        .card p, .card li { font-size: 13px; color: var(--gray-600); line-height: 1.6; }
        .card ul { padding-left: 16px; }
        .card-blue { background: var(--blue-glow); border-color: rgba(37,99,235,0.2); }
        .card-blue h3 { color: var(--blue); }
        .icon { font-size: 28px; margin-bottom: 10px; }
        .stat-row { display: flex; gap: 30px; margin: 25px 0; }
        .stat { text-align: center; flex: 1; }
        .stat .num { font-size: 44px; font-weight: 800; color: var(--blue); line-height: 1; }
        .stat .label { font-size: 13px; color: var(--gray-600); margin-top: 8px; }
        .sub { font-size: 15px; color: var(--gray-600); margin-bottom: 22px; line-height: 1.5; }
        .sl { font-size: 11px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
        .big-q { font-size: 22px; font-weight: 300; color: var(--navy); border-left: 4px solid var(--blue); padding: 18px 28px; margin: 28px 0; line-height: 1.5; font-style: italic; }
        table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px; }
        th { background: var(--navy); color: var(--white); padding: 10px 14px; text-align: left; font-weight: 600; font-size: 12px; }
        td { padding: 10px 14px; border-bottom: 1px solid var(--gray-200); color: var(--gray-600); }
        tr:nth-child(even) { background: var(--gray-100); }
        .pillars { display: flex; gap: 2px; margin: 25px 0 18px; }
        .pillar { flex: 1; text-align: center; padding: 26px 12px; color: white; border-radius: 8px; }
        .pillar h3 { font-size: 16px; margin-bottom: 6px; }
        .pillar p { font-size: 12px; opacity: 0.85; }
        .slide-footer { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 60px; display: flex; justify-content: space-between; font-size: 11px; color: var(--gray-400); border-top: 1px solid var(--gray-200); }
        .guardrail { display: flex; align-items: center; gap: 12px; padding: 12px 18px; background: var(--gray-100); border-radius: 8px; margin: 8px 0; font-size: 14px; color: var(--navy); border-left: 4px solid var(--red); }
        @media print { body { background: white; } .slide { margin: 0; box-shadow: none; border-radius: 0; page-break-inside: avoid; } }
      `}</style>

      {/* ═══ SLIDE 1: TITLE ═══ */}
      <div className="slide slide-title">
        <div className="draft-badge">Draft — For Discussion</div>
        <h1>AI-Augmented Delivery<br/>Transformation</h1>
        <h2>{clientName} — {engName}</h2>
        <div className="meta">
          <strong>Presented by:</strong> Vinay Lagisetty, Krasan — AI Transformation Leader<br/>
          <strong>Engagement:</strong> {engName}<br/>
          <strong>Teams:</strong> {teamCount} team{teamCount !== 1 ? "s" : ""} · {memberCount} member{memberCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ═══ SLIDE 2: AGENDA ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Agenda</h2><span className="sn">2</span></div>
        <div className="slide-body">
          <div className="grid g2">
            <div className="card"><div className="icon">🎯</div><h3>1. The Opportunity</h3><p>Why AI augmentation, why now — industry research and what we&apos;ve seen work</p></div>
            <div className="card"><div className="icon">🔬</div><h3>2. Our Approach</h3><p>Govern → Baseline → Train → Pilot → Measure → Playbook → Scale</p></div>
            <div className="card"><div className="icon">📊</div><h3>3. Measurement Framework</h3><p>How we prove ROI with DORA, SPACE, and industry-standard metrics</p></div>
            <div className="card"><div className="icon">🛡️</div><h3>4. Governance & Compliance</h3><p>Full alignment with State of Illinois DoIT AI Policy</p></div>
            <div className="card"><div className="icon">🗓️</div><h3>5. Timeline & Results</h3><p>Phased rollout with expected outcomes and success criteria</p></div>
            <div className="card"><div className="icon">❓</div><h3>6. Discussion & Next Steps</h3><p>Open questions, priority alignment, and what we need to start</p></div>
          </div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 3: OPPORTUNITY ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>The Opportunity</h2><span className="sn">3</span></div>
        <div className="slide-body">
          <div className="sl">The Landscape</div>
          <p className="sub">AI-augmented software delivery is measurable, governable, and proven to work within State of Illinois constraints.</p>
          <div className="stat-row">
            <div className="stat"><div className="num">20-45%</div><div className="label">Developer productivity improvement<br/><em>McKinsey, 2023</em></div></div>
            <div className="stat"><div className="num">55%</div><div className="label">Faster task completion with AI<br/><em>GitHub Research, 2023</em></div></div>
            <div className="stat"><div className="num">62%</div><div className="label">Median productivity gain (CMMI)<br/><em>Carnegie Mellon SEI</em></div></div>
          </div>
          <div className="big-q">&ldquo;AI amplifies the existing team — same people, better tools, more output. No workforce reduction. No autonomous code generation.&rdquo;</div>
          <div className="sl" style={{ marginTop: 20 }}>{clientName} — Current Engagement</div>
          <div className="grid g3">
            <div className="card"><h3>Teams</h3><p style={{ fontSize: 28, fontWeight: 800, color: "#2563eb" }}>{teamCount}</p><p>Scrum teams enrolled</p></div>
            <div className="card"><h3>Members</h3><p style={{ fontSize: 28, fontWeight: 800, color: "#2563eb" }}>{memberCount}</p><p>Team members</p></div>
            <div className="card"><h3>Status</h3><p style={{ fontSize: 28, fontWeight: 800, color: hasBaseline ? "#16a34a" : "#d97706" }}>{hasBaseline ? (hasPost ? "Post-Training" : "Baseline Done") : "Discovery"}</p><p>Current phase</p></div>
          </div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 4: PHILOSOPHY ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Our Philosophy: Amplify, Not Replace</h2><span className="sn">4</span></div>
        <div className="slide-body">
          <div className="grid g2" style={{ marginBottom: 25 }}>
            <div className="card card-blue">
              <h3>✅ What We Do</h3>
              <ul><li>Give every role the right AI tools with structured training</li><li>Measure before and after with research-backed metrics</li><li>Produce role-based playbooks that persist beyond the pilot</li><li>Operate within full DoIT AI Policy compliance</li><li>Human reviews and approves all AI-assisted output</li></ul>
            </div>
            <div className="card" style={{ borderColor: "var(--red-border)", background: "var(--red-bg)" }}>
              <h3 style={{ color: "var(--red)" }}>❌ What We Don&apos;t Do</h3>
              <ul><li>No autonomous code generation</li><li>No AI-generated production code commits</li><li>No sensitive data in AI prompts</li><li>No unapproved tools — only state-vetted AI</li><li>No workforce reduction — same team, amplified</li></ul>
            </div>
          </div>
          <div className="guardrail"><span style={{ fontSize: 20 }}>⚠️</span><span><strong>CMS/Medicare Precedent (Oct 2025):</strong> Federal pulled AI tools mid-sprint. Our approach: understand boundaries early, comply fully, never overextend.</span></div>
          <div className="open-q">Does {clientName} have specific constraints or concerns beyond the DoIT policy?</div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 5: APPROACH ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Approach: 7-Phase Model</h2><span className="sn">5</span></div>
        <div className="slide-body">
          <div className="pillars">
            <div className="pillar" style={{ background: "#1e40af" }}><h3>Govern</h3><p>DoIT compliance</p></div>
            <div className="pillar" style={{ background: "#2563eb" }}><h3>Baseline</h3><p>Metrics before AI</p></div>
            <div className="pillar" style={{ background: "#3b82f6" }}><h3>Train</h3><p>Role-specific</p></div>
            <div className="pillar" style={{ background: "#0d9488" }}><h3>Pilot</h3><p>Controlled test</p></div>
            <div className="pillar" style={{ background: "#0f766e" }}><h3>Measure</h3><p>Continuous data</p></div>
          </div>
          <div className="pillars" style={{ marginTop: 2 }}>
            <div className="pillar" style={{ background: "#7c3aed" }}><h3>Playbook</h3><p>Best practices</p></div>
            <div className="pillar" style={{ background: "#9333ea" }}><h3>Scale</h3><p>Org-wide rollout</p></div>
            <div className="pillar" style={{ background: "transparent", border: "2px dashed #e2e8f0" }}><h3>&nbsp;</h3><p>&nbsp;</p></div>
            <div className="pillar" style={{ background: "transparent", border: "2px dashed #e2e8f0" }}><h3>&nbsp;</h3><p>&nbsp;</p></div>
            <div className="pillar" style={{ background: "transparent", border: "2px dashed #e2e8f0" }}><h3>&nbsp;</h3><p>&nbsp;</p></div>
          </div>
          <div className="grid g2" style={{ marginTop: 25 }}>
            <div className="card"><h3>Pilot Structure</h3><ul><li><strong>Duration:</strong> 1 full PI (~3 months)</li><li><strong>Pilot teams</strong> receive AI training + tools</li><li><strong>Control teams</strong> continue as-is</li><li>Weekly check-ins, continuous measurement</li></ul></div>
            <div className="card"><h3>Deliverables</h3><ul><li>Rollout plan with DoIT compliance</li><li>Baseline metrics report</li><li>Role-specific training materials</li><li>Pilot results (before vs after)</li><li>Role-based playbooks (BA, Tester, Dev)</li></ul></div>
          </div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 6: TARGET ROLES ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Target Roles & AI Use Cases</h2><span className="sn">6</span></div>
        <div className="slide-body">
          <table>
            <thead><tr><th>Role</th><th>AI Tool</th><th>Use Case</th><th>Expected Benefit</th></tr></thead>
            <tbody>
              <tr><td><strong>Business Analyst</strong></td><td>Atlassian Rovo</td><td>User story quality assessment & refinement</td><td>Faster authoring, fewer review cycles</td></tr>
              <tr><td><strong>Business Analyst</strong></td><td>Rovo + Confluence</td><td>Acceptance criteria generation (Gherkin)</td><td>Better testability, clearer requirements</td></tr>
              <tr><td><strong>Tester</strong></td><td>Rovo / Copilot</td><td>Test script generation from AC</td><td>Faster test creation, better coverage</td></tr>
              <tr><td><strong>Developer</strong></td><td>GitHub Copilot</td><td>Code explanation, docs, refactoring suggestions</td><td>10-20% time savings per story</td></tr>
              <tr><td><strong>Developer</strong></td><td>GitHub Copilot</td><td>Unit test scenario suggestions</td><td>Better coverage, fewer defect escapes</td></tr>
              <tr style={{ background: "var(--red-bg)" }}><td><strong>Data</strong></td><td className="tbd">TBD</td><td className="tbd">TBD — needs discovery</td><td className="tbd">TBD</td></tr>
            </tbody>
          </table>
          <div className="open-q">What AI tools does {clientName} currently have access to?</div>
          <div className="open-q">What project management toolchain is in use? (JIRA, Confluence, other?)</div>
          <div className="open-q">Are there role-specific pain points to address first?</div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 7: MEASUREMENT ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Measurement Framework</h2><span className="sn">7</span></div>
        <div className="slide-body">
          <div className="sl">Research-Backed — Not Guesswork</div>
          <p className="sub">Every metric traces to peer-reviewed research or international standards.</p>
          <div className="grid g3">
            <div className="card card-blue"><h3>DORA / Accelerate</h3><p><strong>Google DevOps Research</strong><br/>23,000+ respondents, 7+ years<br/><br/>Velocity, cycle time, throughput, failure rate</p></div>
            <div className="card card-blue"><h3>SPACE Framework</h3><p><strong>Microsoft Research / ACM</strong><br/>5 dimensions of productivity<br/><br/>Satisfaction, Performance, Activity, Communication, Efficiency</p></div>
            <div className="card card-blue"><h3>QUS Framework</h3><p><strong>Utrecht University</strong><br/>13 criteria, validated on 1,023 stories<br/><br/>Story quality — syntactic, semantic, pragmatic</p></div>
          </div>
          <div className="grid g3" style={{ marginTop: 8 }}>
            <div className="card"><h3>Six Sigma DMAIC</h3><p>Before/after methodology — Define, Measure, Analyze, Improve, Control</p></div>
            <div className="card"><h3>ISO/IEC 25010:2023</h3><p>International standard — 8 quality characteristics, 31 sub-characteristics</p></div>
            <div className="card"><h3>GQM Paradigm</h3><p>Goal-Question-Metric — every metric traces to a business goal (NASA/UMD)</p></div>
          </div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 8: PROPOSED METRICS ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Proposed Metrics</h2><span className="sn">8</span></div>
        <div className="slide-body">
          <p className="sub">Recommended 8-12 metrics max. Final selection based on executive priorities.</p>
          <table>
            <thead><tr><th>Category</th><th>Metric</th><th>Source</th><th>Research</th></tr></thead>
            <tbody>
              <tr><td rowSpan={3}><strong>Velocity</strong></td><td>Sprint velocity</td><td>JIRA (automated)</td><td>DORA — throughput</td></tr>
              <tr><td>Cycle time</td><td>JIRA (automated)</td><td>DORA — lead time</td></tr>
              <tr><td>Sprint predictability</td><td>JIRA (automated)</td><td>SPACE — performance</td></tr>
              <tr><td rowSpan={4}><strong>Quality</strong></td><td>Story quality score</td><td>JIRA scanner</td><td>QUS framework</td></tr>
              <tr><td>Story rejection rate</td><td>JIRA transitions</td><td>Six Sigma — rework</td></tr>
              <tr><td>First pass yield</td><td>JIRA transitions</td><td>Six Sigma — FPY</td></tr>
              <tr><td>Test coverage</td><td>JIRA links</td><td>ISO 25010</td></tr>
              <tr><td rowSpan={2}><strong>Efficiency</strong></td><td>Story review cycle time</td><td>JIRA (automated)</td><td>DORA — lead time</td></tr>
              <tr><td>Test creation time</td><td>Manual tracking</td><td>SPACE — efficiency</td></tr>
              <tr><td rowSpan={2}><strong>Team Health</strong></td><td>SPACE survey (5 dims)</td><td>Survey tool</td><td>Forsgren 2021</td></tr>
              <tr><td>Requirement clarity</td><td>Survey (1-5)</td><td>SPACE — communication</td></tr>
            </tbody>
          </table>
          <div className="open-q">Which metrics matter most? Velocity? Quality? Team satisfaction?</div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 9: DoIT ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Governance: DoIT AI Policy Compliance</h2><span className="sn">9</span></div>
        <div className="slide-body">
          <div className="sl">State of Illinois DoIT AI Policy (Effective April 1, 2025)</div>
          <table>
            <thead><tr><th>Requirement</th><th>Section</th><th>How We Comply</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Human in the loop</td><td>§4d, §6</td><td>AI suggests, human decides</td><td style={{ color: "var(--green)", fontWeight: 600 }}>✓ Built-in</td></tr>
              <tr><td>No protected data in AI</td><td>§4f</td><td>No case data in prompts</td><td style={{ color: "var(--green)", fontWeight: 600 }}>✓ Built-in</td></tr>
              <tr><td>Transparency / disclosure</td><td>§5a-c</td><td>Written disclosure; deliverables labeled</td><td style={{ color: "var(--green)", fontWeight: 600 }}>✓ Built-in</td></tr>
              <tr><td>Bias mitigation</td><td>§11</td><td>Per-sprint bias spot checks</td><td style={{ color: "var(--green)", fontWeight: 600 }}>✓ Built-in</td></tr>
              <tr><td>Continuous monitoring</td><td>§7</td><td>Measurement tool audit trail</td><td style={{ color: "var(--green)", fontWeight: 600 }}>✓ Built-in</td></tr>
              <tr style={{ background: "var(--red-bg)" }}><td>AI System Assessment Report</td><td>§5f</td><td>Agency Head signoff + 30-day notice</td><td className="tbd">Needs clarification</td></tr>
              <tr style={{ background: "var(--red-bg)" }}><td>State data consent</td><td>§5e</td><td>Written consent if code = state data</td><td className="tbd">Needs clarification</td></tr>
              <tr style={{ background: "var(--red-bg)" }}><td>30-day advance notice</td><td>§5f</td><td>Must be filed before pilot launch</td><td className="tbd">Needs clarification</td></tr>
            </tbody>
          </table>
          <div className="open-q">Has {clientName} filed the DoIT AI System Assessment?</div>
          <div className="open-q">Has the 30-day advance notice been submitted?</div>
          <div className="open-q">Does {clientName} consider source code &ldquo;State data&rdquo; under §5e?</div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 10: TOOLING LIFECYCLE ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Our Tooling: Assess → Transform → Govern</h2><span className="sn">10</span></div>
        <div className="slide-body">
          <div className="sl">AI Transformation Platform — tools.ussp.co</div>
          <div className="pillars" style={{ marginBottom: 25 }}>
            <div className="pillar" style={{ background: "#7c3aed" }}><h3>1. Assess</h3><p>Readiness Assessment<br/><em style={{ fontSize: 11 }}>tools.ussp.co/readiness</em></p></div>
            <div className="pillar" style={{ background: "#2563eb" }}><h3>2. Transform</h3><p>Transformation Monitor<br/><em style={{ fontSize: 11 }}>tools.ussp.co/engagements</em></p></div>
            <div className="pillar" style={{ background: "#0d9488" }}><h3>3. Govern</h3><p>GRC & Compliance<br/><em style={{ fontSize: 11 }}>tools.ussp.co/governance</em></p></div>
          </div>
          <div className="grid g3">
            <div className="card" style={{ borderTop: "4px solid #7c3aed" }}><h3>Readiness Assessment</h3><ul><li>DORA 2025 AI Capabilities Model</li><li>7 capabilities scored 1-5</li><li>Blocker identification</li><li>State law regulatory reference</li></ul></div>
            <div className="card" style={{ borderTop: "4px solid #2563eb" }}><h3>Transformation Monitor</h3><ul><li>37 metrics across 5 categories</li><li>Before/after comparison</li><li>JIRA integration (automated)</li><li>SPACE/DevEx surveys</li><li>Executive reports & radar charts</li></ul></div>
            <div className="card" style={{ borderTop: "4px solid #0d9488" }}><h3>GRC & Compliance</h3><ul><li>DoIT AI Policy checklist</li><li>Risk register tracking</li><li>Data governance controls</li><li>Audit trail & monitoring</li></ul></div>
          </div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 11: EXPECTED RESULTS ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Expected Results — {clientName}</h2><span className="sn">11</span></div>
        <div className="slide-body">
          <div className="sl">Based on Industry Research — Conservative Targets</div>
          <table>
            <thead><tr><th>Metric</th><th style={{ textAlign: "center" }}>Before (Baseline)</th><th style={{ textAlign: "center" }}>Target (After AI)</th><th style={{ textAlign: "center" }}>Improvement</th><th>Research Benchmark</th></tr></thead>
            <tbody>
              <tr><td><strong>Sprint Velocity</strong></td><td style={{ textAlign: "center" }} className="tbd">TBD — baseline</td><td style={{ textAlign: "center" }}>+5-15%</td><td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>5-15%</td><td style={{ fontSize: 12 }}>DORA: high performers 2x throughput</td></tr>
              <tr><td><strong>Story Quality</strong></td><td style={{ textAlign: "center" }} className="tbd">TBD — baseline</td><td style={{ textAlign: "center" }}>+20-30%</td><td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>20-30%</td><td style={{ fontSize: 12 }}>QUS: AI-assisted stories score higher</td></tr>
              <tr><td><strong>Review Cycle Time</strong></td><td style={{ textAlign: "center" }} className="tbd">TBD — baseline</td><td style={{ textAlign: "center" }}>-10-25%</td><td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>10-25%</td><td style={{ fontSize: 12 }}>Fewer review rounds</td></tr>
              <tr><td><strong>Test Creation Time</strong></td><td style={{ textAlign: "center" }} className="tbd">TBD — baseline</td><td style={{ textAlign: "center" }}>-15-30%</td><td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>15-30%</td><td style={{ fontSize: 12 }}>GitHub: 55% faster task completion</td></tr>
              <tr><td><strong>First Pass Yield</strong></td><td style={{ textAlign: "center" }} className="tbd">TBD — baseline</td><td style={{ textAlign: "center" }}>+5-10%</td><td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>5-10%</td><td style={{ fontSize: 12 }}>Six Sigma: better input → fewer defects</td></tr>
              <tr><td><strong>Dev Productivity</strong></td><td style={{ textAlign: "center" }} className="tbd">TBD — baseline</td><td style={{ textAlign: "center" }}>+10-20%</td><td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>10-20%</td><td style={{ fontSize: 12 }}>McKinsey: 20-45% with AI tools</td></tr>
              <tr><td><strong>Team Satisfaction</strong></td><td style={{ textAlign: "center" }} className="tbd">TBD — baseline</td><td style={{ textAlign: "center" }}>No decrease</td><td style={{ textAlign: "center", color: "var(--blue)", fontWeight: 600 }}>Maintain/↑</td><td style={{ fontSize: 12 }}>SPACE: satisfaction must not decrease</td></tr>
              <tr><td><strong>Playbooks</strong></td><td style={{ textAlign: "center" }}>0</td><td style={{ textAlign: "center" }}>4</td><td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>4 delivered</td><td style={{ fontSize: 12 }}>BA, Tester, Developer, Data</td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: 16, padding: "12px 18px", background: "var(--gray-100)", borderRadius: 8, fontSize: 13, color: "var(--gray-600)" }}>
            <strong>Note:</strong> Conservative targets. Industry benchmarks show significantly higher gains (McKinsey: 20-45%, CMMI: 62% median). We set modest targets to ensure credibility and overdelivery.
          </div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 12: TEAMS ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>{clientName} — Teams & Status</h2><span className="sn">12</span></div>
        <div className="slide-body">
          <div className="sl">Current Engagement Teams</div>
          {eng.teams.length === 0 ? (
            <div className="open-q">No teams enrolled yet. Team selection is needed before pilot can begin.</div>
          ) : (
            <table>
              <thead><tr><th>Team</th><th>Members</th><th>Baseline</th><th>Post-Training</th><th>Improvement</th></tr></thead>
              <tbody>
                {eng.teams.map((team) => (
                  <tr key={team.id}>
                    <td><strong>{team.name}</strong></td>
                    <td>{team.members?.length || 0} members</td>
                    <td style={{ color: team.baseline ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                      {team.baseline ? ((team.baseline as unknown as Record<string, unknown>).status === "completed" ? "✓ Complete" : "In Progress") : "Not Started"}
                    </td>
                    <td style={{ color: team.post_training ? "var(--green)" : "var(--gray-400)", fontWeight: 600 }}>
                      {team.post_training ? ((team.post_training as unknown as Record<string, unknown>).status === "completed" ? "✓ Complete" : "In Progress") : "—"}
                    </td>
                    <td style={{ color: team.improvement_pct ? "var(--green)" : "var(--gray-400)", fontWeight: 600 }}>
                      {team.improvement_pct ? `+${team.improvement_pct}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: 30 }}>
            <div className="sl">Open Questions</div>
            <table>
              <thead><tr><th>#</th><th>Open Question</th><th>Who Can Answer</th></tr></thead>
              <tbody>
                {[
                  ["Current technology project / modernization initiative?", "CIO"],
                  ["Team structure: # of teams, consultants, vendors?", "CIO / PM"],
                  ["Tech stack and project management tools?", "CIO / Architect"],
                  ["What AI tools are currently available / approved?", "CIO"],
                  ["DoIT AI Assessment filed? 30-day notice submitted?", "CIO"],
                  ["Success criteria: target improvement %, key priorities?", "CIO"],
                  ["When is the next PI Planning?", "RTE / PM"],
                  ["Source code = \"State data\" for AI policy purposes?", "CIO / Legal"],
                ].map(([q, who], i) => (
                  <tr key={i} style={{ background: "var(--red-bg)" }}>
                    <td>{i + 1}</td>
                    <td>{q}</td>
                    <td className="tbd">{who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>

      {/* ═══ SLIDE 13: NEXT STEPS ═══ */}
      <div className="slide">
        <div className="slide-header"><h2>Proposed Next Steps</h2><span className="sn">13</span></div>
        <div className="slide-body">
          <div className="grid g2">
            <div className="card" style={{ borderLeft: "4px solid var(--blue)" }}>
              <h3>Immediate (This Week)</h3>
              <ul><li>CIO confirms interest and aligns on goals</li><li>Identify internal point of contact</li><li>Confirm DoIT AI compliance status</li><li>Share available AI tool inventory</li></ul>
            </div>
            <div className="card" style={{ borderLeft: "4px solid var(--teal)" }}>
              <h3>Week 2-3</h3>
              <ul><li>Executive discovery session (30-45 min)</li><li>Grant team access (clearance, credentials)</li><li>Architecture / dev process walkthrough</li><li>Pilot team identification</li></ul>
            </div>
          </div>
          <div className="big-q" style={{ marginTop: 40 }}>Same team. Better tools. Measurable results.<br/>Full DoIT compliance. No risk — only upside.</div>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--navy)" }}>Vinay Lagisetty</div>
            <div style={{ fontSize: 16, color: "var(--gray-600)" }}>AI Transformation Leader, Krasan</div>
          </div>
        </div>
        <div className="slide-footer"><span>Krasan Consulting Services — Confidential Draft</span><span>{clientName}</span></div>
      </div>
    </>
  );
}
