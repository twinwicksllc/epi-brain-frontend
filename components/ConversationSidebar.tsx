"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Conversation, User } from "@/types";
import BrainLogo from "./BrainLogo";
import { ChevronDown } from "lucide-react";

interface ConversationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isLoading?: boolean;
  user?: User | null;
}

export default function ConversationSidebar({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isLoading = false,
  user,
}: ConversationSidebarProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [activeLens, setActiveLens] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem('active_lens') || 'general' : 'general'
  );
  const [lensDropdownOpen, setLensDropdownOpen] = useState(false);

  const silos = [
    { id: 'general', name: 'EPI Brain', color: 'from-[#7B3FF2] to-[#6B46C1]' },
    { id: 'sales_mentor', name: 'Sales Tutor', color: 'from-[#10b981] to-[#059669]' },
    { id: 'spiritual_guide', name: 'Spiritual Guide', color: 'from-[#f59e0b] to-[#d97706]' },
    { id: 'education_coach', name: 'Education Coach', color: 'from-[#3b82f6] to-[#1d4ed8]' },
  ];

  const handleLensChange = (siloId: string) => {
    setActiveLens(siloId);
    localStorage.setItem('active_lens', siloId);
    localStorage.setItem('epi_silo_id', siloId);
    
    // Update silo name based on selection
    const selectedSilo = silos.find(s => s.id === siloId);
    if (selectedSilo) {
      localStorage.setItem('epi_silo_name', `EPI ${selectedSilo.name}`);
    }
    
    setLensDropdownOpen(false);
    setModeFilter('all'); // Reset mode filter when changing lens
  };

  const activeSilo = silos.find(s => s.id === activeLens);
  
  const filteredConversationsByLens = conversations.filter(conv => {
    const convSilo = localStorage.getItem(`conv_silo_${conv.id}`) || 'general';
    return activeLens === 'all' || convSilo === activeLens;
  });
  
  
  // Helper to format mode name for display
  const formatModeName = (mode: string) => {
    const modeMap: { [key: string]: string } = {
      'personal_friend': 'Personal Companion',
      'weight_loss_coach': 'Weight Loss Coach',
      'productivity_coach': 'Productivity Coach',
      'mental_health_coach': 'Mental Health Coach',
      'fitness_coach': 'Fitness Coach',
      'relationship_coach': 'Relationship Coach',
      'career_coach': 'Career Coach',
    };
    return modeMap[mode] || mode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Filter conversations by mode from lens-filtered conversations
  const filteredConversations = modeFilter === 'all' 
    ? filteredConversationsByLens
    : filteredConversationsByLens.filter(conv => conv.mode === modeFilter);
  
  // Get unique modes from lens-filtered conversations
  const availableModes = Array.from(new Set(filteredConversationsByLens.map(conv => conv.mode)));

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`w-64 bg-[#2d1b4e] border-r border-[#7B3FF2]/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:relative h-full z-50 lg:z-auto`}>

        {/* Brain Logo Section */}
        <div className="border-b border-[#7B3FF2]/20">
          <BrainLogo isLoading={isLoading} />
        </div>

        {/* Lens Switcher - Admin Only */}
        {user?.is_admin && (
          <div className="p-4 border-b border-[#7B3FF2]/20 bg-[#1a0f2e]/50">
            <div className="relative">
              <button
                onClick={() => setLensDropdownOpen(!lensDropdownOpen)}
                className={`w-full px-3 py-2 rounded-lg border transition-all flex items-center justify-between text-sm font-medium ${
                  activeSilo?.id === 'general' 
                    ? 'bg-gradient-to-r from-[#7B3FF2]/30 to-[#6B46C1]/30 border-[#7B3FF2]/50 text-[#E9D5FF]'
                    : activeSilo?.id === 'sales_mentor'
                    ? 'bg-gradient-to-r from-[#10b981]/20 to-[#059669]/20 border-[#10b981]/50 text-[#a7f3d0]'
                    : activeSilo?.id === 'spiritual_guide'
                    ? 'bg-gradient-to-r from-[#f59e0b]/20 to-[#d97706]/20 border-[#f59e0b]/50 text-[#fef3c7]'
                    : 'bg-gradient-to-r from-[#3b82f6]/20 to-[#1d4ed8]/20 border-[#3b82f6]/50 text-[#bfdbfe]'
                }`}
              >
                <span className="truncate">
                  Active Lens: {activeSilo?.name}
                </span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${lensDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Lens Dropdown */}
              {lensDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d1b4e] border border-[#7B3FF2]/30 rounded-lg shadow-xl z-40">
                  {silos.map((silo) => (
                    <button
                      key={silo.id}
                      onClick={() => handleLensChange(silo.id)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                        activeLens === silo.id
                          ? 'bg-[#7B3FF2]/20 text-white border-l-2 border-[#7B3FF2]'
                          : 'text-white/70 hover:text-white hover:bg-[#7B3FF2]/10'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${silo.color}`} />
                      {silo.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-white/50 mt-2">Switch active lens to filter conversations</p>
          </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-[#7B3FF2]/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Conversations</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded hover:bg-white/10 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={onNewConversation}
            className="mt-3 w-full px-4 py-2 bg-[#7B3FF2] hover:bg-[#6B46C1] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
          
          {/* Mode Filter */}
          {availableModes.length > 1 && (
            <div className="mt-3">
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a0f2e] border border-[#7B3FF2]/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]"
              >
                <option value="all">All Modes</option>
                {availableModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {formatModeName(mode)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <p>No conversations found</p>
              <p className="text-sm mt-2">
                {modeFilter !== 'all' ? `Try changing the mode filter` : 'Start a new chat to begin!'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative rounded-lg transition-all duration-200 ${
                    currentConversationId === conversation.id
                      ? "bg-[#7B3FF2]/20 text-white"
                      : "hover:bg-[#7B3FF2]/10 text-white/80 hover:text-white"
                  }`}
                >
                  <button
                    onClick={() => onSelectConversation(conversation.id)}
                    className="w-full text-left p-3 pr-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {conversation.title}
                        </h3>
                        <p className="text-xs opacity-60 mt-1">
                          {formatModeName(conversation.mode)}
                        </p>
                        <p className="text-xs opacity-50 mt-1">
                          {conversation.message_count} messages • {formatDistanceToNow(new Date(conversation.updated_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmId(conversation.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* Delete Confirmation */}
                  {deleteConfirmId === conversation.id && (
                    <div className="absolute inset-0 bg-red-500/10 rounded-lg p-2 flex items-center justify-center">
                      <p className="text-xs text-white mb-2">Delete?</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            onDeleteConversation(conversation.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}