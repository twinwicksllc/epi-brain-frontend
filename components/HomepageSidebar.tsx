"use client";

import { formatDistanceToNow } from "date-fns";
import { Menu, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HomepageSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  recentChats: Array<{ id: string; title?: string }>;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

export default function HomepageSidebar({
  isCollapsed,
  onToggleCollapse,
  recentChats,
  onSelectChat,
  onNewChat,
}: HomepageSidebarProps) {
  const router = useRouter();

  return (
    <>
      {/* Slim Rail - Always Visible */}
      <div
        className={`bg-[#2d1b4e] border-r border-[#7B3FF2]/30 flex flex-col transition-all duration-300 ease-in-out h-screen flex-shrink-0 overflow-hidden ${
          isCollapsed ? "w-[70px]" : "w-64"
        }`}
      >
        {/* Top Section - Expander + Logo */}
        <div className="flex flex-col items-center border-b border-[#7B3FF2]/20">
          {/* Expander Button - Top of Rail */}
          <button
            onClick={onToggleCollapse}
            className="w-full py-4 px-2 hover:bg-[#7B3FF2]/10 transition-colors flex items-center justify-center text-[#A78BFA]"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>

          {/* EPI Brain Logo Text - Hidden in Collapsed State */}
          {!isCollapsed && (
            <div className="w-full px-4 py-3 text-center">
              <h2 className="text-sm font-bold text-[#A78BFA]">EPI Brain</h2>
              <p className="text-xs text-white/50 mt-1">Your AI Gateway</p>
            </div>
          )}
        </div>

        {/* New Chat Button - Expanded View */}
        {!isCollapsed && (
          <div className="p-4 border-b border-[#7B3FF2]/20">
            <button
              onClick={onNewChat}
              className="w-full px-4 py-2 bg-[#7B3FF2] hover:bg-[#6B46C1] text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
        )}

        {/* New Chat Button - Slim Rail (Icon Only) */}
        {isCollapsed && (
          <div className="p-3 border-b border-[#7B3FF2]/20">
            <button
              onClick={onNewChat}
              className="w-full p-2 bg-[#7B3FF2] hover:bg-[#6B46C1] text-white rounded-lg transition-colors flex items-center justify-center"
              title="New Chat"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Recent Chats Section - Expanded View Only */}
        {!isCollapsed && (
          <>
            <div className="px-4 py-3 border-b border-[#7B3FF2]/20">
              <h3 className="text-sm font-semibold text-white">Recent Chats</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {recentChats.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <p className="text-sm">No recent chats</p>
                  <p className="text-xs mt-2">Start a new one to begin!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-[#7B3FF2]/10 text-white/80 hover:text-white transition-all group"
                    >
                      <h4 className="font-medium truncate text-sm">
                        {chat.title || "Untitled chat"}
                      </h4>
                      <p className="text-xs text-white/50 mt-1 truncate">
                        Recent conversation
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Spacer for Collapsed State */}
        {isCollapsed && <div className="flex-1" />}

        {/* Bottom Section - Dashboard Link */}
        {!isCollapsed && (
          <div className="border-t border-[#7B3FF2]/20 p-4">
            <Link
              href="/dashboard"
              className="w-full px-4 py-2 bg-[#7B3FF2]/20 hover:bg-[#7B3FF2]/30 border border-[#7B3FF2]/40 text-[#A78BFA] rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Bottom Section - Dashboard Icon in Slim Rail */}
        {isCollapsed && (
          <div className="border-t border-[#7B3FF2]/20 p-3">
            <Link
              href="/dashboard"
              className="w-full p-2 hover:bg-[#7B3FF2]/10 text-[#A78BFA] rounded-lg transition-colors flex items-center justify-center"
              title="Go to Dashboard"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
