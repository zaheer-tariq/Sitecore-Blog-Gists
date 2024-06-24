import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');

  if (secret == null) {
    return NextResponse.json({ message: 'secret is required' });
  }

  if (path == null) {
    return NextResponse.json({ message: 'path is required' });
  }

  // Check for secret token
  if (secret !== process.env.JSS_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid credentials' });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ message: 'Cache cleared for: ' + path });
  }

  return NextResponse.json({ message: 'Invalid status' });
}
