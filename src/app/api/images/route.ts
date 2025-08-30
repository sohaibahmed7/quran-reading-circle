import { NextResponse } from 'next/server';
import { juzImageManifest } from '@/lib/juz_image_manifest';
import { surahImageManifest } from '@/lib/surah_image_manifest';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const juzId = searchParams.get('juz');
  const surahId = searchParams.get('surah');

  if (juzId) {
    const juzInfo = juzImageManifest[juzId as keyof typeof juzImageManifest];
    if (!juzInfo) {
      return NextResponse.json({ error: 'Juz not found' }, { status: 404 });
    }
    const imagePaths = juzInfo.images.map(
      (file: string) => `/images/Juz/${juzInfo.folder}/${file}`
    );
    return NextResponse.json({ files: imagePaths });
  }

  if (surahId) {
    const surahInfo = surahImageManifest[surahId as keyof typeof surahImageManifest];
    if (!surahInfo) {
      return NextResponse.json({ error: 'Surah not found' }, { status: 404 });
    }
    const imagePaths = surahInfo.images.map(
      (file: string) => `/images/Surah/${surahInfo.folder}/${file}`
    );
    return NextResponse.json({ files: imagePaths });
  }

  return NextResponse.json({ error: 'Juz or Surah ID is required' }, { status: 400 });
}