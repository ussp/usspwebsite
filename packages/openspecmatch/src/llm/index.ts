export type { LLMProvider, LLMChatParams, LLMProviderConfig } from "./types.js";
export { AnthropicAdapter } from "./anthropic-adapter.js";
export { OpenAIAdapter } from "./openai-adapter.js";

import type { LLMProvider, LLMProviderConfig } from "./types.js";
import { AnthropicAdapter } from "./anthropic-adapter.js";
import { OpenAIAdapter } from "./openai-adapter.js";

export function createLLMProvider(config: LLMProviderConfig): LLMProvider {
  switch (config.type) {
    case "anthropic":
      if (!config.apiKey) throw new Error("Anthropic adapter requires apiKey");
      return new AnthropicAdapter(config.apiKey, config.model);
    case "openai":
      if (!config.apiKey) throw new Error("OpenAI adapter requires apiKey");
      return new OpenAIAdapter(config.apiKey, config.model);
    case "custom":
      if (!config.customProvider) throw new Error("Custom adapter requires customProvider");
      return config.customProvider;
    default:
      throw new Error(`Unknown LLM provider type: ${config.type}`);
  }
}
