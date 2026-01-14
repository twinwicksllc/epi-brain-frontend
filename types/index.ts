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

export interface User {
  id: string;
  email: string;
  name: string;
  tier: "FREE" | "PRO" | "ENTERPRISE";
  created_at: Date;
  last_login?: Date;
  message_count: number;
  voice_usage_count: number;
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