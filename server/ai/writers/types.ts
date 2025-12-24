/**
 * AI Writers System - Type Definitions
 * 
 * Types for the new AI Writers virtual newsroom system
 */

export interface ContentGenerationRequest {
  writerId?: string; // Optional - auto-assigns if not provided
  contentType: string;
  topic: string;
  keywords?: string[];
  locale?: string;
  tier?: 'free' | 'premium' | 'enterprise';
}

export interface GeneratedContent {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  blocks: any[];
  writerId: string;
  writerName: string;
  generatedByAI: boolean;
  writerVoiceScore: number;
  [key: string]: any;
}

export interface Writer {
  id: string;
  name: string;
  expertise: string;
  personality: string;
  writingStyle: string;
  voicePrompt: string;
  isActive: boolean;
  totalArticles: number;
  avgVoiceScore: number;
}

export interface WriterAssignment {
  writer: Writer;
  matchScore: number;
  reason: string;
}

export interface VoiceValidationResult {
  score: number; // 0-100
  consistency: {
    tone: number;
    style: number;
    vocabulary: number;
  };
  suggestions?: string[];
}
