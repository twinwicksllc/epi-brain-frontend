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
    male: { id: 'aura-2-arcas-en', name: 'Arcas', gender: 'male', language: 'en', description: 'Natural, smooth, clear - comfortable conversation' },
    female: { id: 'aura-2-helena-en', name: 'Helena', gender: 'female', language: 'en', description: 'Caring, natural, friendly - emotional support' }
  },
  sales_agent: {
    male: { id: 'aura-2-arcas-en', name: 'Arcas', gender: 'male', language: 'en', description: 'Natural, smooth, clear - professional sales' },
    female: { id: 'aura-2-thalia-en', name: 'Thalia', gender: 'female', language: 'en', description: 'Clear, confident, energetic - ideal for sales' }
  },
  student_tutor: {
    male: { id: 'aura-arcas-en', name: 'Arcas', gender: 'male', language: 'en', description: 'Clear and educational' },
    female: { id: 'aura-2-helena-en', name: 'Helena', gender: 'female', language: 'en', description: 'Patient and encouraging' }
  },
  kids_learning: {
    male: { id: 'aura-2-aries-en', name: 'Aries', gender: 'male', language: 'en', description: 'Warm, energetic, caring - engaging for children' },
    female: { id: 'aura-2-thalia-en', name: 'Thalia', gender: 'female', language: 'en', description: 'Clear, confident, energetic - engaging for children' }
  },
  christian_companion: {
    male: { id: 'aura-2-aries-en', name: 'Aries', gender: 'male', language: 'en', description: 'Warm, energetic, caring - supportive guidance' },
    female: { id: 'aura-2-helena-en', name: 'Helena', gender: 'female', language: 'en', description: 'Caring, natural - supportive spiritual guidance' }
  },
  customer_service: {
    male: { id: 'aura-2-arcas-en', name: 'Arcas', gender: 'male', language: 'en', description: 'Natural, smooth, clear - professional support' },
    female: { id: 'aura-2-thalia-en', name: 'Thalia', gender: 'female', language: 'en', description: 'Clear, confident, energetic - efficient problem-solving' }
  },
  psychology_expert: {
    male: { id: 'aura-2-arcas-en', name: 'Arcas', gender: 'male', language: 'en', description: 'Natural, smooth - therapeutic presence' },
    female: { id: 'aura-2-helena-en', name: 'Helena', gender: 'female', language: 'en', description: 'Caring, natural, friendly - therapeutic empathy' }
  },
  business_mentor: {
    male: { id: 'aura-2-zeus-en', name: 'Zeus', gender: 'male', language: 'en', description: 'Deep, trustworthy, smooth - authority and experience' },
    female: { id: 'aura-2-athena-en', name: 'Athena', gender: 'female', language: 'en', description: 'Calm, smooth, professional - business authority' }
  },
  weight_loss_coach: {
    male: { id: 'aura-2-aries-en', name: 'Aries', gender: 'male', language: 'en', description: 'Warm, energetic, caring - motivational support' },
    female: { id: 'aura-2-thalia-en', name: 'Thalia', gender: 'female', language: 'en', description: 'Clear, confident, energetic - motivational coaching' }
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