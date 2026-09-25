import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

// Node-only (crypto.scrypt). Used in API routes / seed scripts (Node runtime),
// never imported from middleware.ts (Edge runtime) — see lib/auth.ts for that.

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, 'hex');
  const testBuf = scryptSync(password, salt, 64);
  if (hashBuf.length !== testBuf.length) return false;
  return timingSafeEqual(hashBuf, testBuf);
}

export function generateTempPassword(): string {
  // ~11 url-safe chars, human-typeable
  return randomBytes(8).toString('base64url');
}
