import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import { slugify } from '@/lib/slug';
import { cardDataFromBody } from '@/lib/card-data';

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  return session?.role === 'ADMIN';
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.fullName) return NextResponse.json({ error: 'fullName is required' }, { status: 400 });

  const existing = await prisma.card.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });

  let finalSlug = existing.slug;
  if (body.slug && slugify(body.slug) !== existing.slug) {
    let candidate = slugify(body.slug);
    let attempt = 0;
    finalSlug = candidate;
    while (await prisma.card.findFirst({ where: { slug: finalSlug, NOT: { id: existing.id } } })) {
      attempt += 1;
      finalSlug = `${candidate}-${attempt}`;
    }
  }

  const card = await prisma.card.update({
    where: { id: params.id },
    data: cardDataFromBody(body, finalSlug)
  });
  return NextResponse.json(card);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  await prisma.card.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
