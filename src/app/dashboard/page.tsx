'use client';

import { useCallback, useEffect, useState } from 'react';
import ChatInterface from '@/components/dashboard/ChatInterface';
import ChatHistory from '@/components/dashboard/Sidebar';
import CitationsPanel from '@/components/dashboard/CitationsPanel';
import type { CitationAttachment, ChatSummary } from '@/types/chat';
import Link from 'next/link';
import { Workflow, MessageSquare, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [citationsOpen, setCitationsOpen] = useState(false);
  const [citations, setCitations] = useState<CitationAttachment[]>([]);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loadingChats, setLoadingChats] = useState(false);

  const handleCitationsChange = useCallback((items: CitationAttachment[]) => {
    setCitations(items);
    if (items.length > 0 && !citationsOpen) {
      setCitationsOpen(true);
    }
  }, [citationsOpen]);

  useEffect(() => {
    let mounted = true;

    const loadChats = async () => {
      setLoadingChats(true);
      try {
        const res = await fetch('/api/chats');
        
        if (!res.ok) {
          console.warn('Chat API not available');
          if (mounted) setLoadingChats(false);
          return;
        }
        
        const data = await res.json();
        if (!mounted) return;
        
        const fetchedChats: ChatSummary[] = data?.chats ?? [];
        setChats(fetchedChats);
        
        if (fetchedChats.length > 0) {
          setActiveChatId(fetchedChats[0].id);
          setCitationsOpen(fetchedChats[0].citationPanelOpen ?? false);
        }
      } catch (error) {
        console.warn('Failed to load chats:', error);
      } finally {
        if (mounted) setLoadingChats(false);
      }
    };

    void loadChats();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateChat = useCallback(async () => {
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      if (!res.ok) {
        console.warn('Failed to create chat');
        return;
      }
      
      const data = await res.json();
      const created: ChatSummary | undefined = data?.chat;
      if (!created) return;
      
      setChats(prev => [created, ...prev]);
      setActiveChatId(created.id);
      setCitationsOpen(false);
      setCitations([]);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Create chat error:', error);
    }
  }, []);

  const handleSelectChat = useCallback((chatId: string) => {
    const selected = chats.find(c => c.id === chatId);
    setActiveChatId(chatId);
    setSidebarOpen(false);
    
    if (selected) {
      setCitationsOpen(selected.citationPanelOpen ?? false);
    }
  }, [chats]);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        console.warn('Failed to delete chat');
        return;
      }
      
      setChats(prev => {
        const updated = prev.filter(c => c.id !== chatId);
        if (activeChatId === chatId) {
          const nextChat = updated[0];
          setActiveChatId(nextChat ? nextChat.id : null);
          setCitations([]);
          setCitationsOpen(nextChat ? nextChat.citationPanelOpen ?? false : false);
        }
        return updated;
      });
    } catch (error) {
      console.error('Delete chat error:', error);
    }
  }, [activeChatId]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/25 lg:hidden"
              aria-label="Close sidebar"
            />
            <div className="fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto">
              <ChatHistory
                chats={chats}
                activeChatId={activeChatId ?? undefined}
                loading={loadingChats}
                onSelect={handleSelectChat}
                onCreate={handleCreateChat}
                onDelete={handleDeleteChat}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </>
        )}

        <div className="relative flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col">
            <ChatInterface
              onCitationsChange={handleCitationsChange}
            />
          </div>

          <div className={`hidden xl:flex transition-all duration-200 ${citationsOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
            <CitationsPanel citations={citations} isVisible={citationsOpen} />
          </div>
        </div>

        {citationsOpen && (
          <div className="fixed inset-0 z-40 flex xl:hidden">
            <button
              type="button"
              onClick={() => setCitationsOpen(false)}
              className="flex-1 bg-black/25"
              aria-label="Close citations"
            />
            <div className="h-full w-80 bg-white shadow-xl">
              <CitationsPanel
                citations={citations}
                isVisible
                onClose={() => setCitationsOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}