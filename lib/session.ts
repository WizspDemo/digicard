import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return user;
}

export async function requireUser(): Promise<{ userId: string; role: 'ADMIN' | 'USER' } | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
