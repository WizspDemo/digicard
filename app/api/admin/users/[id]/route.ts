import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import { hashPassword, generateTempPassword } from '@/lib/password';

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  return session?.role === 'ADMIN' ? session : null;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (session.userId === params.id) {
    return NextResponse.json({ error: 'Δεν μπορείς να διαγράψεις τον εαυτό σου.' }, { status: 400 });
  }
  await prisma.user.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

// Reset a user's password to a new temp password (admin support action)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const tempPassword = generateTempPassword();
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashPassword(tempPassword), mustChangePassword: true }
  });
  return NextResponse.json({ ok: true, tempPassword });
}
