import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import { hashPassword, generateTempPassword } from '@/lib/password';
import { slugify } from '@/lib/slug';

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  return session?.role === 'ADMIN' ? session : null;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { card: { select: { id: true, slug: true, fullName: true } } }
  });
  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      mustChangePassword: u.mustChangePassword,
      createdAt: u.createdAt,
      card: u.card
    }))
  );
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Έγκυρο email απαιτείται.' }, { status: 400 });
  }
  if (!fullName) {
    return NextResponse.json({ error: 'Ονοματεπώνυμο απαιτείται.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'Υπάρχει ήδη χρήστης με αυτό το email.' }, { status: 409 });

  const tempPassword = generateTempPassword();

  let slug = slugify(fullName);
  let attempt = 0;
  let finalSlug = slug;
  while (await prisma.card.findUnique({ where: { slug: finalSlug } })) {
    attempt += 1;
    finalSlug = `${slug}-${attempt}`;
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashPassword(tempPassword),
      role: 'USER',
      mustChangePassword: true,
      card: {
        create: {
          slug: finalSlug,
          fullName
        }
      }
    },
    include: { card: true }
  });

  return NextResponse.json(
    { id: user.id, email: user.email, tempPassword, card: user.card },
    { status: 201 }
  );
}
