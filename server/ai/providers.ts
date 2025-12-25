/**
 * AI Provider Management
 * Handles multi-provider AI client initialization with fallback chain
 * Uses native SDKs for each provider with unified interface
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import type { ContentTier, ModelConfig } from "./types";

// ============================================================================
// Unified AI Interface
// ============================================================================

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: "json_object" } | { type: "text" };
}

export interface AICompletionResult {
  content: string;
  provider: string;
  model: string;
}

export interface UnifiedAIProvider {
  name: string;
  model: string;
  generateCompletion: (options: AICompletionOptions) => Promise<AICompletionResult>;
}

// ============================================================================
// API Key Validation
// ============================================================================

export function getValidOpenAIKey(): string | null {
  const integrationsKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (integrationsKey && !integrationsKey.includes('DUMMY')) {
    return integrationsKey;
  }
  const directKey = process.env.OPENAI_API_KEY;
  if (directKey && !directKey.includes('DUMMY')) {
    return directKey;
  }
  return null;
}

// ============================================================================
// OpenAI Provider
// ============================================================================

function createOpenAIProvider(): UnifiedAIProvider | null {
  const apiKey = getValidOpenAIKey();
  if (!apiKey) return null;
  
  const client = new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });

  return {
    name: "openai",
    model: "gpt-4o-mini",
    generateCompletion: async (options) => {
      const completion = await client.chat.completions.create({
        model: options.model || "gpt-4o-mini",
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 12000,
        ...(options.responseFormat?.type === "json_object" ? { response_format: { type: "json_object" } } : {}),
      });
      return {
        content: completion.choices[0]?.message?.content || "",
        provider: "openai",
        model: options.model || "gpt-4o-mini",
      };
    },
  };
}

// ============================================================================
// Anthropic Provider (using native SDK)
// ============================================================================

function createAnthropicProvider(): UnifiedAIProvider | null {
  const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
  
  if (!baseURL || !apiKey) return null;
  
  const client = new Anthropic({
    apiKey,
    baseURL,
  });

  return {
    name: "anthropic",
    model: "claude-sonnet-4-5",
    generateCompletion: async (options) => {
      const systemMessage = options.messages.find(m => m.role === "system");
      const userMessages = options.messages.filter(m => m.role !== "system");
      
      const messages = userMessages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      let systemPrompt = systemMessage?.content || "";
      if (options.responseFormat?.type === "json_object") {
        systemPrompt += "\n\nIMPORTANT: You MUST respond with valid JSON only. No other text before or after the JSON.";
      }

      const response = await client.messages.create({
        model: options.model || "claude-sonnet-4-5",
        max_tokens: options.maxTokens ?? 8192,
        system: systemPrompt,
        messages,
      });

      // Extract all text content blocks and concatenate them
      const textParts: string[] = [];
      for (const block of response.content) {
        if (block.type === "text") {
          textParts.push(block.text);
        }
      }
      const content = textParts.join("\n");
      
      if (!content) {
        throw new Error("Empty response from Anthropic - no text content blocks found");
      }
      
      return {
        content,
        provider: "anthropic",
        model: options.model || "claude-sonnet-4-5",
      };
    },
  };
}

// ============================================================================
// Gemini Provider (using HTTP client for Replit AI Integrations)
// ============================================================================

function createGeminiProvider(): UnifiedAIProvider | null {
  const baseURL = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  
  if (!baseURL || !apiKey) return null;

  return {
    name: "gemini",
    model: "gemini-2.5-flash",
    generateCompletion: async (options) => {
      const systemMessage = options.messages.find(m => m.role === "system");
      const userMessages = options.messages.filter(m => m.role !== "system");
      
      // Build contents array in Gemini format
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
      
      // Add system instruction as first user message if present
      if (systemMessage) {
        contents.push({
          role: "user",
          parts: [{ text: `[System Instructions]\n${systemMessage.content}` }],
        });
        contents.push({
          role: "model",
          parts: [{ text: "I understand and will follow these instructions." }],
        });
      }
      
      for (const msg of userMessages) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }

      // Add JSON format instruction if needed
      if (options.responseFormat?.type === "json_object" && contents.length > 0) {
        const lastContent = contents[contents.length - 1];
        if (lastContent.role === "user") {
          lastContent.parts[0].text += "\n\nIMPORTANT: Respond with valid JSON only. No other text.";
        }
      }

      const modelName = options.model || "gemini-2.5-flash";
      const url = `${baseURL}/v1beta/models/${modelName}:generateContent`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: options.temperature ?? 0.7,
            maxOutputTokens: options.maxTokens ?? 8192,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!content) {
        throw new Error("Empty response from Gemini");
      }
      
      return {
        content,
        provider: "gemini",
        model: modelName,
      };
    },
  };
}

// ============================================================================
// OpenRouter Provider (OpenAI-compatible)
// ============================================================================

function createOpenRouterProvider(): UnifiedAIProvider | null {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.openrouterapi || process.env.OPENROUTERAPI;
  if (!apiKey) return null;
  
  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.APP_URL || "https://travi.world",
      "X-Title": "Travi CMS",
    },
  });

  return {
    name: "openrouter",
    model: "anthropic/claude-3.5-sonnet",
    generateCompletion: async (options) => {
      const completion = await client.chat.completions.create({
        model: options.model || "anthropic/claude-3.5-sonnet",
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 12000,
      });
      return {
        content: completion.choices[0]?.message?.content || "",
        provider: "openrouter",
        model: options.model || "anthropic/claude-3.5-sonnet",
      };
    },
  };
}

// ============================================================================
// DeepSeek Provider (OpenAI-compatible)
// ============================================================================

function createDeepSeekProvider(): UnifiedAIProvider | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });

  return {
    name: "deepseek",
    model: "deepseek-chat",
    generateCompletion: async (options) => {
      const completion = await client.chat.completions.create({
        model: options.model || "deepseek-chat",
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 12000,
      });
      return {
        content: completion.choices[0]?.message?.content || "",
        provider: "deepseek",
        model: options.model || "deepseek-chat",
      };
    },
  };
}

// ============================================================================
// Provider Availability Tracking
// ============================================================================

const failedProviders = new Set<string>();
const failedProviderExpiry = new Map<string, number>();

export function markProviderFailed(provider: string): void {
  failedProviders.add(provider);
  failedProviderExpiry.set(provider, Date.now() + 5 * 60 * 1000);
}

function isProviderAvailable(provider: string): boolean {
  if (!failedProviders.has(provider)) return true;
  const expiry = failedProviderExpiry.get(provider);
  if (expiry && Date.now() > expiry) {
    failedProviders.delete(provider);
    failedProviderExpiry.delete(provider);
    return true;
  }
  return false;
}

// ============================================================================
// Get All Available Providers (Unified Interface)
// ============================================================================

export function getAllUnifiedProviders(): UnifiedAIProvider[] {
  const providers: UnifiedAIProvider[] = [];

  if (isProviderAvailable("openai")) {
    const openai = createOpenAIProvider();
    if (openai) providers.push(openai);
  }

  if (isProviderAvailable("anthropic")) {
    const anthropic = createAnthropicProvider();
    if (anthropic) providers.push(anthropic);
  }

  if (isProviderAvailable("gemini")) {
    const gemini = createGeminiProvider();
    if (gemini) providers.push(gemini);
  }

  if (isProviderAvailable("openrouter")) {
    const openrouter = createOpenRouterProvider();
    if (openrouter) providers.push(openrouter);
  }

  if (isProviderAvailable("deepseek")) {
    const deepseek = createDeepSeekProvider();
    if (deepseek) providers.push(deepseek);
  }

  return providers;
}

// ============================================================================
// Legacy OpenAI-compatible interface (for backwards compatibility)
// ============================================================================

export function getOpenAIClient(): OpenAI | null {
  const apiKey = getValidOpenAIKey();
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });
}

export type AIProvider = { client: OpenAI; provider: string; model: string };

export function getAllAIClients(): AIProvider[] {
  const clients: AIProvider[] = [];

  if (isProviderAvailable("openai")) {
    const openai = getOpenAIClient();
    if (openai) {
      clients.push({ client: openai, provider: "openai", model: "gpt-4o-mini" });
    }
  }

  if (isProviderAvailable("openrouter")) {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.openrouterapi;
    if (apiKey) {
      const client = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": process.env.APP_URL || "https://travi.world",
          "X-Title": "Travi CMS",
        },
      });
      clients.push({ client, provider: "openrouter", model: "anthropic/claude-3.5-sonnet" });
    }
  }

  if (isProviderAvailable("deepseek")) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (apiKey) {
      const client = new OpenAI({
        apiKey,
        baseURL: "https://api.deepseek.com/v1",
      });
      clients.push({ client, provider: "deepseek", model: "deepseek-chat" });
    }
  }

  return clients;
}

export function getAIClient(): { client: OpenAI; provider: string } | null {
  const clients = getAllAIClients();
  if (clients.length > 0) {
    return { client: clients[0].client, provider: clients[0].provider };
  }
  console.warn("[AI Generator] No AI provider configured");
  return null;
}

export function getOpenAIClientForImages(): OpenAI | null {
  const apiKey = getValidOpenAIKey();
  if (!apiKey) {
    console.warn("[AI Generator] No valid OpenAI API key for DALL-E");
    return null;
  }
  return new OpenAI({ apiKey });
}

// ============================================================================
// Model Configuration
// ============================================================================

const MODEL_CONFIGS: Record<ContentTier, Omit<ModelConfig, 'model'>> = {
  premium: {
    maxTokens: 16000,
    temperature: 0.7,
  },
  standard: {
    maxTokens: 8000,
    temperature: 0.7,
  },
};

export function getModelForProvider(provider: string, tier: ContentTier = "standard"): string {
  switch (provider) {
    case "openai":
      return tier === "premium" ? "gpt-4o" : "gpt-4o-mini";
    case "anthropic":
      return "claude-sonnet-4-5";
    case "gemini":
      return tier === "premium" ? "gemini-2.5-pro" : "gemini-2.5-flash";
    case "openrouter":
      return tier === "premium" ? "anthropic/claude-3.5-sonnet" : "anthropic/claude-3.5-sonnet";
    case "deepseek":
      return "deepseek-chat";
    default:
      return "gpt-4o-mini";
  }
}

export function getContentTier(contentType: string): ContentTier {
  const premiumTypes = ['hotel', 'attraction', 'itinerary'];
  return premiumTypes.includes(contentType.toLowerCase()) ? 'premium' : 'standard';
}

export function getModelConfig(tier: ContentTier, provider: string = "openai"): ModelConfig {
  const config = MODEL_CONFIGS[tier];
  return {
    model: getModelForProvider(provider, tier),
    maxTokens: config.maxTokens,
    temperature: config.temperature,
  };
}
