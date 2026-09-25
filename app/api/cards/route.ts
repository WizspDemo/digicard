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

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.fullName) return NextResponse.json({ error: 'fullName is required' }, { status: 400 });

  let slug = body.slug ? slugify(body.slug) : slugify(body.fullName);
  let attempt = 0;
  let finalSlug = slug;
  while (await prisma.card.findUnique({ where: { slug: finalSlug } })) {
    attempt += 1;
    finalSlug = `${slug}-${attempt}`;
  }

  const card = await prisma.card.create({
    data: cardDataFromBody(body, finalSlug) as any
  });
  return NextResponse.json(card, { status: 201 });
}
