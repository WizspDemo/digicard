import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import { cardDataFromBody } from '@/lib/card-data';

async function requireUser(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

// The logged-in user's own card: view + edit only, no slug/create/delete.
export async function GET(req: NextRequest) {
  const session = await requireUser(req);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const card = await prisma.card.findUnique({ where: { userId: session.userId } });
  if (!card) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(card);
}

export async function PATCH(req: NextRequest) {
  const session = await requireUser(req);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.fullName) return NextResponse.json({ error: 'fullName is required' }, { status: 400 });

  const existing = await prisma.card.findUnique({ where: { userId: session.userId } });
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });

  // Users cannot change their own slug (URL) — only an admin can, to keep printed QR codes valid.
  const card = await prisma.card.update({
    where: { id: existing.id },
    data: cardDataFromBody(body)
  });
  return NextResponse.json(card);
}
