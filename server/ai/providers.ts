/**
 * AI Provider Management
 * Handles multi-provider AI client initialization with fallback chain
 */

import OpenAI from "openai";
import type { ContentTier, ModelConfig } from "./types";

// ============================================================================
// API Key Validation
// ============================================================================

/**
 * Get a valid OpenAI API key (skips dummy keys)
 * Priority: Replit AI integrations key (managed) → User's direct key
 */
export function getValidOpenAIKey(): string | null {
  // Prefer AI integrations key first (Replit managed, reliable quota)
  const integrationsKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (integrationsKey && !integrationsKey.includes('DUMMY')) {
    return integrationsKey;
  }

  // Fallback to user's direct key
  const directKey = process.env.OPENAI_API_KEY;
  if (directKey && !directKey.includes('DUMMY')) {
    return directKey;
  }

  return null;
}

// ============================================================================
// Provider Clients
// ============================================================================

/**
 * Client for text generation (GPT models) - can use proxy
 */
export function getOpenAIClient(): OpenAI | null {
  const apiKey = getValidOpenAIKey();
  if (!apiKey) {
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });
}

/**
 * Gemini via Replit AI Integrations (OpenAI-compatible API)
 * ONLY works with AI_INTEGRATIONS_GEMINI_BASE_URL set - native Gemini doesn't support /chat/completions
 */
export function getGeminiClient(): OpenAI | null {
  // MUST have Replit AI integrations base URL - native Gemini doesn't support chat completions
  const baseURL = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
  if (!baseURL) {
    return null;
  }
  
  // API key can be dummy value for Replit integrations
  const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "dummy-key";
  
  return new OpenAI({
    apiKey,
    baseURL,
  });
}

/**
 * Anthropic (Claude) via Replit AI Integrations (OpenAI-compatible API)
 * ONLY works with AI_INTEGRATIONS_ANTHROPIC_BASE_URL set - native Anthropic uses different API format
 */
export function getAnthropicClient(): OpenAI | null {
  // MUST have Replit AI integrations base URL - native Anthropic uses messages API, not chat completions
  const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
  if (!baseURL) {
    return null;
  }
  
  // API key can be dummy value for Replit integrations
  const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY || "dummy-key";
  
  return new OpenAI({
    apiKey,
    baseURL,
  });
}

/**
 * OpenRouter - supports many models
 */
export function getOpenRouterClient(): OpenAI | null {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.openrouterapi || process.env.OPENROUTERAPI;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.APP_URL || "https://travi.world",
      "X-Title": "Travi CMS",
    },
  });
}

/**
 * DeepSeek API
 */
export function getDeepSeekClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });
}

// Track failed providers to skip them temporarily
const failedProviders = new Set<string>();
const failedProviderExpiry = new Map<string, number>();

export function markProviderFailed(provider: string): void {
  failedProviders.add(provider);
  // Expire after 5 minutes
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

export type AIProvider = { client: OpenAI; provider: string; model: string };

/**
 * Get all available AI clients for fallback chain
 * Priority: OpenAI → Gemini → Anthropic → OpenRouter → DeepSeek
 */
export function getAllAIClients(): AIProvider[] {
  const clients: AIProvider[] = [];

  // OpenAI
  if (isProviderAvailable("openai")) {
    const openai = getOpenAIClient();
    if (openai) {
      clients.push({ client: openai, provider: "openai", model: "gpt-4o-mini" });
    }
  }

  // Gemini (Replit AI Integrations only)
  if (isProviderAvailable("gemini")) {
    const gemini = getGeminiClient();
    if (gemini) {
      // Use gemini-2.5-flash for balanced performance
      clients.push({ client: gemini, provider: "gemini", model: "gemini-2.5-flash" });
    }
  }

  // Anthropic Claude (Replit AI Integrations only)
  if (isProviderAvailable("anthropic")) {
    const anthropic = getAnthropicClient();
    if (anthropic) {
      // Use claude-sonnet-4-5 for balanced performance
      clients.push({ client: anthropic, provider: "anthropic", model: "claude-sonnet-4-5" });
    }
  }

  // OpenRouter
  if (isProviderAvailable("openrouter")) {
    const openrouter = getOpenRouterClient();
    if (openrouter) {
      clients.push({ client: openrouter, provider: "openrouter", model: "anthropic/claude-3.5-sonnet" });
    }
  }

  // DeepSeek
  if (isProviderAvailable("deepseek")) {
    const deepseek = getDeepSeekClient();
    if (deepseek) {
      clients.push({ client: deepseek, provider: "deepseek", model: "deepseek-chat" });
    }
  }

  return clients;
}

/**
 * Get best available AI client with fallbacks
 * Priority: OpenAI → Gemini → Anthropic → OpenRouter → DeepSeek
 */
export function getAIClient(): { client: OpenAI; provider: string } | null {
  const clients = getAllAIClients();
  if (clients.length > 0) {
    return { client: clients[0].client, provider: clients[0].provider };
  }

  console.warn("[AI Generator] No AI provider configured");
  return null;
}

/**
 * Client for image generation (DALL-E) - must use direct API, no proxy
 */
export function getOpenAIClientForImages(): OpenAI | null {
  const apiKey = getValidOpenAIKey();
  if (!apiKey) {
    console.warn("[AI Generator] No valid OpenAI API key for DALL-E");
    return null;
  }
  return new OpenAI({
    apiKey,
    // No baseURL - DALL-E requires direct OpenAI API
  });
}

// ============================================================================
// Model Configuration
// ============================================================================

/**
 * Model configurations for different content tiers
 * - GPT-4o: Premium content generation (hotels, complex articles) - $2.50/$10 per 1M tokens
 * - GPT-4o-mini: Standard tasks (prompts, SEO, translations) - $0.15/$0.60 per 1M tokens
 * Estimated savings: 80-95% on non-premium tasks
 */
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

/**
 * Get appropriate model based on provider and tier
 */
export function getModelForProvider(provider: string, tier: ContentTier = "standard"): string {
  switch (provider) {
    case "openai":
      return tier === "premium" ? "gpt-4o" : "gpt-4o-mini";
    case "gemini":
      return tier === "premium" ? "gemini-1.5-pro" : "gemini-1.5-flash";
    case "openrouter":
      return tier === "premium" ? "google/gemini-pro-1.5" : "google/gemini-flash-1.5";
    default:
      return "gpt-4o-mini";
  }
}

/**
 * Determine tier based on content type
 * Premium: Complex, high-value content that needs best quality
 */
export function getContentTier(contentType: string): ContentTier {
  const premiumTypes = ['hotel', 'attraction', 'itinerary'];
  return premiumTypes.includes(contentType.toLowerCase()) ? 'premium' : 'standard';
}

/**
 * Get full model configuration for a tier and provider
 */
export function getModelConfig(tier: ContentTier, provider: string = "openai"): ModelConfig {
  const config = MODEL_CONFIGS[tier];
  return {
    model: getModelForProvider(provider, tier),
    maxTokens: config.maxTokens,
    temperature: config.temperature,
  };
}
