"use client";

import { useState } from "react";

const PASSCODE = "jayussp";

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
      <span><strong>Version:</strong> 1.7</span>
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
        <li><strong>Demo environment</strong> &mdash; provide a fully functional demo environment for sales presentations by USSP and USSP&rsquo;s authorized government partners (including prime contractors and integration partners)</li>
        <li><strong>Technical support</strong> &mdash; respond to escalations from USSP and USSP&rsquo;s authorized government partners within:
          <ul>
            <li>Critical issues (platform down): 4 hours</li>
            <li>High priority (feature impaired): 8 hours</li>
            <li>Standard: 24 hours</li>
          </ul>
        </li>
        <li><strong>Documentation</strong> &mdash; provide current technical documentation, API access, integration guides</li>
        <li><strong>Marketing materials</strong> &mdash; authorize USSP to use TeleRay name, logo, and marketing materials in proposals to IL state and local government</li>
        <li><strong>Training</strong> &mdash; provide initial product training to USSP implementation team and USSP&rsquo;s authorized government partners (at TeleRay&rsquo;s expense)</li>
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
      <h3>10.3.1 Pipeline Compensation on Termination</h3>
      <p>Upon termination or non-renewal for any reason, USSP shall be entitled to compensation for all Pipeline Opportunities as defined below:</p>
      <ul>
        <li><strong>Definition of Pipeline Opportunity:</strong> Any prospect where USSP has, prior to the date of termination notice, (a) submitted a proposal, quote, or statement of work, (b) responded to an RFP, RFI, or RFQ, (c) conducted a product demonstration, (d) held two or more formal meetings with agency decision-makers, or (e) been identified as the vendor of record in any procurement document</li>
        <li><strong>Right to close:</strong> USSP shall have the exclusive right to continue pursuing and closing all Pipeline Opportunities for twelve (12) months following the termination effective date, under the same 80/20 revenue split and all other terms of this MOU</li>
        <li><strong>Compensation if not permitted to close:</strong> If TeleRay prevents USSP from continuing to pursue Pipeline Opportunities, or if TeleRay (directly or through any other party) closes a Pipeline Opportunity within twenty-four (24) months of termination, USSP shall be entitled to compensation equal to the projected first-year contract value at the 80/20 revenue split, calculated using the pricing proposed to the agency at the time of termination</li>
        <li><strong>Pipeline log:</strong> USSP shall maintain and share with TeleRay a written log of all Pipeline Opportunities, updated quarterly. TeleRay shall acknowledge receipt in writing. Failure by TeleRay to dispute the log within thirty (30) days of receipt constitutes acceptance</li>
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

      <h3>14.4 Fair Market Valuation Methodology</h3>
      <p>Both parties acknowledge that TeleRay has communicated an aspirational valuation of $20M. However, the parties agree that all equity transactions under this MOU shall be priced using an objective, industry-standard Fair Market Valuation (&ldquo;FMV&rdquo;) methodology, not aspirational or self-reported valuations.</p>

      <h3>14.4.1 Valuation Formula</h3>
      <div class="m-highlight">
        <strong>Fair Market Valuation = Trailing 12-Month Revenue &times; Applicable Revenue Multiple</strong><br/><br/>
        The applicable revenue multiple shall be determined by TeleRay&rsquo;s stage using the following industry-standard SaaS healthtech benchmarks:
      </div>
      <table>
        <thead><tr><th>Company Stage</th><th>Criteria</th><th>Revenue Multiple</th></tr></thead>
        <tbody>
          <tr><td>Pre-revenue / Seed</td><td>No meaningful ARR, pre-product-market fit</td><td>1&ndash;3x</td></tr>
          <tr><td><strong>Early Revenue, Pre-profit</strong></td><td><strong>$1&ndash;5M ARR, negative EBITDA, limited installations, concentrated revenue</strong></td><td><strong>3&ndash;5x</strong></td></tr>
          <tr><td>Growing, Installed</td><td>$5&ndash;15M ARR, multiple verticals, reference customers, path to profit</td><td>5&ndash;8x</td></tr>
          <tr><td>Profitable, Scaling</td><td>$15M+ ARR, positive EBITDA, diversified revenue, government contracts</td><td>8&ndash;12x</td></tr>
          <tr><td>Category Leader</td><td>$50M+ ARR, dominant market position, high retention, multi-market</td><td>12&ndash;20x</td></tr>
        </tbody>
      </table>

      <h3>14.4.2 TeleRay Current-Stage Assessment</h3>
      <p>As of the date of this MOU, TeleRay&rsquo;s metrics place it in the <strong>&ldquo;Early Revenue, Pre-profit&rdquo;</strong> category:</p>
      <table>
        <thead><tr><th>Metric</th><th>TeleRay Current</th><th>What $20M (10x) Would Require</th></tr></thead>
        <tbody>
          <tr><td>Annual Recurring Revenue</td><td>~$2M</td><td>$2M at 10x &mdash; top-decile multiple for this stage</td></tr>
          <tr><td>EBITDA</td><td>Negative (cash burn)</td><td>Positive or near-breakeven</td></tr>
          <tr><td>Government Installations</td><td>Zero</td><td>Multiple reference customers</td></tr>
          <tr><td>Revenue Diversification</td><td>Concentrated in radiology</td><td>Multiple verticals (telehealth, PACS, remote)</td></tr>
          <tr><td>Net Revenue Retention</td><td>Not disclosed</td><td>&gt;120% NRR typical for 10x</td></tr>
          <tr><td>Competitive Moat</td><td>Moderate (crowded telehealth market)</td><td>Clear differentiation, switching costs</td></tr>
          <tr><td>Government Market Access</td><td>None (requires USSP)</td><td>Established govt channel</td></tr>
        </tbody>
      </table>
      <div class="m-highlight">
        <strong>Fair Market Valuation at current stage:</strong><br/>
        &bull; Conservative (3x): $2M &times; 3 = <strong>$6M</strong><br/>
        &bull; Fair (4x): $2M &times; 4 = <strong>$8M</strong><br/>
        &bull; Generous (5x): $2M &times; 5 = <strong>$10M</strong><br/><br/>
        <strong>TeleRay&rsquo;s $20M ask implies a 10x multiple</strong> &mdash; a valuation typically reserved for companies with proven growth, positive EBITDA, diversified revenue, and established enterprise/government customers. TeleRay currently meets none of these criteria.<br/><br/>
        <strong>The gap between $8&ndash;10M (current FMV) and $20M (aspirational) represents future value that USSP&rsquo;s work is expected to create.</strong> USSP should not pay for value it has not yet built.
      </div>

      <h3>14.4.3 Sweat Equity Valuation</h3>
      <ul>
        <li><strong>Milestone 1 (First Contract):</strong> Equity shall be priced at the FMV determined by the methodology above &mdash; estimated at <strong>$8&ndash;10M</strong> (4&ndash;5x current ARR). This is the &ldquo;Baseline Valuation&rdquo; for all subsequent calculations</li>
        <li><strong>Sweat equity discount principle:</strong> Sweat equity shall never be priced at the same valuation as cash investment. USSP is taking execution risk and investing time, government relationships, MBE/WBE/DBE certifications, TOPS contract access, and institutional reputation. Cash investors write a check and wait; USSP builds the market. This warrants a minimum <strong>forty percent (40%) discount</strong> to any cash-investor valuation</li>
        <li><strong>Cash investment valuation (separate):</strong> If USSP or IGM Fund elects to invest cash, those terms may be negotiated from TeleRay&rsquo;s proposed $20M valuation per Section 14.8. Cash investment and sweat equity are independent &mdash; the $20M figure does not apply to value-event milestones</li>
        <li>Subsequent milestones shall be priced at the most recent third-party valuation event (funding round, 409A, or independent appraisal), or if none has occurred, by the FMV formula above using trailing twelve-month revenue and the applicable stage multiple, subject to the cap and discount in Section 14.4.4</li>
      </ul>

      <h3>14.4.4 Valuation Dispute Resolution</h3>
      <ul>
        <li>If the parties cannot agree on the FMV for any equity event, either party may request an independent valuation by a mutually agreed third-party appraiser (CPA firm or valuation firm with SaaS healthtech experience)</li>
        <li>The appraiser shall use the revenue-multiple methodology defined in Section 14.4.1, supplemented by comparable transaction analysis and discounted cash flow if appropriate</li>
        <li>Costs of the independent valuation shall be shared equally</li>
        <li>The independent valuation shall be binding for the specific equity event in question</li>
        <li>Neither party may use a self-reported or aspirational valuation as a basis for equity pricing under this MOU</li>
      </ul>

      <h3>14.4.5 Valuation Lock and USSP-Created Value Discount</h3>
      <p>Both parties acknowledge that increases in TeleRay&rsquo;s valuation resulting from IL government contracts are directly attributable to USSP&rsquo;s sales effort, government relationships, and implementation work. To prevent USSP from being penalized for the value it creates:</p>
      <ul>
        <li><strong>Valuation cap on subsequent milestones:</strong> The valuation used to price Milestones 2, 3, and 4 shall not exceed two times (2x) the valuation used for Milestone 1, regardless of TeleRay&rsquo;s market valuation at the time. If TeleRay&rsquo;s valuation at the time of a subsequent milestone exceeds this cap, USSP receives equity at the capped valuation</li>
        <li><strong>USSP-created value discount:</strong> For any milestone where the valuation increase since the prior milestone is primarily attributable to IL government revenue generated by USSP, USSP shall receive equity at a <strong>forty percent (40%) discount</strong> to the applicable valuation, reflecting that USSP&rsquo;s own work drove the increase</li>
        <li><strong>Valuation lock election:</strong> At the time of Milestone 1, USSP may elect to lock the valuation for all subsequent milestones at the Milestone 1 valuation, forgoing any adjustment. This election is irrevocable once made and must be communicated in writing within sixty (60) days of the Milestone 1 equity grant</li>
        <li><strong>Independent valuation:</strong> If the parties cannot agree on valuation for any milestone, either party may request an independent valuation by a mutually agreed third-party appraiser, with costs shared equally</li>
      </ul>

      <h3>14.5 How It Works</h3>
      <ul>
        <li>Revenue milestones are measured on cumulative IL government revenue collected (not billed)</li>
        <li>Equity vests immediately upon hitting each milestone &mdash; it is not revocable once earned</li>
        <li>USSP receives equity grant documentation (shares or membership units) within thirty (30) days of each milestone</li>
        <li>Equity is fully dilution-protected through the next funding round</li>
        <li>If TeleRay is acquired before all milestones are reached, USSP&rsquo;s earned equity participates in the acquisition proceeds, and the acquiring entity must honor all remaining milestone terms per Section 10.4</li>
      </ul>
      <h3>14.5.1 Pro-Rata Acceleration on Exit</h3>
      <p>If this MOU is terminated, not renewed, or if TeleRay undergoes a change of control (per Section 10.4) before all equity milestones have been reached, USSP shall receive <strong>pro-rata equity credit</strong> for progress toward the next unearned milestone:</p>
      <ul>
        <li><strong>Calculation:</strong> Pro-rata equity = (cumulative revenue toward next milestone &divide; milestone revenue target) &times; equity grant for that milestone. For example, if the next milestone is $500,000 and USSP has generated $400,000, USSP earns 80% of that milestone&rsquo;s equity grant</li>
        <li><strong>Valuation for accelerated equity:</strong> Pro-rata equity earned under this section shall be priced at the <strong>lower of</strong> (a) the valuation applicable to the milestone being accelerated per Section 14.4, or (b) the valuation implied by the acquisition price in a change-of-control event</li>
        <li><strong>Pipeline revenue credit:</strong> For purposes of calculating pro-rata acceleration, Pipeline Opportunities (as defined in Section 10.3.1) shall be counted at their projected first-year contract value as if collected, recognizing that USSP built the pipeline and would have closed these opportunities absent the termination or exit event</li>
        <li><strong>Issuance:</strong> Pro-rata equity shall be issued within thirty (30) days of the termination effective date or change-of-control closing date, whichever is applicable</li>
        <li><strong>Acquisition proceeds:</strong> In a change-of-control event, all pro-rata accelerated equity (including pipeline-credited equity) shall participate in the acquisition proceeds on the same terms as all other equity earned under this section</li>
      </ul>

      <h3>14.6 Valuation Appreciation Rights (VAR)</h3>
      <p>In addition to equity milestones, USSP shall receive direct compensation for the enterprise value increase it creates through government market development. This is separate from and in addition to the equity earned under Section 14.2.</p>
      <h3>14.6.1 VAR Formula</h3>
      <div class="m-highlight">
        <strong>VAR Payment = (Current Valuation &minus; Baseline Valuation) &times; 15%</strong><br/><br/>
        <strong>Baseline Valuation:</strong> The sweat equity valuation established at MOU execution (per Section 14.4), locked for the life of this agreement<br/>
        <strong>Current Valuation:</strong> Determined by the most recent third-party valuation event (funding round, 409A, acquisition offer, or independent appraisal)<br/>
        <strong>VAR Percentage:</strong> 15% of the valuation increase
      </div>
      <h3>14.6.2 VAR Trigger Events</h3>
      <p>VAR payments are calculated and owed upon any of the following events:</p>
      <ul>
        <li><strong>Milestone events:</strong> Each time an equity milestone (Section 14.2) is achieved, the VAR is calculated based on the valuation at that point versus baseline</li>
        <li><strong>Funding rounds:</strong> Any equity financing round that establishes a new company valuation</li>
        <li><strong>Change of control:</strong> Any acquisition, merger, or change of control (per Section 10.4) &mdash; VAR is calculated based on the transaction price</li>
        <li><strong>Annual valuation:</strong> If no trigger event occurs in a given year, VAR shall be calculated annually based on a mutually agreed valuation or independent appraisal</li>
      </ul>
      <h3>14.6.3 VAR Payment Method</h3>
      <ul>
        <li>VAR may be paid in <strong>additional equity</strong> (at the current valuation) or <strong>cash</strong>, at USSP&rsquo;s election</li>
        <li>If paid in equity, the shares or units are issued within thirty (30) days of the trigger event</li>
        <li>If paid in cash, payment is due within sixty (60) days of the trigger event</li>
        <li>In a change-of-control event, VAR shall be paid in cash from the transaction proceeds at closing</li>
      </ul>
      <h3>14.6.4 VAR Example</h3>
      <table>
        <thead><tr><th>Event</th><th>Valuation</th><th>Increase from Baseline</th><th>VAR (15%)</th><th>Cumulative VAR</th></tr></thead>
        <tbody>
          <tr><td>Baseline (MOU signing)</td><td>$8M</td><td>&mdash;</td><td>&mdash;</td><td>&mdash;</td></tr>
          <tr><td>Milestone 1 (First Contract)</td><td>$20M</td><td>$12M</td><td>$1,800,000</td><td>$1,800,000</td></tr>
          <tr><td>Milestone 2 ($500K Revenue)</td><td>$28M</td><td>$8M</td><td>$1,200,000</td><td>$3,000,000</td></tr>
          <tr><td>Milestone 3 ($1M Revenue)</td><td>$38M</td><td>$10M</td><td>$1,500,000</td><td>$4,500,000</td></tr>
          <tr><td>Milestone 4 ($2M Revenue)</td><td>$50M</td><td>$12M</td><td>$1,800,000</td><td>$6,300,000</td></tr>
        </tbody>
      </table>
      <h3>14.6.5 VAR Survival</h3>
      <ul>
        <li>VAR obligations survive termination of this MOU for five (5) years from the effective date</li>
        <li>VAR obligations are binding on any successor entity in a change of control per Section 10.4</li>
        <li>Accrued but unpaid VAR at the time of termination shall be paid within sixty (60) days</li>
      </ul>

      <h3>14.7 Board Representation</h3>
      <ul>
        <li>Upon earning Milestone 1 equity: board observer seat with full access to financials and strategic discussions</li>
        <li>Upon cumulative equity exceeding 5%: full voting board seat</li>
        <li>Regardless of equity level, TeleRay shall provide USSP with quarterly financial reports and annual audited statements</li>
      </ul>

      <h3>14.8 Cash Investment (Optional, Separate)</h3>
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
      <h2><span class="m-num">16</span>ENFORCEMENT AND REMEDIES</h2>
      <hr class="m-divider" />
      <h3>16.1 Audit Rights</h3>
      <ul>
        <li>USSP shall have the right, upon fifteen (15) days written notice, to audit TeleRay&rsquo;s books, records, and systems to verify: (a) revenue reporting accuracy, (b) compliance with lead routing obligations, (c) compliance with exclusivity and non-compete provisions, (d) government pipeline activity outside Illinois, and (e) any other obligation under this MOU</li>
        <li>TeleRay shall have the right, upon fifteen (15) days written notice, to audit USSP&rsquo;s revenue collection and royalty payment records</li>
        <li>Audits may be conducted by the requesting party or a mutually agreed independent auditor, up to twice per calendar year</li>
        <li>If an audit reveals a discrepancy of more than five percent (5%) in any reporting period, the audited party shall bear all costs of the audit and immediately cure the discrepancy with interest at 1.5% per month from the date the payment or obligation was originally due</li>
      </ul>
      <h3>16.2 Financial Reporting and Transparency</h3>
      <ul>
        <li>TeleRay shall provide USSP with quarterly financial statements (P&amp;L, balance sheet, cash flow) within thirty (30) days of each quarter end</li>
        <li>TeleRay shall provide annual audited financial statements within ninety (90) days of fiscal year end</li>
        <li>TeleRay shall notify USSP in writing within five (5) business days of: (a) any inbound IL government inquiry, (b) any government pipeline activity outside Illinois, (c) any change in ownership exceeding 10%, (d) any material litigation, regulatory action, or insolvency event</li>
        <li>Failure to provide required reports within the stated timeframes shall constitute a material breach subject to the penalties in Section 16.4</li>
      </ul>
      <h3>16.3 Exclusivity Enforcement</h3>
      <ul>
        <li>If TeleRay breaches exclusivity (Section 4) by selling directly, appointing another partner, or failing to route leads within Illinois state and local government, USSP shall be entitled to: (a) all revenue from the improperly sourced contract as if USSP had closed it at the 80/20 split, plus (b) a penalty equal to fifty percent (50%) of first-year contract revenue, plus (c) the right to terminate this MOU and trigger all pipeline compensation (Section 10.3.1) and pro-rata equity acceleration (Section 14.5.1)</li>
        <li>If TeleRay breaches Introduction Protection (Section 4.4) by engaging another party for an introduced customer, USSP shall be entitled to the same remedies as an exclusivity breach, calculated on the full four-year projected revenue from that customer</li>
      </ul>
      <h3>16.4 Equity Issuance Enforcement</h3>
      <ul>
        <li>If TeleRay fails to issue equity grant documentation within thirty (30) days of a milestone event (per Section 14.5), USSP shall provide written notice demanding issuance</li>
        <li>If TeleRay fails to cure within fifteen (15) days of such notice, USSP shall be entitled to: (a) the equity grant at a twenty percent (20%) discount to the applicable valuation as a penalty, (b) interest on the equity value at 1.5% per month from the milestone date, and (c) the right to seek specific performance through arbitration (Section 13) on an expedited basis</li>
        <li>Repeated failure (two or more instances) to timely issue equity shall entitle USSP to accelerate all remaining milestones and receive the full 8&ndash;12% equity immediately at the Milestone 1 valuation</li>
      </ul>
      <h3>16.5 Royalty and Revenue Split Enforcement</h3>
      <ul>
        <li>If USSP fails to remit TeleRay&rsquo;s 20% royalty within thirty (30) days of receiving customer payment, TeleRay shall provide written notice. If USSP fails to cure within fifteen (15) days, interest accrues at 1.5% per month from the original due date</li>
        <li>If TeleRay receives revenue from an IL government customer directly (in violation of exclusivity), TeleRay shall remit USSP&rsquo;s 80% share within fifteen (15) days of collection, plus the exclusivity breach penalty per Section 16.3</li>
      </ul>
      <h3>16.6 Injunctive Relief</h3>
      <p>Both parties acknowledge that breaches of exclusivity (Section 4), confidentiality (Section 9), non-solicitation (Section 11), or equity obligations (Section 14) would cause irreparable harm not adequately compensable by monetary damages. Either party may seek immediate injunctive relief from a court of competent jurisdiction in Cook County, Illinois, without the requirement to post bond, in addition to any other remedies available under this MOU or at law.</p>
      <h3>16.7 Attorneys&rsquo; Fees</h3>
      <p>In any dispute arising under this MOU, the prevailing party shall be entitled to recover reasonable attorneys&rsquo; fees and costs from the non-prevailing party.</p>
    </div>

    <div class="m-section">
      <h2><span class="m-num">17</span>GENERAL PROVISIONS</h2>
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

    <div class="m-section">
      <h2><span class="m-num">18</span>DOCUMENT VERSION HISTORY</h2>
      <hr class="m-divider" />
      <p>This MOU is a living document during the draft and negotiation phase. All revisions shall be tracked below. Upon execution, the signed version becomes the controlling document and subsequent changes require a formal amendment per Section 17.</p>
      <table>
        <thead><tr><th>Version</th><th>Date</th><th>Author</th><th>Changes</th></tr></thead>
        <tbody>
          <tr><td>1.0</td><td>March 2026</td><td>USSP</td><td>Initial draft &mdash; core commercial terms, revenue split, exclusivity, equity milestones</td></tr>
          <tr><td>1.1</td><td>March 2026</td><td>USSP</td><td>Expanded target customers to include Cook County and City of Chicago; added Introduction Protection (4.4); extended term to 5 years; added Change of Control provisions (10.4); added Government Market Expansion Royalty (Section 15)</td></tr>
          <tr><td>1.2</td><td>March 2026</td><td>USSP</td><td>Restructured equity to value-event milestones (Section 14.2); added valuation rationale (14.3); added board representation (14.6); separated cash investment (14.7)</td></tr>
          <tr><td>1.3</td><td>March 2026</td><td>USSP</td><td>Added Pipeline Compensation on Termination (10.3.1); added Valuation Lock and USSP-Created Value Discount (14.4.1); added Pro-Rata Acceleration on Exit (14.5.1)</td></tr>
          <tr><td>1.4</td><td>March 2026</td><td>USSP</td><td>Added Enforcement and Remedies (Section 16) &mdash; audit rights, financial reporting, exclusivity enforcement, equity issuance enforcement, royalty enforcement, injunctive relief, attorneys&rsquo; fees. Added document versioning.</td></tr>
          <tr><td>1.5</td><td>March 2026</td><td>USSP</td><td>Addressed TeleRay&rsquo;s $20M valuation ask &mdash; established sweat equity valuation at $8&ndash;10M (3&ndash;5x ARR) separate from cash investment valuation. Added Valuation Appreciation Rights (Section 14.6) with 15% VAR formula, trigger events, payment methods, and worked example. Renumbered subsections.</td></tr>
          <tr><td>1.6</td><td>March 2026</td><td>USSP</td><td>Added Fair Market Valuation Methodology (Section 14.4) &mdash; industry-standard revenue multiple table, TeleRay current-stage assessment showing $20M is inflated (10x vs. fair 3&ndash;5x), FMV formula (TTM Revenue &times; Stage Multiple), sweat equity discount principle (40% minimum discount to cash valuations), valuation dispute resolution with binding independent appraisal. Renumbered subsections 14.4.1&ndash;14.4.5.</td></tr>
          <tr><td><strong>1.7</strong></td><td><strong>March 2026</strong></td><td><strong>USSP</strong></td><td><strong>Added Appendix A &mdash; Capital Raise Facilitation ($2M Growth Fund). Milestone-gated 4-tranche structure ($500K each), USSP as placement agent (5% cash fee + 2% equity kicker + 1% advisory equity), investor tail provision (24 months), use-of-funds controls, tranche valuations tied to FMV methodology. Appendix is independently detachable with its own signature block.</strong></td></tr>
        </tbody>
      </table>
      <h3>18.1 Review Schedule</h3>
      <ul>
        <li><strong>Pre-execution review:</strong> Both parties shall review and provide written comments on each draft version within ten (10) business days of receipt</li>
        <li><strong>Annual review:</strong> Following execution, both parties shall conduct a formal review of this MOU annually on or near the anniversary of the effective date to assess whether amendments are needed</li>
        <li><strong>Triggered review:</strong> Either party may request an immediate review upon: (a) a material change in business conditions, (b) a change in applicable law or regulation, (c) a dispute or near-dispute arising from ambiguous terms, or (d) completion of a major milestone (e.g., first government contract signed)</li>
        <li><strong>Review process:</strong> Each review shall produce a written summary of proposed changes (if any), agreed upon by both parties, before any amendment is drafted</li>
      </ul>
    </div>

    <div class="m-footer">
      <p>CONFIDENTIAL &mdash; This document is for discussion purposes between US Software Professionals Inc. and TeleRay Inc. only.</p>
      <p>This is a draft MOU and does not constitute a binding legal agreement until signed by authorized representatives of both parties.</p>
      <p style="margin-top:8px;font-size:10px;color:#64748b;">Document Version 1.7 &mdash; March 2026</p>
      <button class="m-print-btn" onclick="window.print()">Print / Save as PDF</button>
    </div>

    <!-- ===== APPENDIX A — DETACHABLE ===== -->
    <div style="border-top:3px solid #2563eb;margin-top:40px;padding-top:8px;"></div>
    <div class="m-header" style="padding:32px 24px;">
      <h1 style="font-size:20px;">APPENDIX A</h1>
      <p class="m-subtitle">Capital Raise Facilitation &mdash; $2M Growth Fund</p>
      <div class="m-meta">
        <span><strong>Status:</strong> Optional &mdash; Detachable from Core MOU</span>
        <span><strong>Version:</strong> 1.0</span>
      </div>
      <div class="confidential">CONFIDENTIAL</div>
    </div>

    <div class="m-body">
      <div class="m-purpose">
        This Appendix is an optional, independent addendum to the MOU between USSP and TeleRay. It may be included, excluded, or modified without affecting the validity or enforceability of the core MOU (Sections 1&ndash;18). If this Appendix conflicts with the core MOU, the core MOU shall govern.
      </div>

      <div class="m-section">
        <h2><span class="m-num">A1</span>BACKGROUND AND PURPOSE</h2>
        <hr class="m-divider" />
        <p>TeleRay has requested USSP&rsquo;s assistance in raising <strong>$2,000,000 in growth capital</strong> to fund marketing expansion, platform development, and go-to-market activities necessary to support the IL government partnership and broader commercialization. USSP has agreed to facilitate this capital raise through its investor network, including but not limited to IGM Fund and other strategic investors.</p>
        <p>Both parties acknowledge that capital raise facilitation is a separate service from the reseller/implementation partnership and the sweat equity arrangement defined in the core MOU. USSP&rsquo;s compensation for fundraising efforts is defined in this Appendix and is independent of all other compensation under the core MOU.</p>
      </div>

      <div class="m-section">
        <h2><span class="m-num">A2</span>CAPITAL RAISE STRUCTURE</h2>
        <hr class="m-divider" />
        <h3>A2.1 Total Raise</h3>
        <p>$2,000,000 in four (4) milestone-gated tranches of $500,000 each.</p>
        <h3>A2.2 Tranche Schedule</h3>
        <table>
          <thead><tr><th>Tranche</th><th>Amount</th><th>Release Trigger</th><th>Intended Use</th></tr></thead>
          <tbody>
            <tr><td><strong>Tranche 1</strong></td><td>$500,000</td><td>MOU execution and completion of investor documentation</td><td>Initial marketing campaign, sales collateral, demo environment buildout, government compliance preparation</td></tr>
            <tr><td><strong>Tranche 2</strong></td><td>$500,000</td><td>First signed IL government contract (Milestone 1)</td><td>Implementation support, platform enhancements for government requirements, expanded sales team</td></tr>
            <tr><td><strong>Tranche 3</strong></td><td>$500,000</td><td>$500K cumulative government revenue collected (Milestone 2)</td><td>Platform scaling, additional agency onboarding, marketing for expansion</td></tr>
            <tr><td><strong>Tranche 4</strong></td><td>$500,000</td><td>$1M cumulative government revenue collected (Milestone 3)</td><td>National expansion preparation, additional product development, multi-state go-to-market</td></tr>
          </tbody>
        </table>
        <h3>A2.3 Milestone Gating</h3>
        <ul>
          <li>Each tranche is released <strong>only upon achievement</strong> of its trigger milestone &mdash; no tranche is guaranteed</li>
          <li>Investors commit to the full $2M but fund in tranches &mdash; standard milestone-gated venture structure</li>
          <li>If a milestone is not achieved within twenty-four (24) months of the prior tranche release, the remaining unfunded tranches may be cancelled at the investors&rsquo; discretion</li>
          <li>Milestone verification shall use the same definitions and measurement criteria as the core MOU (Sections 14.2 and 14.5)</li>
        </ul>
      </div>

      <div class="m-section">
        <h2><span class="m-num">A3</span>USSP&rsquo;S ROLE IN CAPITAL RAISE</h2>
        <hr class="m-divider" />
        <h3>A3.1 Scope of Facilitation</h3>
        <p>USSP shall serve as the <strong>lead facilitator and placement agent</strong> for this capital raise. USSP&rsquo;s role includes:</p>
        <ul>
          <li><strong>Investor introductions:</strong> Introduce TeleRay to qualified investors from USSP&rsquo;s network, including IGM Fund, strategic healthcare investors, and government-focused venture capital</li>
          <li><strong>Materials preparation:</strong> Assist TeleRay in preparing investor-ready materials &mdash; pitch deck, financial model, government market analysis, and growth projections</li>
          <li><strong>Negotiation support:</strong> Participate in investor meetings and assist with term sheet negotiations</li>
          <li><strong>Due diligence coordination:</strong> Facilitate investor due diligence process, leveraging USSP&rsquo;s knowledge of TeleRay&rsquo;s government pipeline and market opportunity</li>
          <li><strong>Closing support:</strong> Coordinate legal documentation and closing logistics</li>
        </ul>
        <h3>A3.2 USSP Is Not the Investor</h3>
        <p>USSP&rsquo;s role under this Appendix is as a <strong>fundraising facilitator</strong>, not as the source of capital. USSP may elect to invest its own capital (or through IGM Fund) per Section 14.8 of the core MOU, but any such investment is independent and voluntary. USSP has no obligation to personally fund any tranche.</p>
      </div>

      <div class="m-section">
        <h2><span class="m-num">A4</span>USSP COMPENSATION FOR CAPITAL RAISE</h2>
        <hr class="m-divider" />
        <p>USSP shall be compensated for its fundraising facilitation services as follows:</p>
        <h3>A4.1 Finder&rsquo;s / Placement Fee</h3>
        <table>
          <thead><tr><th>Component</th><th>Rate</th><th>Basis</th><th>Estimated Value</th></tr></thead>
          <tbody>
            <tr><td><strong>Cash fee</strong></td><td>5% of capital raised</td><td>Paid from each tranche at closing</td><td>$100,000 (on full $2M)</td></tr>
            <tr><td><strong>Equity kicker</strong></td><td>2% of capital raised, converted to equity</td><td>At the tranche valuation</td><td>Additional equity per tranche</td></tr>
          </tbody>
        </table>
        <ul>
          <li>Cash fee is paid to USSP from the tranche proceeds at the time of each tranche closing &mdash; not from TeleRay&rsquo;s operating funds</li>
          <li>Equity kicker is issued to USSP within thirty (30) days of each tranche closing at the same valuation offered to the tranche investors</li>
          <li>Fees apply to all capital raised through USSP&rsquo;s introductions, even if the investor subsequently invests in later rounds without USSP&rsquo;s direct involvement (tail provision &mdash; see A4.3)</li>
        </ul>
        <h3>A4.2 Advisory Equity</h3>
        <ul>
          <li>In addition to the placement fee, USSP shall receive a one-time <strong>advisory equity grant of 1%</strong> of TeleRay for structuring and leading the capital raise</li>
          <li>Advisory equity is priced at the Tranche 1 valuation and vests upon successful closing of Tranche 1</li>
          <li>This advisory equity is in addition to and independent of all sweat equity, VAR, and cash investment equity under the core MOU</li>
        </ul>
        <h3>A4.3 Investor Tail Provision</h3>
        <ul>
          <li>If any investor introduced by USSP invests in TeleRay within <strong>twenty-four (24) months</strong> of the introduction &mdash; whether in this raise or any subsequent round &mdash; USSP&rsquo;s 5% cash fee and 2% equity kicker apply to that investment</li>
          <li>USSP shall maintain a written log of all investor introductions, shared with TeleRay at the time of introduction</li>
          <li>This tail provision survives termination of both this Appendix and the core MOU</li>
        </ul>
      </div>

      <div class="m-section">
        <h2><span class="m-num">A5</span>USE OF FUNDS AND REPORTING</h2>
        <hr class="m-divider" />
        <h3>A5.1 Approved Use of Funds</h3>
        <p>Capital raised under this Appendix shall be used <strong>exclusively</strong> for the purposes identified in each tranche (Section A2.2). TeleRay shall not redirect tranche funds to unrelated purposes without written approval from USSP and the participating investors.</p>
        <h3>A5.2 Financial Reporting</h3>
        <ul>
          <li>TeleRay shall provide USSP and participating investors with <strong>monthly use-of-funds reports</strong> showing: amount remaining per tranche, expenditures by category, variance from intended use</li>
          <li>TeleRay shall provide quarterly financial statements (P&amp;L, balance sheet, cash flow) per Section 16.2 of the core MOU</li>
          <li>If TeleRay depletes a tranche more than thirty percent (30%) faster than projected without proportional results, USSP and investors may request a review meeting before the next tranche is released</li>
        </ul>
        <h3>A5.3 Misuse of Funds</h3>
        <p>If TeleRay materially misuses tranche funds (defined as redirecting more than 20% of a tranche to purposes outside the approved use), USSP and investors shall have the right to: (a) suspend release of subsequent tranches, (b) demand return of misused amounts, and (c) accelerate all equity and compensation provisions under both this Appendix and the core MOU.</p>
      </div>

      <div class="m-section">
        <h2><span class="m-num">A6</span>INVESTOR TERMS AND VALUATION</h2>
        <hr class="m-divider" />
        <h3>A6.1 Tranche Valuations</h3>
        <p>Each tranche shall be priced at the <strong>Fair Market Valuation</strong> determined by the methodology in Section 14.4 of the core MOU at the time of tranche closing, subject to the following:</p>
        <table>
          <thead><tr><th>Tranche</th><th>Valuation Basis</th><th>Estimated Range</th></tr></thead>
          <tbody>
            <tr><td><strong>Tranche 1</strong></td><td>Current FMV (pre-contract)</td><td>$8&ndash;10M</td></tr>
            <tr><td><strong>Tranche 2</strong></td><td>Post-first-contract FMV</td><td>$15&ndash;20M (government-proven)</td></tr>
            <tr><td><strong>Tranche 3</strong></td><td>FMV at $500K govt revenue</td><td>$20&ndash;28M</td></tr>
            <tr><td><strong>Tranche 4</strong></td><td>FMV at $1M govt revenue</td><td>$28&ndash;38M</td></tr>
          </tbody>
        </table>
        <p><em>Step-up valuations reflect real value creation at each milestone &mdash; investors in later tranches pay a higher price because USSP has de-risked the business.</em></p>
        <h3>A6.2 Investor Rights</h3>
        <ul>
          <li>Standard minority investor protections: pro-rata rights, information rights, anti-dilution (weighted average)</li>
          <li>Investors receive the same quarterly reporting as USSP (per Section 16.2 of core MOU)</li>
          <li>Specific investor terms (SAFE, convertible note, or equity purchase) to be documented in separate investment agreements</li>
        </ul>
        <h3>A6.3 USSP&rsquo;s Investment Right</h3>
        <ul>
          <li>USSP (or IGM Fund) shall have <strong>first right to participate</strong> in each tranche before outside investors</li>
          <li>USSP may invest in any or all tranches, in any amount up to the full tranche</li>
          <li>If USSP invests its own cash, the placement fee (A4.1) does not apply to USSP&rsquo;s own investment &mdash; only to capital raised from third-party investors</li>
          <li>USSP&rsquo;s cash investment equity is separate from and in addition to sweat equity, VAR, and advisory equity</li>
        </ul>
      </div>

      <div class="m-section">
        <h2><span class="m-num">A7</span>TERM AND DETACHABILITY</h2>
        <hr class="m-divider" />
        <ul>
          <li>This Appendix becomes effective only when signed by both parties, independent of the core MOU execution date</li>
          <li>Either party may remove this Appendix from the MOU by written notice prior to the closing of Tranche 1, with no effect on the core MOU</li>
          <li>Once Tranche 1 closes, this Appendix cannot be unilaterally removed &mdash; modification requires written agreement of both parties and any participating investors</li>
          <li>If the core MOU is terminated, obligations under closed tranches survive (reporting, use of funds, investor tail). Unfunded tranches are cancelled unless investors elect to proceed independently</li>
          <li>USSP&rsquo;s compensation for capital raise facilitation (Section A4) survives termination of both this Appendix and the core MOU for the duration of the investor tail period (24 months)</li>
        </ul>
      </div>

      <div class="m-signatures">
        <div class="m-sig-block">
          <h3>US Software Professionals Inc.</h3>
          <p style="font-size:12px;color:#64748b;margin-bottom:12px;">Appendix A &mdash; Capital Raise Facilitation</p>
          <div class="m-sig-line">Name: _______________</div>
          <div class="m-sig-line">Title: _______________</div>
          <div class="m-sig-line">Date: _______________</div>
          <div class="m-sig-line">Signature: _______________</div>
        </div>
        <div class="m-sig-block">
          <h3>TeleRay Inc.</h3>
          <p style="font-size:12px;color:#64748b;margin-bottom:12px;">Appendix A &mdash; Capital Raise Facilitation</p>
          <div class="m-sig-line">Name: _______________</div>
          <div class="m-sig-line">Title: _______________</div>
          <div class="m-sig-line">Date: _______________</div>
          <div class="m-sig-line">Signature: _______________</div>
        </div>
      </div>

      <div class="m-footer">
        <p>APPENDIX A &mdash; This appendix is an optional, detachable addendum to the USSP&ndash;TeleRay MOU.</p>
        <p>Appendix A Version 1.0 &mdash; March 2026</p>
      </div>
    </div>
    <!-- ===== END APPENDIX A ===== -->
  </div>
</div>
`,
      }}
    />
  );
}
