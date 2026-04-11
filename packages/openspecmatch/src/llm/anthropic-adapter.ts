import type { LLMProvider, LLMChatParams } from "./types.js";

export class AnthropicAdapter implements LLMProvider {
  name = "anthropic";
  private client: any; // Dynamic import — @anthropic-ai/sdk is optional peer dep
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.model = model ?? "claude-sonnet-4-20250514";
    // Lazy init — actual import happens on first call
    this._apiKey = apiKey;
  }

  private _apiKey: string;
  private _initialized = false;

  private async init(): Promise<void> {
    if (this._initialized) return;
    try {
      const mod = await import("@anthropic-ai/sdk");
      const Anthropic = mod.default ?? mod.Anthropic;
      this.client = new Anthropic({ apiKey: this._apiKey });
      this._initialized = true;
    } catch {
      throw new Error(
        "AnthropicAdapter requires @anthropic-ai/sdk. Install it: npm install @anthropic-ai/sdk",
      );
    }
  }

  async chat(params: LLMChatParams): Promise<string> {
    await this.init();

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: params.maxTokens ?? 4096,
      temperature: params.temperature ?? 0,
      system: params.system,
      messages: [{ role: "user", content: params.user }],
    });

    const block = response.content[0];
    if (block.type === "text") return block.text;
    throw new Error("Unexpected response type from Anthropic API");
  }
}
