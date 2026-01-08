// Voice types and interfaces
export interface VoiceModel {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: string;
  description?: string;
}

export interface VoiceStats {
  total_characters: number;
  total_requests: number;
  total_cost: number;
  today_characters: number;
  today_requests: number;
  today_cost: number;
  limit?: number;
}

export interface ModeVoiceMapping {
  [mode: string]: {
    male: VoiceModel;
    female: VoiceModel;
  };
}

export const DEFAULT_VOICE_MODELS: ModeVoiceMapping = {
  personal_friend: {
    male: { id: 'aura-asteria-en', name: 'Asteria', gender: 'male', language: 'en', description: 'Friendly and casual' },
    female: { id: 'aura-luna-en', name: 'Luna', gender: 'female', language: 'en', description: 'Warm and supportive' }
  },
  sales_agent: {
    male: { id: 'aura-orion-en', name: 'Orion', gender: 'male', language: 'en', description: 'Confident and professional' },
    female: { id: 'aura-athena-en', name: 'Athena', gender: 'female', language: 'en', description: 'Persuasive and articulate' }
  },
  student_tutor: {
    male: { id: 'aura-zeus-en', name: 'Zeus', gender: 'male', language: 'en', description: 'Clear and educational' },
    female: { id: 'aura-hera-en', name: 'Hera', gender: 'female', language: 'en', description: 'Patient and encouraging' }
  },
  kids_learning: {
    male: { id: 'aura-asteria-en', name: 'Asteria', gender: 'male', language: 'en', description: 'Fun and energetic' },
    female: { id: 'aura-luna-en', name: 'Luna', gender: 'female', language: 'en', description: 'Playful and gentle' }
  },
  christian_companion: {
    male: { id: 'aura-orion-en', name: 'Orion', gender: 'male', language: 'en', description: 'Warm and reverent' },
    female: { id: 'aura-hera-en', name: 'Hera', gender: 'female', language: 'en', description: 'Compassionate and wise' }
  },
  customer_service: {
    male: { id: 'aura-zeus-en', name: 'Zeus', gender: 'male', language: 'en', description: 'Professional and helpful' },
    female: { id: 'aura-athena-en', name: 'Athena', gender: 'female', language: 'en', description: 'Polite and empathetic' }
  },
  psychology_expert: {
    male: { id: 'aura-apollo-en', name: 'Apollo', gender: 'male', language: 'en', description: 'Calm and analytical' },
    female: { id: 'aura-thalia-en', name: 'Thalia', gender: 'female', language: 'en', description: 'Gentle and understanding' }
  },
  business_mentor: {
    male: { id: 'aura-zeus-en', name: 'Zeus', gender: 'male', language: 'en', description: 'Authoritative and strategic' },
    female: { id: 'aura-athena-en', name: 'Athena', gender: 'female', language: 'en', description: 'Professional and calm' }
  },
  weight_loss_coach: {
    male: { id: 'aura-orion-en', name: 'Orion', gender: 'male', language: 'en', description: 'Motivating and energetic' },
    female: { id: 'aura-hera-en', name: 'Hera', gender: 'female', language: 'en', description: 'Encouraging and supportive' }
  }
};

export const DISABLED_MODES = ['student_tutor'];

export function getVoiceForMode(mode: string, gender: 'male' | 'female' = 'male'): VoiceModel | null {
  if (DISABLED_MODES.includes(mode)) {
    return null;
  }
  
  const modeMapping = DEFAULT_VOICE_MODELS[mode as keyof typeof DEFAULT_VOICE_MODELS];
  if (!modeMapping) {
    return DEFAULT_VOICE_MODELS.personal_friend[gender];
  }
  
  return modeMapping[gender];
}

export function isModeVoiceEnabled(mode: string): boolean {
  return !DISABLED_MODES.includes(mode);
}