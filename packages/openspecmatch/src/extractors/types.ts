import type { DemandSpec } from "../specs/demand-spec.js";
import type { CapabilitySpec } from "../specs/capability-spec.js";

/** Extracts a DemandSpec from a source document/record */
export interface DemandExtractor<TInput = unknown> {
  extract(input: TInput): DemandSpec;
}

/** Extracts a CapabilitySpec from a source document/record (sync) */
export interface CapabilityExtractor<TInput = unknown> {
  extract(input: TInput): CapabilitySpec;
}

/** Extracts a CapabilitySpec from a source document/record (async, e.g., LLM-powered) */
export interface AsyncCapabilityExtractor<TInput = unknown> {
  extract(input: TInput): Promise<CapabilitySpec>;
}
