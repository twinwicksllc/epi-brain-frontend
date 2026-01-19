"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, User, Settings } from "lucide-react";
import ModeSelector from "./ModeSelector";
import VoiceToggle from "./VoiceToggle";
import SettingsModal from "./SettingsModal";

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
              <h1 className="text-xl font-bold text-white">EPI Brain</h1>
            </Link>

            {/* Mode Selector - MOVED TO LEFT SIDE */}
            <div className="hidden md:block">
              <ModeSelector
                currentMode={currentMode}
                onModeChange={onModeChange}
              />
            </div>
          </div>

          {/* Right side - Voice toggle + User menu */}
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
                <div className="absolute right-0 mt-2 w-64 bg-[#2d1b4e]/95 backdrop-blur-md rounded-lg shadow-xl border border-[#7B3FF2]/30 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#7B3FF2]/20">
                    <p className="text-sm font-medium text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-white/60">{user?.email}</p>
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