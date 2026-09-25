import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, signSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (typeof password !== 'string' || !checkPassword(password)) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }
  const token = await signSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/'
  });
  return res;
}
