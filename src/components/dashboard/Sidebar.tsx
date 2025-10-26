'use client';

import type { ChatSummary } from '@/types/chat';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';

interface ChatHistoryProps {
  readonly chats: ChatSummary[];
  readonly activeChatId?: string | null;
  readonly loading?: boolean;
  readonly onSelect: (chatId: string) => void;
  readonly onCreate: () => void;
  readonly onDelete?: (chatId: string) => Promise<void> | void;
  readonly onClose?: () => void;
}

export default function ChatHistory({
  chats,
  activeChatId,
  loading = false,
  onSelect,
  onCreate,
  onDelete,
}: ChatHistoryProps) {
  const handleDelete = async (
    chatId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    if (!onDelete) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this chat?');
    if (!confirmDelete) return;
    await onDelete(chatId);
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-gray-200 bg-gray-50/95 p-3 shadow-sm">
      {/* New Chat Button */}
      <div className="mb-3">
        <button
          onClick={onCreate}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left font-medium text-gray-800 transition-all hover:shadow-sm"
        >
          <span>New Chat</span>
          <Plus size={20} />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto -mr-2 pr-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <MessageSquare size={24} className="text-gray-500" />
            </div>
            <p className="text-sm text-gray-600">No conversations yet</p>
            <p className="mt-1 text-xs text-gray-400">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={`group relative flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all ${
                  chat.id === activeChatId
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-white/70'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-gray-800">
                    {chat.title || 'New Chat'}
                  </h3>
                </div>
                {onDelete && (
                  <button
                    onClick={(event) => handleDelete(chat.id, event)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}