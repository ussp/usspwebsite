export const dynamic = "force-dynamic";

import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function TeleRayPartnershipPage() {
  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14">
        <div
          dangerouslySetInnerHTML={{
            __html: `
<style>
  .brief * { box-sizing: border-box; margin: 0; padding: 0; }
  .brief { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1a1a1a; line-height: 1.6; }
  .brief .b-header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #fff; padding: 40px 32px; }
  .brief .b-header-inner { max-width: 900px; margin: 0 auto; }
  .brief .b-header-label { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #93c5fd; margin-bottom: 8px; }
  .brief .b-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .brief .b-header p { font-size: 14px; color: #bfdbfe; max-width: 700px; }
  .brief .b-header-meta { margin-top: 16px; display: flex; gap: 24px; flex-wrap: wrap; }
  .brief .b-header-meta span { font-size: 12px; color: #93c5fd; }
  .brief .b-header-meta strong { color: #fff; }
  .brief .confidential { margin-top: 16px; display: inline-block; background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 12px; border-radius: 4px; }
  .brief .b-page { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
  .brief .b-section { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 28px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .brief .b-section h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .brief .b-section .b-subtitle { font-size: 13px; color: #64748b; margin-bottom: 20px; }
  .brief .b-section h3 { font-size: 14px; font-weight: 700; color: #1e3a8a; margin: 20px 0 8px; }
  .brief .b-section p, .brief .b-section li { font-size: 13px; color: #334155; }
  .brief .b-section ul { padding-left: 20px; margin: 8px 0; }
  .brief .b-section li { margin-bottom: 6px; }
  .brief table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }
  .brief th { background: #f1f5f9; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: #475569; padding: 10px 14px; text-align: left; border-bottom: 2px solid #e2e8f0; }
  .brief td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; }
  .brief tr:last-child td { border-bottom: none; }
  .brief .b-highlight { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .brief .b-highlight p { font-size: 13px; color: #1e40af; }
  .brief .b-highlight strong { color: #1e3a8a; }
  .brief .b-warn { background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .brief .b-warn p { font-size: 13px; color: #92400e; }
  .brief .b-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; margin: 16px 0; }
  .brief .b-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
  .brief .b-card h4 { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .brief .b-card p { font-size: 12px; color: #475569; }
  .brief .b-tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
  .brief .b-tag-blue { background: #dbeafe; color: #1e40af; }
  .brief .b-tag-green { background: #d1fae5; color: #065f46; }
  .brief .b-tag-amber { background: #fef3c7; color: #92400e; }
  .brief .b-priority-num { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #1e3a8a; color: #fff; font-size: 12px; font-weight: 700; margin-right: 8px; }
  .brief .b-footer { background: #0f172a; padding: 20px 32px; text-align: center; border-radius: 0 0 10px 10px; }
  .brief .b-footer p { font-size: 11px; color: #64748b; }
  .brief .b-footer strong { color: #93c5fd; }
  @media print { .brief .b-section { break-inside: avoid; } }
</style>

<div class="brief">
  <div class="b-header">
    <div class="b-header-inner">
      <div class="b-header-label">Internal Partnership Brief</div>
      <h1>USSP + TeleRay Healthcare Partnership</h1>
      <p>Investment, reseller, and implementation partnership opportunity with TeleRay &mdash; a cloud-based telehealth and medical imaging platform with 3,000+ deployed sites.</p>
      <div class="b-header-meta">
        <span><strong>Prepared:</strong> March 2026</span>
        <span><strong>Partner:</strong> TeleRay (teleray.com)</span>
        <span><strong>Status:</strong> In Conversation</span>
      </div>
      <div class="confidential">Confidential &mdash; For Internal Discussion Only</div>
    </div>
  </div>

  <div class="b-page">

    <div class="b-section">
      <h2>What Is TeleRay?</h2>
      <p class="b-subtitle">Cloud-based healthcare platform &mdash; Austin, TX / Chicago, IL</p>
      <div class="b-card-grid">
        <div class="b-card"><h4>Virtual Care</h4><p>Multi-room video consultations, virtual nursing, telesitting, ICU monitoring. Browser-based &mdash; no app downloads.</p></div>
        <div class="b-card"><h4>Cloud PACS / Imaging</h4><p>DICOM image storage and exchange, FDA-approved viewer, legacy study migration. Current revenue source (3,000+ sites).</p></div>
        <div class="b-card"><h4>Clinical Tools</h4><p>TeleRay Reporting, TeleRay Record (HD surgical video to DICOM), TeleRay Remote (remote modality control).</p></div>
        <div class="b-card"><h4>Integration</h4><p>250+ EMR/EHR integrations (Epic, Cerner, Athena). Built on Azure. HIPAA compliant. Two-week typical deployment.</p></div>
      </div>
    </div>

    <div class="b-section">
      <h2>TeleRay's Current State</h2>
      <p class="b-subtitle">What we know as of March 2026</p>
      <table>
        <tr><th>Metric</th><th>Details</th></tr>
        <tr><td>Annual Revenue</td><td>~$2M USD/year</td></tr>
        <tr><td>Sites Deployed</td><td>3,000+ (primarily radiology/PACS)</td></tr>
        <tr><td>Revenue Concentration</td><td>Majority from radiology. Virtual care is early-stage.</td></tr>
        <tr><td>Compliance</td><td>HIPAA compliant, FDA-approved viewer</td></tr>
        <tr><td>Location</td><td>Austin, TX (HQ) &amp; Chicago, IL</td></tr>
        <tr><td>Raising</td><td>$2M total across 4 tranches</td></tr>
      </table>
      <div class="b-warn"><p><strong>Key insight:</strong> The $2M revenue is concentrated in radiology. Virtual patient care has not scaled commercially yet. This affects valuation and is also USSP's opportunity.</p></div>
    </div>

    <div class="b-section">
      <h2>Axis Communications Partnership</h2>
      <p class="b-subtitle">TeleRay + Axis &mdash; in final stages, not yet signed</p>
      <p>TeleRay is partnering with Axis Communications (Swedish, owned by Canon) to integrate privacy-compliant PTZ cameras with built-in AI.</p>
      <h3>What Axis Adds</h3>
      <table>
        <tr><th>Capability</th><th>Details</th></tr>
        <tr><td>PTZ Cameras</td><td>Pan, tilt, zoom with superior clarity for virtual nursing</td></tr>
        <tr><td>Fall Risk Detection</td><td>AI-powered fall detection built into the camera</td></tr>
        <tr><td>Out-of-Bed Alerts</td><td>Patient elopement and movement detection</td></tr>
        <tr><td>Aggression Detection</td><td>Sound intelligence for raised voices, aggression</td></tr>
        <tr><td>AXIS Live Privacy Shield</td><td>Real-time AI masking of faces &mdash; BIPA compliant</td></tr>
        <tr><td>Dual Streams</td><td>Masked for monitoring, unmasked for authorized forensic access</td></tr>
      </table>
      <div class="b-highlight"><p><strong>Why this matters:</strong> Axis privacy tech makes TeleRay deployable in Illinois (BIPA) and correctional facilities. Many government buildings already have Axis cameras.</p></div>
    </div>

    <div class="b-section">
      <h2>Competitive Landscape</h2>
      <p class="b-subtitle">Primary competitor: care.ai (acquired by Stryker)</p>
      <table>
        <tr><th></th><th>TeleRay</th><th>care.ai (Stryker)</th></tr>
        <tr><td>Status</td><td>Independent, raising $2M</td><td>Acquired by Stryker (Aug 2024) &mdash; $20B+ medtech</td></tr>
        <tr><td>Deployments</td><td>3,000 sites (radiology); virtual care early</td><td>1,500+ healthcare settings</td></tr>
        <tr><td>Hardware</td><td>Existing cameras + Axis (open)</td><td>Proprietary sensors (lock-in)</td></tr>
        <tr><td>Target Market</td><td>Mid-market, government, smaller facilities</td><td>Large hospital systems</td></tr>
        <tr><td>Pricing</td><td>$70-150/bed/month</td><td>Likely higher (enterprise)</td></tr>
      </table>
      <div class="b-highlight"><p><strong>Opportunity:</strong> Stryker targets large hospital systems. Government healthcare, correctional facilities, veterans homes, and mid-market are underserved.</p></div>
    </div>

    <div class="b-section">
      <h2>Proposed Deal Structure</h2>
      <p class="b-subtitle">Two separate relationships &mdash; commercial and investment</p>
      <h3>1. Reseller &amp; Implementation Partnership</h3>
      <table>
        <tr><th>Term</th><th>Details</th></tr>
        <tr><td>Role</td><td>USSP as authorized reseller + implementation partner</td></tr>
        <tr><td>Territory</td><td>Illinois state and local government (push for exclusivity)</td></tr>
        <tr><td>Wholesale Price</td><td>$70-80/bed/month from TeleRay</td></tr>
        <tr><td>Retail Price</td><td>Up to $150/bed/month to end customer</td></tr>
        <tr><td>USSP Margin</td><td>$70-80/bed/month (~2x markup)</td></tr>
        <tr><td>Term</td><td>3-year minimum, auto-renewal</td></tr>
      </table>
      <h3>2. Investment (In Parallel)</h3>
      <table>
        <tr><th>Their Ask</th><th>Our Position</th></tr>
        <tr><td>$500K at $20M valuation</td><td>$500K at $8-10M = 5-6% stake</td></tr>
        <tr><td>Step-up to $35M across 4 tranches</td><td>Milestone-based tranches only</td></tr>
        <tr><td>Claim: other investor at $30M</td><td>Don't let someone else's deal set our price</td></tr>
      </table>
      <div class="b-warn"><p><strong>Valuation reality:</strong> $2M ARR, concentrated in radiology, virtual care unproven. Realistic valuation: <strong>$6M &ndash; $10M</strong>.</p></div>
    </div>

    <div class="b-section">
      <h2>Recommended Approach</h2>
      <p class="b-subtitle">Reseller first, investment in parallel</p>
      <div class="b-highlight">
        <p><strong>Step 1:</strong> Sign reseller agreement with IL government exclusivity now. Start selling immediately.</p>
        <p><strong>Step 2:</strong> Run investment due diligence in parallel.</p>
        <p><strong>Step 3:</strong> Close investment once we have real sales data.</p>
      </div>
    </div>

    <div class="b-section">
      <h2>Target Facilities in Illinois</h2>
      <p class="b-subtitle">State-run healthcare facilities via TOPS</p>
      <table>
        <tr><th>Agency</th><th>Facilities</th><th>Use Case</th></tr>
        <tr><td>IDOC (Corrections)</td><td>25+ facilities</td><td>Inmate telehealth &mdash; reduces transport ($350/visit)</td></tr>
        <tr><td>IL Veterans' Affairs</td><td>4 state veterans homes</td><td>Virtual nursing, specialist consults</td></tr>
        <tr><td>IDHS (Human Services)</td><td>Developmental centers, mental health</td><td>Remote specialist access</td></tr>
        <tr><td>IDJJ (Juvenile Justice)</td><td>Youth facilities</td><td>Youth healthcare</td></tr>
        <tr><td>Cook County Health</td><td>County facilities</td><td>MBE/WBE advantage</td></tr>
      </table>
      <h3>Revenue Per Facility (200-Bed Example)</h3>
      <table>
        <tr><th>Stream</th><th>Calculation</th><th>Annual</th></tr>
        <tr><td>Resale Margin</td><td>200 beds &times; $70 &times; 12</td><td>$168,000</td></tr>
        <tr><td>Implementation</td><td>2-4 week deployment</td><td>$30,000-$60,000</td></tr>
        <tr><td>Ongoing Support</td><td>Monthly retainer</td><td>$24,000-$48,000</td></tr>
        <tr><td><strong>Total</strong></td><td></td><td><strong>$222,000-$276,000</strong></td></tr>
      </table>
    </div>

    <div class="b-section">
      <h2>Negotiation Priorities</h2>
      <p class="b-subtitle">In order of importance</p>
      <table>
        <tr><th>#</th><th>Priority</th><th>Why</th></tr>
        <tr><td><span class="b-priority-num">1</span></td><td><strong>IL government exclusivity</strong></td><td>Without it, we build the pipeline and lose the deals</td></tr>
        <tr><td><span class="b-priority-num">2</span></td><td><strong>3-year minimum term</strong></td><td>Protects channel investment</td></tr>
        <tr><td><span class="b-priority-num">3</span></td><td><strong>Valuation at $8-10M</strong></td><td>Reflects actual stage</td></tr>
        <tr><td><span class="b-priority-num">4</span></td><td><strong>Milestone-based tranches</strong></td><td>No automatic step-ups</td></tr>
        <tr><td><span class="b-priority-num">5</span></td><td><strong>Board seat</strong></td><td>Visibility into decisions</td></tr>
        <tr><td><span class="b-priority-num">6</span></td><td><strong>Customer protection on exit</strong></td><td>Keep customers we brought in</td></tr>
      </table>
    </div>

    <div class="b-section">
      <h2>Due Diligence Checklist</h2>
      <p class="b-subtitle">Before committing investment</p>
      <table>
        <tr><th>Item</th><th>Status</th></tr>
        <tr><td>Financials (P&amp;L, balance sheet, cash flow)</td><td><span class="b-tag b-tag-amber">Pending</span></td></tr>
        <tr><td>Revenue split: radiology vs. virtual care</td><td><span class="b-tag b-tag-amber">Pending</span></td></tr>
        <tr><td>Customer list with contract values</td><td><span class="b-tag b-tag-amber">Pending</span></td></tr>
        <tr><td>Churn rate</td><td><span class="b-tag b-tag-amber">Pending</span></td></tr>
        <tr><td>Cap table</td><td><span class="b-tag b-tag-amber">Pending</span></td></tr>
        <tr><td>Axis partnership terms</td><td><span class="b-tag b-tag-blue">Final Stages</span></td></tr>
        <tr><td>IP ownership</td><td><span class="b-tag b-tag-amber">Pending</span></td></tr>
        <tr><td>Litigation / regulatory</td><td><span class="b-tag b-tag-amber">Pending</span></td></tr>
        <tr><td>Growth rate &amp; margins</td><td><span class="b-tag b-tag-amber">Pending</span></td></tr>
      </table>
    </div>

    <div class="b-section">
      <h2>USSP Ecosystem</h2>
      <p class="b-subtitle">TeleRay is one piece of a larger strategy</p>
      <table>
        <tr><th>Partner</th><th>What They Bring</th><th>Status</th></tr>
        <tr><td><strong>TeleRay</strong></td><td>Virtual care, Cloud PACS, telehealth</td><td><span class="b-tag b-tag-blue">In Conversation</span></td></tr>
        <tr><td><strong>Axis</strong></td><td>Privacy cameras, AI masking</td><td><span class="b-tag b-tag-blue">Final Stages</span></td></tr>
        <tr><td><strong>ATRI AI</strong></td><td>Computer vision, Edge AI</td><td><span class="b-tag b-tag-blue">In Conversation</span></td></tr>
        <tr><td><strong>Krasan</strong></td><td>TOPS prime, government access</td><td><span class="b-tag b-tag-green">Existing</span></td></tr>
        <tr><td><strong>USSP</strong></td><td>MBE/WBE/DBE, TOPS sub, implementation</td><td><span class="b-tag b-tag-green">The Integrator</span></td></tr>
      </table>
      <div class="b-highlight"><p><strong>Strategy:</strong> Lead with TeleRay + Axis (proven, low risk). Once inside facilities, introduce VionOS.ai for facility safety. TeleRay gets us in the door &mdash; Edge AI expands the relationship.</p></div>
    </div>

    <div class="b-section">
      <h2>Decision Points for Discussion</h2>
      <p class="b-subtitle">What we need to align on</p>
      <table>
        <tr><th>#</th><th>Question</th><th>Options</th></tr>
        <tr><td>1</td><td>Proceed with reseller agreement before investment?</td><td>Yes (recommended) / Wait</td></tr>
        <tr><td>2</td><td>Investment amount?</td><td>$500K at $8-10M / Counter / Resell only</td></tr>
        <tr><td>3</td><td>IL exclusivity a deal-breaker?</td><td>Must-have / Right of first refusal</td></tr>
        <tr><td>4</td><td>Board seat?</td><td>Full / Observer / Quarterly reporting</td></tr>
        <tr><td>5</td><td>Who presents to Dinkar first?</td><td>Vinay / Joint with TeleRay / After first deal</td></tr>
        <tr><td>6</td><td>Timeline for reseller agreement?</td><td>30 days / 60 days / After due diligence</td></tr>
      </table>
    </div>

  </div>

  <div class="b-footer">
    <p><strong>US Software Professionals Inc. (USSP)</strong> &bull; 875 N Michigan Ave, Suite 3100, Chicago, IL 60614 &bull; Confidential</p>
  </div>
</div>
`,
          }}
        />
      </main>
    </>
  );
}
