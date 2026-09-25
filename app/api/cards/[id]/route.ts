import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import { slugify } from '@/lib/slug';

function requireAuth(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAuth(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
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
    data: {
      slug: finalSlug,
      fullName: body.fullName,
      jobTitle: body.jobTitle || null,
      company: body.company || null,
      phone: body.phone || null,
      email: body.email || null,
      whatsapp: body.whatsapp || null,
      linkedin: body.linkedin || null,
      website: body.website || null,
      address: body.address || null,
      photoUrl: body.photoUrl || null,
      logoUrl: body.logoUrl || null,
      themeColor: body.themeColor || '#6d28d9'
    }
  });
  return NextResponse.json(card);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAuth(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  await prisma.card.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
