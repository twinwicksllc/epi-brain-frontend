export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date | string;
  depth?: number;
  turn_score?: number;
  scoring_source?: string;
}

export interface Conversation {
  id: string;
  title: string;
  mode: string;
  created_at: Date;
  updated_at: Date;
  message_count: number;
  current_depth?: number;
  depth_enabled?: boolean;
  user_id?: string;
}

export interface ClarityMetrics {
  clarity_score: number;
  confidence_level: number;
  topic_coherence: number;
  depth_progression: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: "FREE" | "PRO" | "ENTERPRISE";
  is_admin?: boolean;
  created_at: Date;
  last_login?: Date;
  message_count: number;
  voice_usage_count: number;
  current_phase?: "discovery" | "strategy" | "action";
  clarity_metrics?: ClarityMetrics;
}

export interface AI_MODE {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  system_prompt: string;
  is_default?: boolean;
}

export interface VoiceUsage {
  id: string;
  user_id: string;
  conversation_id?: string;
  characters_used: number;
  model_used: string;
  cost_usd: number;
  created_at: Date;
}

export interface ChatResponse {
  response: string;
  conversation?: Conversation;
  current_depth?: number;
  depth_enabled?: boolean;
  message_id?: string;
}

export interface ConversationResponse {
  id: string;
  title: string;
  mode: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  current_depth?: number;
  depth_enabled?: boolean;
  messages?: Message[];
}
export interface SiloContext {
  siloId: string;
  siloName: string;
  initialGreeting: string;
}

export const SILO_CONTEXTS: Record<string, SiloContext> = {
  general: {
    siloId: 'general',
    siloName: 'EPI Brain',
    initialGreeting: "Hi! I'm EPI, your AI companion. What's your name?",
  },
  sales_mentor: {
    siloId: 'sales_mentor',
    siloName: 'EPI Sales Tutor',
    initialGreeting: 'Hi, I\'m EPI. Ready to sharpen your sales skills and close more deals? What should I call you?',
  },
  spiritual_guide: {
    siloId: 'spiritual_guide',
    siloName: 'EPI Spiritual Guide',
    initialGreeting: 'Welcome. I\'m here to walk with you on your spiritual journey today. What is your name?',
  },
  education_coach: {
    siloId: 'education_coach',
    siloName: 'EPI Education Coach',
    initialGreeting: 'Hello! I\'m EPI, your learning companion. Ready to explore and grow? What\'s your name?',
  },
};
