'use client';

import { useState, useEffect } from 'react';
import { FileText, Trash2, Clock, Tag, X } from 'lucide-react';
import { assistantToolsApi } from '@/lib/api/client';

interface Note {
  id: string;
  title?: string;
  content: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface VaultViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VaultView({ isOpen, onClose }: VaultViewProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen]);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const data = await assistantToolsApi.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await assistantToolsApi.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      note: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      draft: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      reflection: 'bg-green-500/20 text-green-300 border-green-500/30',
      quick: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return colors[type] || colors.note;
  };

  const getTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      note: '📝',
      draft: '✍️',
      reflection: '🤔',
      quick: '⚡',
    };
    return emojis[type] || '📄';
  };

  const filteredNotes = filter === 'all' 
    ? notes 
    : notes.filter(note => note.type === filter);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Vault Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-96 z-50
          backdrop-blur-xl
          border-l border-white/10
          shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(29, 27, 78, 0.95) 0%, rgba(20, 18, 58, 0.95) 100%)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-white/10 p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(123, 63, 242, 0.2) 0%, rgba(107, 70, 193, 0.2) 100%)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-2">🔐</span>
              The Vault
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'note', 'draft', 'reflection', 'quick'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  whitespace-nowrap
                  ${filter === type
                    ? 'bg-[#7B3FF2] text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }
                `}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-180px)] p-6 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A78BFA]" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <FileText className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-white/60">No {filter !== 'all' ? filter + 's' : 'items'} yet</p>
              <p className="text-white/40 text-sm mt-1">Your notes will appear here</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className={`
                  group relative p-4 rounded-xl
                  backdrop-blur-md
                  border border-white/10
                  transition-all duration-200
                  hover:border-[#7B3FF2]/50
                  hover:shadow-lg hover:shadow-purple-500/20
                  cursor-pointer
                  ${selectedNote?.id === note.id ? 'ring-2 ring-[#7B3FF2]' : ''}
                `}
                style={{
                  background: 'linear-gradient(135deg, rgba(123, 63, 242, 0.1) 0%, rgba(107, 70, 193, 0.1) 100%)',
                }}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeEmoji(note.type)}</span>
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium border
                      ${getTypeColor(note.type)}
                    `}>
                      {note.type}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                {note.title && (
                  <h3 className="text-white font-medium mb-1 line-clamp-1">
                    {note.title}
                  </h3>
                )}

                <p className="text-white/70 text-sm line-clamp-2 mb-3">
                  {note.content}
                </p>

                <div className="flex items-center text-xs text-white/40">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    boxShadow: '0 0 20px rgba(167, 139, 250, 0.1)',
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Selected Note Detail */}
        {selectedNote && (
          <div className="absolute inset-0 z-20 backdrop-blur-xl overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(29, 27, 78, 0.98) 0%, rgba(20, 18, 58, 0.98) 100%)',
            }}
          >
            <div className="p-6">
              <button
                onClick={() => setSelectedNote(null)}
                className="mb-4 text-[#A78BFA] hover:text-white transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Back
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{getTypeEmoji(selectedNote.type)}</span>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium border
                  ${getTypeColor(selectedNote.type)}
                `}>
                  {selectedNote.type}
                </span>
              </div>

              {selectedNote.title && (
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedNote.title}
                </h2>
              )}

              <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {selectedNote.content}
              </div>

              <div className="flex items-center text-xs text-white/40 border-t border-white/10 pt-4">
                <Clock className="w-3 h-3 mr-1" />
                Created: {new Date(selectedNote.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
