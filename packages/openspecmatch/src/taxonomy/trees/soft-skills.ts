import { buildTree } from "../builder.js";

export const softSkillsTree = buildTree("soft-skills", "Soft Skills", [
  {
    id: "leadership",
    label: "Leadership & Management",
    children: [
      { id: "team-leadership", label: "Team Leadership", aliases: ["team leadership", "team lead", "led team", "leading team", "lead engineer"] },
      { id: "mentoring", label: "Mentoring", aliases: ["mentoring", "mentored", "coaching", "trained staff", "onboarded"] },
      { id: "project-management", label: "Project Management", aliases: ["project management", "managed project", "project lead", "program management"] },
      { id: "stakeholder-mgmt", label: "Stakeholder Management", aliases: ["stakeholder management", "stakeholder engagement", "client relationship"] },
      { id: "budget-management", label: "Budget Management", aliases: ["budget management", "cost management", "financial oversight"] },
      { id: "risk-management", label: "Risk Management", aliases: ["risk management", "risk assessment", "risk mitigation"] },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    children: [
      { id: "presentation", label: "Presentation Skills", aliases: ["presentation skills", "presented", "public speaking", "keynote", "tech talk"] },
      { id: "technical-writing", label: "Technical Writing", aliases: ["technical writing", "documentation", "wrote specifications"] },
      { id: "client-communication", label: "Client Communication", aliases: ["client communication", "client facing", "customer-facing", "stakeholder communication"] },
      { id: "cross-functional", label: "Cross-Functional Collaboration", aliases: ["cross-functional", "cross functional", "collaborated across teams", "interdepartmental"] },
    ],
  },
  {
    id: "problem-solving",
    label: "Problem Solving",
    children: [
      { id: "analytical", label: "Analytical Thinking", aliases: ["analytical thinking", "analytical skills", "problem solving", "troubleshooting", "root cause analysis"] },
      { id: "critical-thinking", label: "Critical Thinking", aliases: ["critical thinking", "strategic thinking", "decision making"] },
      { id: "innovation", label: "Innovation", aliases: ["innovation", "creative solutions", "process improvement", "optimization"] },
    ],
  },
  {
    id: "collaboration",
    label: "Collaboration & Teamwork",
    children: [
      { id: "teamwork", label: "Teamwork", aliases: ["teamwork", "collaboration", "collaborative", "team player", "worked with"] },
      { id: "agile-methodology", label: "Agile Methodology", aliases: ["agile methodology", "agile practices", "agile ceremonies", "sprint planning", "retrospective"] },
      { id: "remote-collaboration", label: "Remote Collaboration", aliases: ["remote collaboration", "distributed team", "virtual team", "remote work"] },
    ],
  },
]);
