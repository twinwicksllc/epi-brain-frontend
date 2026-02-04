"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, User, Settings, Archive } from "lucide-react";
import ModeSelector from "./ModeSelector";
import VoiceToggle from "./VoiceToggle";
import SettingsModal from "./SettingsModal";
import { ClarityMetrics } from "@/types";

interface HeaderProps {
  user: any;
  onMenuClick: () => void;
  currentMode: string;
  onModeChange: (mode: string) => void;
  isVoiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
  selectedVoiceGender: string;
  onVoiceGenderChange: (gender: string) => void;
  voiceStats: any;
  isVoiceAvailable: boolean;
  siloName?: string;
  currentPhase?: "discovery" | "strategy" | "action" | null;
  clarityMetrics?: ClarityMetrics | null;
  onVaultClick?: () => void;
}

export default function Header({
  user,
  onMenuClick,
  currentMode,
  onModeChange,
  isVoiceEnabled,
  onVoiceToggle,
  selectedVoiceGender,
  onVoiceGenderChange,
  voiceStats,
  isVoiceAvailable,
  siloName = "EPI Brain",
  currentPhase,
  onVaultClick,
  clarityMetrics,
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    window.location.href = "/login";
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  return (
    <>
      <header className="bg-[#2d1b4e]/80 backdrop-blur-md border-b border-[#7B3FF2]/30 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Menu button + Mode selector */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-lg hover:bg-[#7B3FF2]/20 transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>

            <Link href="/" className="hidden md:block">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{siloName}</h1>
                {siloName !== "EPI Brain" && (
                  <span className="text-xs px-2 py-1 bg-[#7B3FF2]/30 border border-[#7B3FF2]/50 rounded-full text-white">
                    {siloName.replace('EPI ', '')}
                  </span>
                )}
              </div>
            </Link>

            {/* Mode Selector - MOVED TO LEFT SIDE */}
            <div className="hidden md:block">
              <ModeSelector
                currentMode={currentMode}
                onModeChange={onModeChange}
              />
            </div>
          </div>

          {/* Rigault Button */}
            {onVaultClick && (
              <button
                onClick={onVaultClick}
                className="p-2 rounded-lg hover:bg-[#7B3FF2]/20 transition-colors group relative"
                title="Open Vault"
              >
                <Archive className="w-5 h-5 text-white group-hover:text-[#A78BFA]" />
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  🔐 Vault
                </span>
              </button>
            )}

            {/* Vht side - Voice toggle + User menu */}
          <div className="flex items-center space-x-4">
            {/* Voice Toggle */}
            {isVoiceAvailable && (
              <div className="hidden md:block">
                <VoiceToggle
                  isEnabled={isVoiceEnabled}
                  onToggle={onVoiceToggle}
                  currentMode={currentMode}
                  selectedGender={selectedVoiceGender}
                  onGenderChange={onVoiceGenderChange}
                  voiceStats={voiceStats}
                />
              </div>
            )}

            {/* Mobile Mode Selector (shown in menu area) */}
            <div className="md:hidden">
              <ModeSelector
                currentMode={currentMode}
                onModeChange={onModeChange}
              />
            </div>

            {/* User Avatar/Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7B3FF2] hover:bg-[#6B46C1] transition-colors"
              >
                <User className="w-5 h-5 text-white" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[#2d1b4e]/95 backdrop-blur-md rounded-lg shadow-xl border border-[#7B3FF2]/30 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#7B3FF2]/20">
                    <p className="text-sm font-medium text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-white/60">{user?.email}</p>
                  </div>
                  
                  {/* Current Phase and Clarity Metrics */}
                  <div className="px-4 py-3 border-b border-[#7B3FF2]/20 bg-gradient-to-b from-[#7B3FF2]/10 to-transparent">
                    {currentPhase && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-[#A78BFA] mb-1">Current Phase</p>
                        <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#7B3FF2]/40 to-[#6B46C1]/40 border border-[#A78BFA]/50 rounded-full shadow-lg shadow-[#7B3FF2]/50 backdrop-blur-md">
                          <p className="text-xs font-semibold text-[#E9D5FF] capitalize tracking-wide">
                            {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Always show Clarity Metrics container */}
                    <div className="bg-gradient-to-br from-[#7B3FF2]/15 to-[#6B46C1]/10 border border-[#A78BFA]/30 rounded-lg p-3 shadow-lg shadow-[#7B3FF2]/40 backdrop-blur-md">
                      <p className="text-xs font-bold text-[#E9D5FF] mb-2.5 uppercase tracking-wider">Clarity Metrics</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-[#C4B5FD]">Clarity Score:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#2d1b4e] rounded-full overflow-hidden border border-[#7B3FF2]/30">
                              <div 
                                className="h-full bg-gradient-to-r from-[#A78BFA] to-[#7B3FF2] shadow-lg shadow-[#A78BFA]/60 rounded-full transition-all duration-300"
                                style={{width: `${clarityMetrics ? Math.min(clarityMetrics.clarity_score * 100, 100) : 0}%`}}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#A78BFA] min-w-[2.5rem] text-right">
                              {clarityMetrics ? `${(clarityMetrics.clarity_score * 100).toFixed(1)}%` : 'Calculating...'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-[#C4B5FD]">Confidence:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#2d1b4e] rounded-full overflow-hidden border border-[#7B3FF2]/30">
                              <div 
                                className="h-full bg-gradient-to-r from-[#A78BFA] to-[#7B3FF2] shadow-lg shadow-[#A78BFA]/60 rounded-full transition-all duration-300"
                                style={{width: `${clarityMetrics ? Math.min(clarityMetrics.confidence_level * 100, 100) : 0}%`}}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#A78BFA] min-w-[2.5rem] text-right">
                              {clarityMetrics ? `${(clarityMetrics.confidence_level * 100).toFixed(1)}%` : 'Calculating...'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-[#C4B5FD]">Topic Coherence:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#2d1b4e] rounded-full overflow-hidden border border-[#7B3FF2]/30">
                              <div 
                                className="h-full bg-gradient-to-r from-[#A78BFA] to-[#7B3FF2] shadow-lg shadow-[#A78BFA]/60 rounded-full transition-all duration-300"
                                style={{width: `${clarityMetrics ? Math.min(clarityMetrics.topic_coherence * 100, 100) : 0}%`}}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#A78BFA] min-w-[2.5rem] text-right">
                              {clarityMetrics ? `${(clarityMetrics.topic_coherence * 100).toFixed(1)}%` : 'Calculating...'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-[#C4B5FD]">Depth Progression:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#2d1b4e] rounded-full overflow-hidden border border-[#7B3FF2]/30">
                              <div 
                                className="h-full bg-gradient-to-r from-[#A78BFA] to-[#7B3FF2] shadow-lg shadow-[#A78BFA]/60 rounded-full transition-all duration-300"
                                style={{width: `${clarityMetrics ? Math.min(clarityMetrics.depth_progression * 100, 100) : 0}%`}}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#A78BFA] min-w-[2.5rem] text-right">
                              {clarityMetrics ? `${(clarityMetrics.depth_progression * 100).toFixed(1)}%` : 'Calculating...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Voice Toggle */}
                  {isVoiceAvailable && (
                    <div className="px-4 py-3 border-b border-[#7B3FF2]/20">
                      <VoiceToggle
                        isEnabled={isVoiceEnabled}
                        onToggle={onVoiceToggle}
                        currentMode={currentMode}
                        selectedGender={selectedVoiceGender}
                        onGenderChange={onVoiceGenderChange}
                        voiceStats={voiceStats}
                      />
                    </div>
                  )}
                  
                  <div className="px-4 py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        setShowSettingsModal(true)
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-[#7B3FF2]/20 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-[#7B3FF2]/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Settings Modal */}
    <SettingsModal
      isOpen={showSettingsModal}
      onClose={() => setShowSettingsModal(false)}
    />
    </>
  );
}