import { NextResponse } from 'next/server';
import { juzImageManifest } from '@/lib/juz_image_manifest';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const juzId = searchParams.get('juz');

  console.log('API Call - juzId:', juzId);

  if (!juzId) {
    return NextResponse.json({ error: 'Juz ID is required' }, { status: 400 });
  }

  const juzInfo = juzImageManifest[juzId as keyof typeof juzImageManifest];

  if (!juzInfo) {
    return NextResponse.json({ error: 'Juz not found' }, { status: 404 });
  }

  // Construct the full URLs for the images
  const imagePaths = juzInfo.images.map(
    (file: string) => `/images/${juzInfo.folder}/${file}`
  );

  return NextResponse.json({ files: imagePaths });
}