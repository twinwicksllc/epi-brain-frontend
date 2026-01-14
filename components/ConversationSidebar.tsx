"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Conversation } from "@/types";

interface ConversationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export default function ConversationSidebar({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: ConversationSidebarProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start a new chat to begin!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
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
                          {conversation.message_count} messages
                        </p>
                        <p className="text-xs opacity-40 mt-1">
                          {formatDistanceToNow(new Date(conversation.updated_at), {
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