import { buildTree } from "../builder.js";

export const educationTree = buildTree("education", "Education", [
  {
    id: "degrees",
    label: "Degree Levels",
    children: [
      { id: "high-school", label: "High School Diploma", aliases: ["hs diploma", "ged", "high school"] },
      { id: "associate", label: "Associate's Degree", aliases: ["associates", "aa", "as", "aas"] },
      { id: "bachelor", label: "Bachelor's Degree", aliases: ["bachelors", "ba", "bs", "bsc", "beng", "b.s.", "b.a.", "undergraduate"] },
      { id: "master", label: "Master's Degree", aliases: ["masters", "ma", "ms", "msc", "mba", "meng", "m.s.", "m.a.", "graduate degree"] },
      { id: "doctorate", label: "Doctorate", aliases: ["phd", "ph.d.", "doctoral", "dr.", "edd", "md"] },
      { id: "bootcamp", label: "Coding Bootcamp", aliases: ["bootcamp", "code bootcamp", "coding academy"] },
      { id: "professional-cert", label: "Professional Certificate", aliases: ["certificate program", "professional certificate"] },
    ],
  },
  {
    id: "fields",
    label: "Fields of Study",
    children: [
      { id: "computer-science", label: "Computer Science", aliases: ["cs", "comp sci", "computing"] },
      { id: "software-engineering", label: "Software Engineering", aliases: ["se", "software development"] },
      { id: "information-technology", label: "Information Technology", aliases: ["it", "info tech"] },
      { id: "data-science", label: "Data Science", aliases: ["data analytics", "analytics"] },
      { id: "cybersecurity", label: "Cybersecurity", aliases: ["cyber security", "information security", "infosec"] },
      { id: "electrical-engineering", label: "Electrical Engineering", aliases: ["ee", "ece"] },
      { id: "mathematics", label: "Mathematics", aliases: ["math", "applied math", "statistics"] },
      { id: "business", label: "Business Administration", aliases: ["business", "bba", "management"] },
      { id: "nursing", label: "Nursing", aliases: ["bsn", "msn", "nursing science"] },
      { id: "healthcare-admin", label: "Healthcare Administration", aliases: ["health admin", "mha", "health management"] },
      { id: "biology", label: "Biology", aliases: ["bio", "biological sciences"] },
      { id: "physics", label: "Physics", aliases: ["applied physics"] },
      { id: "engineering", label: "Engineering (General)", aliases: ["general engineering"] },
    ],
  },
]);
