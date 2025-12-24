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
 */
export function getValidOpenAIKey(): string | null {
  // Check OPENAI_API_KEY first (user's direct key)
  const directKey = process.env.OPENAI_API_KEY;
  if (directKey && !directKey.includes('DUMMY')) {
    return directKey;
  }

  // Fallback to AI integrations key
  const integrationsKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (integrationsKey && !integrationsKey.includes('DUMMY')) {
    return integrationsKey;
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
 * Gemini via OpenAI-compatible API
 */
export function getGeminiClient(): OpenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI || process.env.gemini;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
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
 * Get best available AI client with fallbacks
 * Priority: OpenAI → Gemini → OpenRouter
 */
export function getAIClient(): { client: OpenAI; provider: string } | null {
  // Try OpenAI first
  const openai = getOpenAIClient();
  if (openai) {
    return { client: openai, provider: "openai" };
  }

  // Try Gemini
  const gemini = getGeminiClient();
  if (gemini) {
    return { client: gemini, provider: "gemini" };
  }

  // Try OpenRouter
  const openrouter = getOpenRouterClient();
  if (openrouter) {
    return { client: openrouter, provider: "openrouter" };
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
