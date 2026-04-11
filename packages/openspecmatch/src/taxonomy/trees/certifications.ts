import { buildTree } from "../builder.js";

export const certificationsTree = buildTree("certifications", "Certifications", [
  {
    id: "aws-certs",
    label: "AWS Certifications",
    children: [
      { id: "aws-saa", label: "AWS Solutions Architect Associate", aliases: ["aws saa", "aws solutions architect", "saa-c03"] },
      { id: "aws-sap", label: "AWS Solutions Architect Professional", aliases: ["aws sap", "sap-c02"] },
      { id: "aws-dev", label: "AWS Developer Associate", aliases: ["aws developer", "dva-c02"] },
      { id: "aws-sysops", label: "AWS SysOps Administrator", aliases: ["aws sysops", "soa-c02"] },
      { id: "aws-devops-pro", label: "AWS DevOps Engineer Professional", aliases: ["aws devops"] },
      { id: "aws-ml", label: "AWS Machine Learning Specialty", aliases: ["aws ml specialty"] },
      { id: "aws-security", label: "AWS Security Specialty", aliases: ["aws security"] },
      { id: "aws-ccp", label: "AWS Cloud Practitioner", aliases: ["aws ccp", "clf-c02"] },
    ],
  },
  {
    id: "azure-certs",
    label: "Azure Certifications",
    children: [
      { id: "az-900", label: "Azure Fundamentals", aliases: ["az-900", "azure fundamentals"] },
      { id: "az-104", label: "Azure Administrator", aliases: ["az-104", "azure admin"] },
      { id: "az-204", label: "Azure Developer", aliases: ["az-204", "azure developer"] },
      { id: "az-305", label: "Azure Solutions Architect Expert", aliases: ["az-305", "azure architect"] },
      { id: "az-400", label: "Azure DevOps Engineer Expert", aliases: ["az-400", "azure devops"] },
      { id: "ai-900", label: "Azure AI Fundamentals", aliases: ["ai-900"] },
      { id: "dp-900", label: "Azure Data Fundamentals", aliases: ["dp-900"] },
    ],
  },
  {
    id: "gcp-certs",
    label: "GCP Certifications",
    children: [
      { id: "gcp-ace", label: "GCP Associate Cloud Engineer", aliases: ["gcp ace", "google cloud engineer"] },
      { id: "gcp-pca", label: "GCP Professional Cloud Architect", aliases: ["gcp architect"] },
      { id: "gcp-pde", label: "GCP Professional Data Engineer", aliases: ["gcp data engineer"] },
    ],
  },
  {
    id: "security-certs",
    label: "Security Certifications",
    children: [
      { id: "cissp", label: "CISSP", aliases: ["certified information systems security professional"] },
      { id: "cism", label: "CISM", aliases: ["certified information security manager"] },
      { id: "ceh", label: "CEH", aliases: ["certified ethical hacker"] },
      { id: "comptia-security", label: "CompTIA Security+", aliases: ["security+", "sec+", "comptia sec+"] },
      { id: "comptia-network", label: "CompTIA Network+", aliases: ["network+", "net+"] },
    ],
  },
  {
    id: "project-mgmt",
    label: "Project Management Certifications",
    children: [
      { id: "pmp", label: "PMP", aliases: ["project management professional", "pmi pmp"] },
      { id: "csm", label: "Certified Scrum Master", aliases: ["csm", "scrum master cert"] },
      { id: "psm", label: "Professional Scrum Master", aliases: ["psm", "psm i", "psm ii"] },
      { id: "safe", label: "SAFe Agilist", aliases: ["safe", "scaled agile", "safe agilist"] },
      { id: "itil", label: "ITIL", aliases: ["itil v4", "itil foundation"] },
    ],
  },
  {
    id: "data-certs",
    label: "Data Certifications",
    children: [
      { id: "cka", label: "Certified Kubernetes Administrator", aliases: ["cka"] },
      { id: "ckad", label: "Certified Kubernetes Application Developer", aliases: ["ckad"] },
      { id: "dbt", label: "dbt Certification", aliases: ["dbt certified"] },
      { id: "snowflake-cert", label: "Snowflake Certification", aliases: ["snowpro"] },
    ],
  },
  {
    id: "healthcare-certs",
    label: "Healthcare Certifications",
    children: [
      { id: "rn-license", label: "Registered Nurse License", aliases: ["rn", "registered nurse", "nursing license"] },
      { id: "lpn-license", label: "Licensed Practical Nurse", aliases: ["lpn", "lvn"] },
      { id: "cna", label: "Certified Nursing Assistant", aliases: ["cna"] },
      { id: "bls", label: "Basic Life Support", aliases: ["bls", "bls certification"] },
      { id: "acls", label: "Advanced Cardiac Life Support", aliases: ["acls"] },
      { id: "pals", label: "Pediatric Advanced Life Support", aliases: ["pals"] },
      { id: "np", label: "Nurse Practitioner", aliases: ["np", "aprn", "advanced practice"] },
    ],
  },
]);
