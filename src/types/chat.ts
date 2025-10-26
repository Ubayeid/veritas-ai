export interface Citation {
  id: string;
  title: string;
  authors: string[];
  year?: number | null;
  journal?: string | null;
  url?: string | null;
  // Legal citation fields
  volume?: string | null;
  page?: string | null;
  reporter?: string | null;
  court?: string | null;
  citationType?: 'case' | 'statute' | 'regulation' | 'academic';
}

export interface CitationAttachment {
  key: string;
  citation: Citation;
  inText: string;
  reference: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations: Citation[];
  createdAt: string;
  completionTokens?: number | null;
}

export interface ChatSummary {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  citationPanelOpen: boolean;
}

export interface ChatDetail extends ChatSummary {
  messages: Message[];
}