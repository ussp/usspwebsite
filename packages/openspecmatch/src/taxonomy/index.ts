export type {
  TaxonomyNode,
  TaxonomyTree,
  ResolveResult,
  TaxonomyRelationship,
} from "./types.js";

export { TaxonomyResolver } from "./resolver.js";
export { buildTree } from "./builder.js";

// Built-in trees
export { technologyTree } from "./trees/technology.js";
export { certificationsTree } from "./trees/certifications.js";
export { educationTree } from "./trees/education.js";
export { domainKnowledgeTree } from "./trees/domain-knowledge.js";
export { softSkillsTree } from "./trees/soft-skills.js";
export { infrastructureTree } from "./trees/infrastructure.js";
export { financialTree } from "./trees/financial.js";
export { manpowerTree } from "./trees/manpower.js";

import { TaxonomyResolver } from "./resolver.js";
import { technologyTree } from "./trees/technology.js";
import { certificationsTree } from "./trees/certifications.js";
import { educationTree } from "./trees/education.js";
import { domainKnowledgeTree } from "./trees/domain-knowledge.js";
import { softSkillsTree } from "./trees/soft-skills.js";
import { infrastructureTree } from "./trees/infrastructure.js";
import { financialTree } from "./trees/financial.js";
import { manpowerTree } from "./trees/manpower.js";

/**
 * Create a resolver pre-loaded with all built-in taxonomy trees.
 */
export function createDefaultResolver(): TaxonomyResolver {
  const resolver = new TaxonomyResolver();
  resolver.registerTree(technologyTree);
  resolver.registerTree(certificationsTree);
  resolver.registerTree(educationTree);
  resolver.registerTree(domainKnowledgeTree);
  resolver.registerTree(softSkillsTree);
  resolver.registerTree(infrastructureTree);
  resolver.registerTree(financialTree);
  resolver.registerTree(manpowerTree);
  return resolver;
}
