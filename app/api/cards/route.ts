import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import { slugify } from '@/lib/slug';

function requireAuth(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
// requireAuth returns a Promise<boolean>; callers must await it.

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
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
  return NextResponse.json(card, { status: 201 });
}
