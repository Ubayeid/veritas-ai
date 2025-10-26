import { NextRequest, NextResponse } from 'next/server';
import { getChat, addMessage, deleteChat, setCitationPanel, updateTitle } from '@/lib/chatService';
import type { Citation } from '@/types/chat';
export const runtime = 'nodejs'; 

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const chat = await getChat(id);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Get chat error:', error);
    return NextResponse.json({ error: 'Failed to get chat' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { role, content, citations, completionTokens } = await req.json();
    const message = await addMessage(
      id,
      role,
      content,
      citations as Citation[] | undefined,
      completionTokens
    );
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Add message error:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, citationPanelOpen } = await req.json();

    if (typeof title === 'string') {
      await updateTitle(id, title);
    }

    if (typeof citationPanelOpen === 'boolean') {
      await setCitationPanel(id, citationPanelOpen);
    }

    const chat = await getChat(id);
    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Update chat error:', error);
    return NextResponse.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteChat(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}