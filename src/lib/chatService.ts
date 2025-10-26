import type { ChatDetail, ChatSummary, Citation, Message } from '@/types/chat';
import { prisma } from './prisma';

const generateTitle = (msg: string): string => {
  const clean = msg.trim();
  return clean.length > 50 ? `${clean.substring(0, 47)}...` : clean || 'New Chat';
};

export const createChat = async (): Promise<ChatDetail> => {
  const chat = await prisma.chat.create({
    data: {},
    include: {
      messages: {
        include: { citations: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return {
    id: chat.id,
    title: chat.title,
    citationPanelOpen: chat.citationPanelOpen,
    createdAt: chat.createdAt.toISOString(),
    updatedAt: chat.updatedAt.toISOString(),
    messages: [],
  };
};

export const getChat = async (chatId: string): Promise<ChatDetail | null> => {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        include: { citations: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!chat) return null;

  return {
    id: chat.id,
    title: chat.title,
    citationPanelOpen: chat.citationPanelOpen,
    createdAt: chat.createdAt.toISOString(),
    updatedAt: chat.updatedAt.toISOString(),
    messages: chat.messages.map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      completionTokens: m.completionTokens,
      citations: m.citations.map(c => ({
        id: c.id,
        title: c.title,
        authors: c.authors,
        year: c.year,
        journal: c.journal,
        url: c.url,
      })),
    })),
  };
};

export const getAllChats = async (): Promise<ChatSummary[]> => {
  const chats = await prisma.chat.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return chats.map(c => ({
    id: c.id,
    title: c.title,
    citationPanelOpen: c.citationPanelOpen,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
};

export const addMessage = async (
  chatId: string,
  role: 'user' | 'assistant',
  content: string,
  citations?: Citation[],
  completionTokens?: number
): Promise<Message> => {
  const message = await prisma.message.create({
    data: {
      chatId,
      role,
      content,
      completionTokens,
      citations: {
        create: citations?.map(c => ({
          title: c.title,
          authors: c.authors,
          year: c.year,
          journal: c.journal,
          url: c.url,
        })) || [],
      },
    },
    include: { citations: true },
  });

  if (role === 'user') {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });

    if (chat && chat.messages.length === 1 && chat.title === 'New Chat') {
      await prisma.chat.update({
        where: { id: chatId },
        data: { title: generateTitle(content) },
      });
    }
  }

  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });

  return {
    id: message.id,
    role: message.role as 'user' | 'assistant',
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    completionTokens: message.completionTokens,
    citations: message.citations.map(c => ({
      id: c.id,
      title: c.title,
      authors: c.authors,
      year: c.year,
      journal: c.journal,
      url: c.url,
    })),
  };
};

export const setCitationPanel = async (chatId: string, isOpen: boolean): Promise<void> => {
  await prisma.chat.update({
    where: { id: chatId },
    data: { citationPanelOpen: isOpen },
  });
};

export const deleteChat = async (chatId: string): Promise<void> => {
  await prisma.chat.delete({ where: { id: chatId } });
};

export const updateTitle = async (chatId: string, title: string): Promise<void> => {
  await prisma.chat.update({
    where: { id: chatId },
    data: { title },
  });
};