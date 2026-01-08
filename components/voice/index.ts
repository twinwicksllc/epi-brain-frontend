// Export all voice components
export { default as VoiceToggle } from '../VoiceToggle';
export { default as GenderSelector } from '../GenderSelector';
export { default as AudioVisualizer } from '../AudioVisualizer';

// Export voice utilities
export { default as VoiceManager } from '../../lib/voice/voiceManager';
export { default as AudioPlayer } from '../../lib/voice/audioPlayer';
export { default as VoiceStreamClient } from '../../lib/voice/websocketClient';

// Export types
export type {
  VoiceModel,
  VoiceStats,
  ModeVoiceMapping
} from '../../lib/voice/types';

export {
  DEFAULT_VOICE_MODELS,
  DISABLED_MODES,
  getVoiceForMode,
  isModeVoiceEnabled
} from '../../lib/voice/types';