import { buildTree } from "../builder.js";

export const financialTree = buildTree("financial", "Financial Capacity", [
  {
    id: "turnover",
    label: "Annual Turnover",
    children: [
      { id: "turnover-small", label: "Turnover Small (< 10 Cr)", aliases: ["small turnover", "turnover under 10 crore", "turnover less than 10 cr"] },
      { id: "turnover-mid", label: "Turnover Mid (10-50 Cr)", aliases: ["mid turnover", "mid-size turnover", "turnover 10 to 50 crore"] },
      { id: "turnover-large", label: "Turnover Large (50-500 Cr)", aliases: ["large turnover", "turnover 50 to 500 crore"] },
      { id: "turnover-enterprise", label: "Turnover Enterprise (> 500 Cr)", aliases: ["enterprise turnover", "turnover above 500 crore"] },
    ],
  },
  {
    id: "bid-security",
    label: "Bid Security Instruments",
    children: [
      { id: "pbg", label: "Performance Bank Guarantee", aliases: ["pbg", "performance bank guarantee", "performance guarantee"] },
      { id: "emd", label: "Earnest Money Deposit", aliases: ["emd", "earnest money deposit", "bid earnest money"] },
      { id: "tender-guarantee", label: "Tender / Bid Guarantee", aliases: ["tender guarantee", "bid bond", "bid guarantee"] },
      { id: "retention-money", label: "Retention Money", aliases: ["retention money", "retention deposit"] },
    ],
  },
  {
    id: "working-capital",
    label: "Working Capital",
    children: [
      { id: "working-capital-line", label: "Working Capital Line of Credit", aliases: ["working capital", "working capital line", "cc limit", "cash credit limit"] },
      { id: "project-financing", label: "Project Financing Capacity", aliases: ["project financing", "project finance", "term loan"] },
      { id: "milestone-cashflow", label: "Milestone-based Cashflow Management", aliases: ["milestone cashflow", "milestone payments", "milestone-based payment"] },
    ],
  },
  {
    id: "funding-schemes",
    label: "Government Funding Schemes",
    children: [
      { id: "nirbhaya-framework", label: "Nirbhaya Framework Funding", aliases: ["nirbhaya framework", "nirbhaya fund", "nirbhaya funding"] },
      { id: "cpse-empanelment", label: "CPSE Empanelment", aliases: ["cpse empanelment", "central public sector enterprise", "cpse"] },
      { id: "gem-empanelment", label: "GeM Empanelment", aliases: ["gem", "government e-marketplace", "gem empanelment", "gem registered"] },
      { id: "msme-registration", label: "MSME Registration", aliases: ["msme", "msme registered", "micro small medium enterprise", "udyam"] },
    ],
  },
  {
    id: "audit-filing",
    label: "Audit & Filing",
    children: [
      { id: "itr-filing", label: "ITR Filing Status", aliases: ["itr", "income tax return", "itr filing", "active itr"] },
      { id: "statutory-audit", label: "Statutory Audit Clean", aliases: ["statutory audit", "audit clean", "audit compliant"] },
      { id: "gst-registration", label: "GST Registration", aliases: ["gst", "gstin", "gst registered"] },
    ],
  },
]);
