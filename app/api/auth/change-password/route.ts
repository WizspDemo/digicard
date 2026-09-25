import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/password';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json({ error: 'Ο νέος κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!user.mustChangePassword) {
    if (typeof currentPassword !== 'string' || !verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: 'Λάθος τρέχων κωδικός.' }, { status: 400 });
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashPassword(newPassword), mustChangePassword: false }
  });

  return NextResponse.json({ ok: true });
}
