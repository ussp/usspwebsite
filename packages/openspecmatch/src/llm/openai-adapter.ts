import type { LLMProvider, LLMChatParams } from "./types.js";

export class OpenAIAdapter implements LLMProvider {
  name = "openai";
  private client: any;
  private model: string;
  private _apiKey: string;
  private _initialized = false;

  constructor(apiKey: string, model?: string) {
    this.model = model ?? "gpt-4o";
    this._apiKey = apiKey;
  }

  private async init(): Promise<void> {
    if (this._initialized) return;
    try {
      const mod = await import("openai");
      const OpenAI = mod.default ?? mod.OpenAI;
      this.client = new OpenAI({ apiKey: this._apiKey });
      this._initialized = true;
    } catch {
      throw new Error(
        "OpenAIAdapter requires openai package. Install it: npm install openai",
      );
    }
  }

  async chat(params: LLMChatParams): Promise<string> {
    await this.init();

    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: params.maxTokens ?? 4096,
      temperature: params.temperature ?? 0,
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  }
}
