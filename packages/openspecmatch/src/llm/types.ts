/**
 * LLM provider abstraction.
 * OpenSpecMatch is provider-agnostic — supply any adapter that implements this interface.
 */
export interface LLMProvider {
  /** Provider name for logging */
  name: string;
  /**
   * Send a structured extraction prompt and get a JSON response.
   * The provider must return valid JSON matching the requested schema.
   */
  chat(params: LLMChatParams): Promise<string>;
}

export interface LLMChatParams {
  /** System prompt describing the extraction task */
  system: string;
  /** User message (the document to extract from) */
  user: string;
  /** Max tokens for the response */
  maxTokens?: number;
  /** Temperature (0 = deterministic, 1 = creative) */
  temperature?: number;
}

export interface LLMProviderConfig {
  type: "anthropic" | "openai" | "custom";
  apiKey?: string;
  model?: string;
  customProvider?: LLMProvider;
}
