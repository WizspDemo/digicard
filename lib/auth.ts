const SESSION_COOKIE = 'digicard_session';

function getSecret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'insecure-dev-secret';
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmac(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return toHex(sig);
}

export async function signSession(): Promise<string> {
  const payload = `admin:${Date.now()}`;
  const sig = await hmac(payload);
  return btoa(`${payload}.${sig}`);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const decoded = atob(token);
    const idx = decoded.lastIndexOf('.');
    if (idx === -1) return false;
    const payload = decoded.slice(0, idx);
    const sig = decoded.slice(idx + 1);
    const expected = await hmac(payload);
    return timingSafeEqualStr(sig, expected);
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  return timingSafeEqualStr(input, expected);
}

export { SESSION_COOKIE };
