'use client'

import { useState, useEffect } from 'react'
import { X, Brain, Shield, Volume2, User as UserIcon, Save, Loader2 } from 'lucide-react'
import { userApi } from '@/lib/api/client'

const MODE_NAMES: { [key: string]: string } = {
  personal_friend: 'Personal Friend',
  sales_agent: 'Sales Agent',
  student_tutor: 'Student/Tutor',
  kids_learning: 'Kids Learning',
  christian_companion: 'Christian Companion',
  customer_service: 'Customer Service',
  psychology_expert: 'Psychology Expert',
  business_mentor: 'Business Mentor',
  weight_loss_coach: 'Weight Loss Coach',
}

const AVAILABLE_MODES = Object.keys(MODE_NAMES).map(id => ({
  value: id,
  label: MODE_NAMES[id],
}))

interface UserPreferences {
  accountability_style: 'tactical' | 'grace' | 'analyst' | 'adaptive'
  sentiment_override_enabled: boolean
  depth_sensitivity_enabled: boolean
  voice_preference: 'male' | 'female' | 'none'
  primary_mode: string
}

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    accountability_style: 'adaptive',
    sentiment_override_enabled: true,
    depth_sensitivity_enabled: true,
    voice_preference: 'none',
    primary_mode: 'personal_friend'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      
      userApi.getProfile()
        .then(data => {
          if (data.accountability_style) {
            setPreferences(prev => ({
              ...prev,
              accountability_style: data.accountability_style,
              sentiment_override_enabled: data.sentiment_override_enabled || false,
              depth_sensitivity_enabled: data.depth_sensitivity_enabled || false,
              voice_preference: data.voice_preference || 'none',
              primary_mode: data.primary_mode || 'personal_friend'
            }))
          }
          setIsLoading(false)
        })
        .catch(err => {
          console.error('Failed to load preferences:', err)
          setIsLoading(false)
        })
    }
  }, [isOpen])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      const updatedUser = await userApi.updateProfile({
        accountability_style: preferences.accountability_style,
        sentiment_override_enabled: preferences.sentiment_override_enabled,
        depth_sensitivity_enabled: preferences.depth_sensitivity_enabled,
        voice_preference: preferences.voice_preference,
        primary_mode: preferences.primary_mode
      })
      
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
      
      setSaveMessage('Settings saved successfully!')
      setTimeout(() => {
        setSaveMessage('')
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Failed to save preferences:', error)
      setSaveMessage('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Accountability Style */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Accountability Style
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How should the AI hold you accountable for your goals?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, accountability_style: 'tactical' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      preferences.accountability_style === 'tactical'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">Tactical</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Direct, no-nonsense approach
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, accountability_style: 'grace' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      preferences.accountability_style === 'grace'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">Grace</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Supportive and understanding
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, accountability_style: 'analyst' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      preferences.accountability_style === 'analyst'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">Analyst</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Logical and data-driven
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, accountability_style: 'adaptive' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      preferences.accountability_style === 'adaptive'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">Adaptive</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Adjusts to your situation
                    </div>
                  </button>
                </div>
              </div>

              {/* AI Behavior */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Behavior
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Sentiment Override
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Allow AI to adjust tone based on your mood
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreferences(prev => ({ 
                        ...prev, 
                        sentiment_override_enabled: !prev.sentiment_override_enabled 
                      }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.sentiment_override_enabled
                          ? 'bg-purple-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        preferences.sentiment_override_enabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Depth Sensitivity
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Allow AI to adjust tone based on conversation depth
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreferences(prev => ({ 
                        ...prev, 
                        depth_sensitivity_enabled: !prev.depth_sensitivity_enabled 
                      }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.depth_sensitivity_enabled
                          ? 'bg-purple-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        preferences.depth_sensitivity_enabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Voice Preference */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Voice Preference
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, voice_preference: 'male' }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      preferences.voice_preference === 'male'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, voice_preference: 'female' }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      preferences.voice_preference === 'female'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, voice_preference: 'none' }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      preferences.voice_preference === 'none'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    None
                  </button>
                </div>
              </div>

              {/* Primary Mode */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Primary AI Mode
                  </h3>
                </div>
                <select
                  value={preferences.primary_mode}
                  onChange={(e) => setPreferences(prev => ({ ...prev, primary_mode: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none transition-colors"
                >
                  {AVAILABLE_MODES.map(mode => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {saveMessage && (
            <div className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </div>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Settings({ className }: { className?: string }) {
  return <div className={className} />
}