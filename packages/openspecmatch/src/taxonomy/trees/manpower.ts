import { buildTree } from "../builder.js";

export const manpowerTree = buildTree("manpower", "Manpower & Delivery", [
  {
    id: "project-governance",
    label: "Project Governance",
    children: [
      { id: "nodal-officer", label: "Nodal Officer", aliases: ["nodal officer", "single point nodal officer", "spoc"] },
      { id: "piu", label: "Project Implementation Unit", aliases: ["piu", "project implementation unit", "state piu"] },
      { id: "pmu", label: "Project Management Unit", aliases: ["pmu", "project management unit", "national pmu"] },
      { id: "pmc", label: "Project Management Consultant", aliases: ["pmc", "project management consultant", "program consultant"] },
      { id: "steering-committee", label: "Steering Committee", aliases: ["steering committee", "governance committee"] },
    ],
  },
  {
    id: "operations",
    label: "Operations Staffing",
    children: [
      { id: "ops-24x7", label: "24x7 Operations Team", aliases: ["24x7", "24/7", "around the clock", "24x7 operations"] },
      { id: "mc-operator", label: "Monitoring Centre Operator", aliases: ["mc operator", "monitoring centre operator", "control room operator", "operations analyst"] },
      { id: "field-agent", label: "Field Agent / On-ground Staff", aliases: ["field agent", "field staff", "on-ground", "field ops"] },
      { id: "om-team", label: "O&M Support Team", aliases: ["o&m", "operations and maintenance", "maintenance team", "o and m"] },
    ],
  },
  {
    id: "helpdesk",
    label: "Helpdesk & Support",
    children: [
      { id: "helpdesk-l1", label: "Helpdesk L1 (phone/email/web)", aliases: ["helpdesk l1", "level 1 support", "first-line support", "l1 support"] },
      { id: "helpdesk-l2", label: "Helpdesk L2 (technical escalation)", aliases: ["helpdesk l2", "level 2 support", "technical escalation", "l2 support"] },
      { id: "helpdesk-l3", label: "Helpdesk L3 (engineering escalation)", aliases: ["helpdesk l3", "level 3 support", "engineering escalation", "l3 support"] },
    ],
  },
  {
    id: "language-coverage",
    label: "Language Coverage",
    children: [
      { id: "telugu", label: "Telugu Language Support", aliases: ["telugu", "telugu language", "telugu support"] },
      { id: "hindi", label: "Hindi Language Support", aliases: ["hindi", "hindi language", "hindi support"] },
      { id: "english", label: "English Language Support", aliases: ["english", "english language", "english support"] },
      { id: "tamil", label: "Tamil Language Support", aliases: ["tamil", "tamil language"] },
      { id: "kannada", label: "Kannada Language Support", aliases: ["kannada", "kannada language"] },
      { id: "regional-multi", label: "Multi-regional Language Support", aliases: ["multi-regional", "regional languages", "multilingual support"] },
    ],
  },
  {
    id: "delivery-roles",
    label: "Delivery Roles",
    children: [
      { id: "solution-architect", label: "Solution Architect", aliases: ["solution architect", "system architect", "solutioning"] },
      { id: "integration-lead", label: "Integration Lead", aliases: ["integration lead", "integration engineer", "api lead"] },
      { id: "deployment-lead", label: "Deployment Lead", aliases: ["deployment lead", "rollout lead", "commissioning lead"] },
      { id: "training-delivery", label: "Training Delivery", aliases: ["training", "training delivery", "capacity building", "workshops"] },
      { id: "change-management", label: "Change Management", aliases: ["change management", "adoption management"] },
    ],
  },
  {
    id: "team-scale",
    label: "Team Scale",
    children: [
      { id: "team-small", label: "Team Size Small (< 50)", aliases: ["small team", "team under 50", "small organization"] },
      { id: "team-mid", label: "Team Size Mid (50-250)", aliases: ["mid-size team", "team 50 to 250", "medium team"] },
      { id: "team-large", label: "Team Size Large (250+)", aliases: ["large team", "team 250 plus", "enterprise team"] },
    ],
  },
]);
