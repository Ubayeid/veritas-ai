import { NextResponse } from 'next/server';
import { createChat, getAllChats } from '@/lib/chatService';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const chats = await getAllChats();
    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json({ error: 'Failed to get chats' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const chat = await createChat();
    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Create chat error:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}