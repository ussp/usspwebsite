"use client";

import { useState } from "react";

const PASSCODE = "USSP-TR-2026";

export default function SharedTeleRayMOU() {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === PASSCODE) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!unlocked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 12, padding: "40px 36px", width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.3)", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>Protected Document</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 24px 0" }}>Enter the access code to view this document.</p>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Access code"
            style={{ width: "100%", padding: "10px 14px", fontSize: 14, border: `1px solid ${error ? "#ef4444" : "#e2e8f0"}`, borderRadius: 6, outline: "none", marginBottom: 12, boxSizing: "border-box" }}
            autoFocus
          />
          {error && <p style={{ fontSize: 12, color: "#ef4444", margin: "0 0 12px 0" }}>Incorrect access code</p>}
          <button type="submit" style={{ width: "100%", padding: "10px 0", fontSize: 14, fontWeight: 600, color: "#fff", background: "#2563eb", border: "none", borderRadius: 6, cursor: "pointer" }}>
            View Document
          </button>
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 16 }}>US Software Professionals Inc.</p>
        </form>
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<style>
  body { margin: 0; padding: 0; }
  .mou * { box-sizing: border-box; }
  .mou { font-family: 'Georgia', 'Times New Roman', serif; color: #1a1a1a; line-height: 1.7; background: #f8f9fa; }
  .mou .m-header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #fff; padding: 48px 32px; text-align: center; }
  .mou .m-header h1 { font-size: 26px; font-weight: 700; letter-spacing: 1px; margin: 0 0 8px 0; }
  .mou .m-header .m-subtitle { font-size: 15px; color: #bfdbfe; margin: 0 0 20px 0; }
  .mou .m-header .m-meta { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; font-size: 12px; color: #93c5fd; }
  .mou .m-header .m-meta strong { color: #fff; }
  .mou .confidential { display: inline-block; margin-top: 16px; background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 12px; border-radius: 4px; }
  .mou .m-body { max-width: 820px; margin: 0 auto; padding: 40px 24px 60px; }
  .mou .m-purpose { background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 32px; font-style: italic; color: #1e40af; font-size: 14px; }
  .mou .m-section { background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 28px 28px 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .mou .m-section h2 { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }
  .mou .m-section h3 { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; font-weight: 600; color: #334155; margin: 16px 0 8px 0; }
  .mou .m-section .m-num { display: inline-block; background: #2563eb; color: #fff; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 11px; font-weight: 700; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%; margin-right: 8px; }
  .mou .m-section .m-divider { border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }
  .mou .m-section p { font-size: 14px; margin: 8px 0; }
  .mou .m-section ul, .mou .m-section ol { font-size: 14px; margin: 8px 0 8px 20px; }
  .mou .m-section li { margin-bottom: 6px; }
  .mou .m-section table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
  .mou .m-section th { background: #f1f5f9; text-align: left; padding: 10px 12px; border: 1px solid #e2e8f0; font-family: 'Segoe UI', system-ui, sans-serif; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.3px; color: #475569; }
  .mou .m-section td { padding: 10px 12px; border: 1px solid #e2e8f0; }
  .mou .m-section .m-highlight { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px 16px; margin: 12px 0; font-size: 13px; }
  .mou .m-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 32px; }
  .mou .m-sig-block { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; }
  .mou .m-sig-block h3 { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
  .mou .m-sig-line { border-bottom: 1px solid #cbd5e1; padding: 8px 0; margin-bottom: 12px; font-size: 13px; color: #64748b; }
  .mou .m-footer { text-align: center; padding: 24px; font-size: 11px; color: #94a3b8; }
  .mou .m-print-btn { display: inline-block; margin-top: 20px; background: #2563eb; color: #fff; border: none; padding: 10px 24px; border-radius: 6px; font-size: 13px; font-family: 'Segoe UI', system-ui, sans-serif; cursor: pointer; text-decoration: none; }
  .mou .m-print-btn:hover { background: #1d4ed8; }
  @media print {
    .mou .m-print-btn, .mou .confidential { display: none !important; }
    .mou { background: #fff !important; }
    .mou .m-header { background: #0f172a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 32px 24px; }
    .mou .m-body { padding: 20px 0 0; }
    .mou .m-section { break-inside: avoid; box-shadow: none; border: 1px solid #ccc; margin-bottom: 12px; padding: 20px 20px 14px; }
    .mou .m-section h2 { font-size: 14px; }
    .mou .m-section h3 { font-size: 12px; }
    .mou .m-section p, .mou .m-section li { font-size: 12px; line-height: 1.5; }
    .mou .m-section table { font-size: 11px; }
    .mou .m-section th, .mou .m-section td { padding: 6px 8px; }
    .mou .m-purpose { font-size: 12px; margin-bottom: 16px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .mou .m-highlight { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 11px; }
    .mou .m-signatures { break-inside: avoid; margin-top: 16px; }
    .mou .m-sig-block { padding: 16px; }
    .mou .m-footer { font-size: 10px; padding: 12px; }
    @page { margin: 0.6in 0.5in; }
  }
</style>
<div class="mou">
  <div class="m-header">
    <h1>MEMORANDUM OF UNDERSTANDING</h1>
    <p class="m-subtitle">Between US Software Professionals Inc. and TeleRay Inc.</p>
    <div class="m-meta">
      <span><strong>Subject:</strong> IL Government Reseller Partnership</span>
      <span><strong>Date:</strong> March 2026</span>
      <span><strong>Status:</strong> Draft for Discussion</span>
    </div>
    <div class="confidential">CONFIDENTIAL &mdash; FOR AUTHORIZED PARTIES ONLY</div>
  </div>

  <div class="m-body">
    <div class="m-purpose">
      This Memorandum of Understanding establishes terms for USSP to serve as the exclusive reseller and implementation partner for TeleRay platform solutions within Illinois state and local government agencies.
    </div>

    <div class="m-section">
      <h2><span class="m-num">1</span>PARTIES</h2>
      <hr class="m-divider" />
      <h3>USSP &mdash; US Software Professionals Inc.</h3>
      <p>875 N Michigan Ave, Suite 3100, Chicago, IL 60614<br/>
      MBE/WBE/DBE Certified | TOPS Authorized Subvendor (via Krasan Consulting Services, Contract #CMT4599470)</p>
      <h3>TeleRay &mdash; TeleRay Inc.</h3>
      <p>Chicago, IL</p>
    </div>

    <div class="m-section">
      <h2><span class="m-num">2</span>PURPOSE AND SCOPE</h2>
      <hr class="m-divider" />
      <p>USSP shall serve as an authorized reseller and implementation partner for TeleRay&rsquo;s platform solutions within Illinois state and local government agencies.</p>
      <h3>2.1 Products Covered</h3>
      <ul>
        <li>TeleRay Visit (virtual patient care / telehealth)</li>
        <li>TeleRay Cloud PACS (medical imaging)</li>
        <li>TeleRay Reporting</li>
        <li>TeleRay Record (surgical video capture)</li>
        <li>TeleRay Remote (remote monitoring)</li>
        <li>Any Axis Communications hardware/software bundled with TeleRay deployments</li>
      </ul>
      <h3>2.2 Target Customers</h3>
      <p>Illinois state government agencies, Cook County, City of Chicago, and related public healthcare facilities, including but not limited to:</p>
      <h3 style="margin-top:12px;margin-bottom:4px;">State Agencies</h3>
      <ul>
        <li><strong>Illinois Department of Veterans&rsquo; Affairs</strong> &mdash; state veterans homes</li>
        <li><strong>IDOC (Illinois Department of Corrections)</strong> &mdash; correctional healthcare units</li>
        <li><strong>IDJJ (Illinois Department of Juvenile Justice)</strong> &mdash; youth facility healthcare</li>
        <li><strong>IDHS (Illinois Department of Human Services)</strong> &mdash; developmental centers, mental health facilities</li>
        <li><strong>IDPH (Illinois Department of Public Health)</strong> &mdash; public health clinics</li>
      </ul>
      <h3 style="margin-top:12px;margin-bottom:4px;">Cook County &amp; City of Chicago</h3>
      <ul>
        <li><strong>Cook County Health (CCH)</strong> &mdash; Stroger Hospital, Provident Hospital, and affiliated community health centers</li>
        <li><strong>City of Chicago Department of Public Health (CDPH)</strong> &mdash; public health clinics and community health centers</li>
        <li><strong>Cook County Department of Corrections</strong> &mdash; Cermak Health Services and correctional healthcare units</li>
        <li><strong>Cook County Forest Preserve District</strong> &mdash; any healthcare-related facilities</li>
      </ul>
      <p>And any other Illinois state, Cook County, or City of Chicago government entity procuring healthcare technology.</p>
    </div>

    <div class="m-section">
      <h2><span class="m-num">3</span>REVENUE SPLIT</h2>
      <hr class="m-divider" />
      <h3>3.1 Revenue Allocation</h3>
      <p>For all revenue generated from Illinois state and local government customers sourced and closed by USSP:</p>
      <table>
        <thead><tr><th>Party</th><th>Share</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><strong>USSP</strong></td><td><strong>80%</strong></td><td>Retains 80% of all revenue collected from end customer</td></tr>
          <tr><td><strong>TeleRay</strong></td><td><strong>20%</strong></td><td>Receives 20% royalty on all revenue collected from end customer</td></tr>
        </tbody>
      </table>
      <h3>3.2 Revenue Definition</h3>
      <p>&ldquo;Revenue&rdquo; means all recurring fees (per-bed/per-month subscription), implementation fees, integration fees, training fees, and ongoing support/managed service fees billed to the end customer for TeleRay platform solutions.</p>
      <h3>3.3 Payment Terms</h3>
      <ul>
        <li>USSP bills the end customer directly or through the integration partner (Krasan Consulting Services or other prime contractor)</li>
        <li>USSP remits TeleRay&rsquo;s 20% royalty within thirty (30) days of receiving payment from the end customer or integration partner</li>
        <li>USSP provides TeleRay with monthly revenue reports showing: customer name, number of beds/units, amount billed, amount collected, royalty owed</li>
        <li>TeleRay provides USSP with monthly platform usage reports for each customer</li>
      </ul>
      <h3>3.4 Pricing Authority</h3>
      <ul>
        <li>USSP has sole authority to set pricing to end customers within Illinois state and local government</li>
        <li>USSP may structure pricing as per-bed/month, project-based, or blended &mdash; the 80/20 split applies to total revenue regardless of structure</li>
      </ul>
    </div>

    <div class="m-section">
      <h2><span class="m-num">4</span>EXCLUSIVITY</h2>
      <hr class="m-divider" />
      <h3>4.1 Territory Exclusivity</h3>
      <p>TeleRay grants USSP exclusive rights to sell, market, and implement TeleRay platform solutions to Illinois state and local government agencies for the term of this agreement.</p>
      <h3>4.2 Lead Routing</h3>
      <p>If TeleRay receives any inbound inquiry from an Illinois state or local government agency, TeleRay shall route that opportunity to USSP within five (5) business days. USSP shall have first right to pursue and close the opportunity.</p>
      <h3>4.3 Non-Compete</h3>
      <p>During the term, TeleRay shall not:</p>
      <ul>
        <li>Appoint another reseller or channel partner for Illinois state and local government</li>
        <li>Sell directly to Illinois state or local government agencies without USSP&rsquo;s involvement</li>
        <li>Engage any third party to perform implementation services for Illinois state or local government TeleRay deployments</li>
      </ul>
      <h3>4.4 Introduction Protection</h3>
      <p>For any government agency or facility to which USSP introduces TeleRay&rsquo;s platform solutions:</p>
      <ul>
        <li>USSP shall retain exclusive rights to that customer relationship for four (4) years from the date of first introduction, regardless of whether this MOU is renewed or terminated</li>
        <li>&ldquo;Introduction&rdquo; means any meeting, demonstration, proposal submission, RFI/RFP response, or formal communication between TeleRay and a government agency facilitated by USSP</li>
        <li>USSP shall maintain a written log of all introductions, shared with TeleRay quarterly, and TeleRay shall acknowledge receipt in writing</li>
        <li>During the four-year introduction protection period, TeleRay shall not engage any other party to sell to, implement for, or service that customer for TeleRay products</li>
        <li>The 80/20 revenue split applies to all revenue from introduced customers throughout the four-year protection period</li>
      </ul>
      <h3>4.5 Exclusivity Review</h3>
      <p>If USSP fails to generate any revenue or have an active procurement opportunity in pipeline from Illinois state or local government within twenty-four (24) months of the effective date, TeleRay may request a good-faith renegotiation of exclusivity terms. Both parties acknowledge that government procurement cycles typically require 18&ndash;36 months from initial engagement to first revenue.</p>
    </div>

    <div class="m-section">
      <h2><span class="m-num">5</span>USSP RESPONSIBILITIES</h2>
      <hr class="m-divider" />
      <ol>
        <li><strong>Sales and business development</strong> &mdash; identify, qualify, propose, and close TeleRay opportunities within IL state and local government</li>
        <li><strong>Procurement navigation</strong> &mdash; manage TOPS task order process through Krasan Consulting Services (prime contractor)</li>
        <li><strong>Implementation</strong> &mdash; deploy TeleRay platform at customer facilities including:
          <ul>
            <li>Network and infrastructure readiness assessment</li>
            <li>Axis camera installation and configuration (where applicable)</li>
            <li>EMR/EHR integration (Epic, Cerner, Athena, or other systems in use)</li>
            <li>Platform configuration and customization</li>
            <li>Staff training and go-live support</li>
          </ul>
        </li>
        <li><strong>Ongoing support</strong> &mdash; provide Level 1 support to end customers, escalate Level 2/3 issues to TeleRay</li>
        <li><strong>Compliance</strong> &mdash; ensure all deployments meet state procurement, HIPAA, and applicable regulatory requirements</li>
        <li><strong>Reporting</strong> &mdash; provide monthly revenue and pipeline reports to TeleRay</li>
      </ol>
    </div>

    <div class="m-section">
      <h2><span class="m-num">6</span>TELERAY RESPONSIBILITIES</h2>
      <hr class="m-divider" />
      <ol>
        <li><strong>Platform access</strong> &mdash; provide USSP with full access to TeleRay platform for customer deployments</li>
        <li><strong>Demo environment</strong> &mdash; provide a fully functional demo environment for USSP sales presentations</li>
        <li><strong>Technical support</strong> &mdash; respond to USSP escalations within:
          <ul>
            <li>Critical issues (platform down): 4 hours</li>
            <li>High priority (feature impaired): 8 hours</li>
            <li>Standard: 24 hours</li>
          </ul>
        </li>
        <li><strong>Documentation</strong> &mdash; provide current technical documentation, API access, integration guides</li>
        <li><strong>Marketing materials</strong> &mdash; authorize USSP to use TeleRay name, logo, and marketing materials in proposals to IL state and local government</li>
        <li><strong>Training</strong> &mdash; provide initial product training to USSP implementation team (at TeleRay&rsquo;s expense)</li>
        <li><strong>Axis partnership</strong> &mdash; make Axis Communications hardware and integration available through USSP at partner pricing</li>
        <li><strong>Platform updates</strong> &mdash; give USSP 30-day advance notice of any platform changes, pricing changes, or feature deprecations</li>
      </ol>
    </div>

    <div class="m-section">
      <h2><span class="m-num">7</span>PROCUREMENT STRUCTURE</h2>
      <hr class="m-divider" />
      <h3>7.1 TOPS Vehicle</h3>
      <p>USSP operates as an authorized subvendor under the Illinois TOPS contract (Category Two &mdash; Technology Professional Services) through Krasan Consulting Services (prime contractor, Contract #CMT4599470, BidBuy #P-59947).</p>
      <h3>7.2 Billing Structure</h3>
      <ul>
        <li><strong>Implementation services</strong> (deployment, integration, training, support) &mdash; billed through TOPS task orders</li>
        <li><strong>TeleRay platform subscription</strong> &mdash; may be bundled into task orders or procured separately by the agency</li>
        <li>USSP will determine the appropriate billing structure per opportunity in consultation with Krasan and the procuring agency</li>
        <li>The 80/20 revenue split applies regardless of the procurement structure used</li>
      </ul>
    </div>

    <div class="m-section">
      <h2><span class="m-num">8</span>INTELLECTUAL PROPERTY</h2>
      <hr class="m-divider" />
      <ul>
        <li>TeleRay retains all intellectual property rights in the TeleRay platform</li>
        <li>USSP retains all intellectual property in implementation tools, processes, integration scripts, training materials, and customer-specific configurations developed by USSP</li>
        <li>Customer data belongs to the customer &mdash; neither party may use customer data beyond the scope of service delivery</li>
        <li>Any joint marketing materials require written approval from both parties before publication</li>
      </ul>
    </div>

    <div class="m-section">
      <h2><span class="m-num">9</span>CONFIDENTIALITY</h2>
      <hr class="m-divider" />
      <p>Each party agrees to keep confidential all non-public business information, pricing, customer data, technical specifications, and financial information shared under this agreement. This obligation survives termination for three (3) years.</p>
    </div>

    <div class="m-section">
      <h2><span class="m-num">10</span>TERM AND TERMINATION</h2>
      <hr class="m-divider" />
      <h3>10.1 Term</h3>
      <ul>
        <li>Initial term: Five (5) years from the effective date, reflecting the typical 18&ndash;36 month government procurement cycle plus implementation and stabilization period</li>
        <li>Automatic renewal for successive two (2) year periods unless either party provides one hundred eighty (180) days written notice of non-renewal</li>
      </ul>
      <h3>10.2 Termination for Cause</h3>
      <p>Either party may terminate upon sixty (60) days written notice if the other party materially breaches this agreement and fails to cure within the notice period.</p>
      <h3>10.3 Effect of Termination</h3>
      <ul>
        <li>USSP retains all existing customer contracts through their natural term &mdash; TeleRay may not terminate or reassign active customer accounts sourced by USSP</li>
        <li>The 80/20 revenue split continues for existing customers through the end of their contract term</li>
        <li>Introduction Protection (Section 4.4) survives termination &mdash; the four-year protection period runs from the date of each introduction regardless of MOU status</li>
        <li>USSP shall return all TeleRay confidential materials</li>
        <li>TeleRay shall continue to provide platform access and support for active customer deployments</li>
      </ul>
      <h3>10.4 Acquisition / Change of Control</h3>
      <p>If TeleRay is acquired, merged, or undergoes a change of control (defined as transfer of more than 50% of ownership or voting rights):</p>
      <ul>
        <li>All terms of this MOU, including exclusivity, revenue split, introduction protection, and equity provisions, shall be binding on the successor entity</li>
        <li>TeleRay shall include assignment of this MOU as a condition of any acquisition or merger agreement</li>
        <li>TeleRay shall provide USSP with sixty (60) days advance written notice of any pending change of control</li>
        <li>If the successor entity fails to honor the terms of this MOU, USSP shall be entitled to fair compensation for the value of its government relationships, sales pipeline, and implementation work, calculated as: (a) the remaining value of all active and in-pipeline customer contracts at their projected full-term revenue, (b) any earned but unissued equity at fair market value as determined by the acquisition price, and (c) a transition fee equal to twelve (12) months of revenue based on the trailing twelve-month average, to account for USSP&rsquo;s investment in building the government sales channel</li>
      </ul>
    </div>

    <div class="m-section">
      <h2><span class="m-num">11</span>NON-SOLICITATION</h2>
      <hr class="m-divider" />
      <p>During the term and for twelve (12) months after termination:</p>
      <ul>
        <li>Neither party shall directly solicit or hire employees of the other party</li>
        <li>Neither party shall solicit the other&rsquo;s customers for competing products</li>
      </ul>
    </div>

    <div class="m-section">
      <h2><span class="m-num">12</span>LIMITATION OF LIABILITY</h2>
      <hr class="m-divider" />
      <p>Neither party shall be liable for indirect, incidental, or consequential damages. Each party&rsquo;s total liability under this agreement shall not exceed the total royalties paid or payable in the twelve (12) months preceding the claim.</p>
    </div>

    <div class="m-section">
      <h2><span class="m-num">13</span>GOVERNING LAW AND DISPUTE RESOLUTION</h2>
      <hr class="m-divider" />
      <ul>
        <li>This agreement shall be governed by the laws of the State of Illinois</li>
        <li>Disputes shall be resolved first by good-faith negotiation between senior executives (30 days), then mediation (60 days), then binding arbitration in Chicago, Illinois</li>
      </ul>
    </div>

    <div class="m-section">
      <h2><span class="m-num">14</span>EQUITY EARNED THROUGH VALUE CREATION</h2>
      <hr class="m-divider" />
      <h3>14.1 Principle</h3>
      <p>USSP&rsquo;s equity stake in TeleRay shall be earned exclusively through measurable value events &mdash; not through signing this MOU, but through delivering real, verifiable results. USSP is not writing a check for equity; USSP is building a government sales channel, delivering TeleRay&rsquo;s first government installation, and opening a market that TeleRay cannot access on its own. No equity is granted until USSP delivers.</p>
      <p>Both parties acknowledge that TeleRay currently has approximately $2M in annual revenue, no positive EBITDA, and zero government installations. The equity valuations below reflect TeleRay&rsquo;s current stage and the transformative nature of the value USSP will create.</p>

      <h3>14.2 Value-Event Equity Milestones</h3>
      <p>USSP shall earn equity in TeleRay upon achieving the following milestones. Each milestone is independently triggered &mdash; equity is earned and irrevocable once the event occurs:</p>
      <table>
        <thead><tr><th>Milestone</th><th>Value Event</th><th>Equity Earned</th><th>Valuation Basis</th></tr></thead>
        <tbody>
          <tr><td><strong>1 &mdash; First Contract</strong></td><td>First signed government contract (any IL state, Cook County, or City of Chicago agency)</td><td>3&ndash;5%</td><td>Pre-contract valuation (current stage)</td></tr>
          <tr><td><strong>2 &mdash; First $500K Revenue</strong></td><td>$500,000 cumulative government revenue collected</td><td>2&ndash;3%</td><td>Valuation at time of milestone</td></tr>
          <tr><td><strong>3 &mdash; First $1M Revenue</strong></td><td>$1,000,000 cumulative government revenue collected</td><td>2%</td><td>Valuation at time of milestone</td></tr>
          <tr><td><strong>4 &mdash; $2M Revenue</strong></td><td>$2,000,000 cumulative government revenue collected</td><td>1&ndash;2%</td><td>Valuation at time of milestone</td></tr>
        </tbody>
      </table>
      <p><em>Total potential equity: 8&ndash;12%. Exact percentages within ranges to be agreed prior to MOU execution. All equity grants are priced at the applicable valuation basis, not at a future or aspirational valuation.</em></p>

      <h3>14.3 Why the First Contract Earns the Largest Grant</h3>
      <div class="m-highlight">
        <strong>TeleRay currently has zero government installations.</strong> The first signed government contract is a transformative event that:<br/>
        &bull; Delivers TeleRay&rsquo;s first-ever government customer and live installation<br/>
        &bull; Proves the platform works in a regulated government environment<br/>
        &bull; Creates the reference customer that every future state and municipality will ask for<br/>
        &bull; Moves TeleRay from &ldquo;commercial-only&rdquo; to &ldquo;government-proven&rdquo; &mdash; a category change that significantly increases company valuation<br/>
        &bull; Provides the case study that opens the door to all 50 states<br/><br/>
        <strong>For TeleRay:</strong> Zero dilution until USSP delivers an actual signed contract. No cash outlay. No risk &mdash; equity is earned only when a real government customer commits.<br/>
        <strong>For USSP:</strong> Equity reflects the full strategic value created, not just revenue. USSP&rsquo;s TOPS access, MBE/WBE certification, government relationships, and implementation capability are what make this contract possible.
      </div>

      <h3>14.4 Valuation and Pricing</h3>
      <ul>
        <li>Milestone 1 (First Contract) equity shall be priced at TeleRay&rsquo;s <strong>pre-contract valuation</strong>, reflecting the company&rsquo;s current stage ($2M revenue, no EBITDA, no government installations)</li>
        <li>Subsequent milestones shall be priced at the most recent third-party valuation event (funding round, 409A, or independent appraisal), or if none has occurred, by mutual agreement based on trailing twelve-month revenue and industry multiples</li>
        <li>USSP&rsquo;s sweat equity shall not be priced at the same valuation offered to cash investors &mdash; USSP is taking execution risk and investing time, relationships, certifications, and reputation, which warrants a discount to cash-investment valuations</li>
      </ul>

      <h3>14.5 How It Works</h3>
      <ul>
        <li>Revenue milestones are measured on cumulative IL government revenue collected (not billed)</li>
        <li>Equity vests immediately upon hitting each milestone &mdash; it is not revocable once earned</li>
        <li>USSP receives equity grant documentation (shares or membership units) within thirty (30) days of each milestone</li>
        <li>Equity is fully dilution-protected through the next funding round</li>
        <li>If TeleRay is acquired before all milestones are reached, USSP&rsquo;s earned equity participates in the acquisition proceeds, and the acquiring entity must honor all remaining milestone terms per Section 10.4</li>
      </ul>

      <h3>14.6 Board Representation</h3>
      <ul>
        <li>Upon earning Milestone 1 equity: board observer seat with full access to financials and strategic discussions</li>
        <li>Upon cumulative equity exceeding 5%: full voting board seat</li>
        <li>Regardless of equity level, TeleRay shall provide USSP with quarterly financial reports and annual audited statements</li>
      </ul>

      <h3>14.7 Cash Investment (Optional, Separate)</h3>
      <p>Any direct cash investment by USSP or IGM Fund in TeleRay shall be governed by separate agreements and is not required under this MOU. Cash investment terms (including the discussed tranches of $500K at $20M, $500K at $25M, $500K at $30M, and $500K at $35M valuations) are independent of and in addition to the value-event equity earned under this section. If USSP or IGM Fund elects to invest cash, the terms shall be negotiated separately, and cash equity shall not reduce or offset the sweat equity earned through milestones above.</p>
    </div>

    <div class="m-section">
      <h2><span class="m-num">15</span>GOVERNMENT MARKET EXPANSION ROYALTY</h2>
      <hr class="m-divider" />
      <h3>15.1 Expansion Value</h3>
      <p>Both parties acknowledge that the first IL government contract creates strategic value beyond Illinois &mdash; it provides TeleRay with a government reference customer, case study, and proof of concept that can be leveraged to enter other state and municipal markets nationwide.</p>
      <h3>15.2 Royalty on Reference-Based Expansion</h3>
      <p>If TeleRay (directly or through any other partner) closes a government contract in any state or municipality outside of Illinois within five (5) years of the first IL government contract, and that opportunity references, cites, or benefits from the IL deployment as a case study, reference customer, or proof of concept:</p>
      <ul>
        <li>USSP shall receive a royalty of 5&ndash;10% of first-year revenue from that contract</li>
        <li>If USSP directly introduces TeleRay to the out-of-state opportunity, the royalty increases to 15&ndash;20% of first-year revenue, or USSP has first right of refusal to serve as the implementation partner in that market</li>
      </ul>
      <h3>15.3 Disclosure Requirement</h3>
      <ul>
        <li>TeleRay shall disclose to USSP any government RFP, RFI, or sales opportunity where the IL deployment is cited or referenced</li>
        <li>TeleRay shall provide USSP with quarterly reports of all government pipeline activity outside of Illinois</li>
        <li>Failure to disclose shall not extinguish the royalty &mdash; if USSP later discovers an undisclosed reference-based contract, the royalty applies retroactively with interest</li>
      </ul>
      <h3>15.4 Survival</h3>
      <p>This expansion royalty obligation survives termination of this MOU and any change of control of TeleRay per Section 10.4. The acquiring entity assumes the royalty obligation for the full five-year period.</p>
    </div>

    <div class="m-section">
      <h2><span class="m-num">16</span>GENERAL PROVISIONS</h2>
      <hr class="m-divider" />
      <ul>
        <li><strong>Independent contractors:</strong> The parties are independent contractors. Nothing creates an employer-employee, partnership, or joint venture relationship.</li>
        <li><strong>Assignment:</strong> Neither party may assign this agreement without written consent, except in connection with a merger or acquisition.</li>
        <li><strong>Entire agreement:</strong> This MOU constitutes the entire agreement between the parties regarding the subject matter and supersedes all prior discussions.</li>
        <li><strong>Amendments:</strong> Any amendments must be in writing and signed by both parties.</li>
        <li><strong>Notices:</strong> All notices shall be in writing and sent to the addresses listed in Section 1.</li>
      </ul>
    </div>

    <div class="m-signatures">
      <div class="m-sig-block">
        <h3>US Software Professionals Inc.</h3>
        <div class="m-sig-line">Name: _______________</div>
        <div class="m-sig-line">Title: _______________</div>
        <div class="m-sig-line">Date: _______________</div>
        <div class="m-sig-line">Signature: _______________</div>
      </div>
      <div class="m-sig-block">
        <h3>TeleRay Inc.</h3>
        <div class="m-sig-line">Name: _______________</div>
        <div class="m-sig-line">Title: _______________</div>
        <div class="m-sig-line">Date: _______________</div>
        <div class="m-sig-line">Signature: _______________</div>
      </div>
    </div>

    <div class="m-footer">
      <p>CONFIDENTIAL &mdash; This document is for discussion purposes between US Software Professionals Inc. and TeleRay Inc. only.</p>
      <p>This is a draft MOU and does not constitute a binding legal agreement until signed by authorized representatives of both parties.</p>
      <button class="m-print-btn" onclick="window.print()">Print / Save as PDF</button>
    </div>
  </div>
</div>
`,
      }}
    />
  );
}
