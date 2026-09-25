import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif'
};

export async function GET(_req: NextRequest, { params }: { params: { filename: string } }) {
  const filename = params.filename;
  // Prevent path traversal — only allow the exact filenames we generate.
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const contentType = MIME[ext];
  if (!contentType) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, filename));
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
