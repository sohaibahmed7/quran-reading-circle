
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { juzData } from '@/lib/juz_data';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const juzId = searchParams.get('juz');
  const surahId = searchParams.get('surah');

  console.log('API Call - juzId:', juzId, 'surahId:', surahId);

  const imageRanges: { folder: string; startImage: number; endImage: number }[] = [];

  if (juzId) {
    const juzInfo = juzData.find(j => j.number === parseInt(juzId, 10));
    if (!juzInfo) {
      console.error('Juz not found in API route');
      return NextResponse.json({ error: 'Juz not found' }, { status: 404 });
    }
    // For Juz, we assume all images in the folder are part of the Juz
    imageRanges.push({ folder: juzInfo.folder, startImage: 0, endImage: Infinity });
  } else if (surahId) {
    // Surah image mapping is not currently implemented
    console.log('API Call - Surah image mapping not implemented yet');
    return NextResponse.json({ error: 'Surah image mapping not implemented yet' }, { status: 501 });
  } else {
    console.error('Neither Juz ID nor Surah ID provided in API route');
    return NextResponse.json({ error: 'Juz ID or Surah ID is required' }, { status: 400 });
  }

  let allFiles: string[] = [];

  for (const range of imageRanges) {
    try {
      const fullImageFolderPath = path.join(process.cwd(), 'public', 'images', range.folder);
      console.log('API Call - fullImageFolderPath:', fullImageFolderPath);
      let filesInFolder = await fs.readdir(fullImageFolderPath);
      filesInFolder = filesInFolder.filter(file => !file.includes('Thumbs.db')).sort();
      console.log('API Call - Raw files in folder', range.folder, ':', filesInFolder);

      // Filter images based on startImage and endImage for Surahs or specific ranges
      const filteredFiles = filesInFolder.filter(file => {
        const match = file.match(/Quran_(\d+)\.png$/);
        const imageNumber = match ? parseInt(match[1], 10) : 0;
        console.log(`Processing file: ${file}, Extracted imageNumber: ${imageNumber}`);
        // If startImage is 0 and endImage is Infinity, it means no specific filtering for this range
        if (range.startImage === 0 && range.endImage === Infinity) {
          console.log(`No specific range filtering for ${file}. Including.`);
          return true;
        }
        console.log(`Filtering ${file}: imageNumber=${imageNumber}, start=${range.startImage}, end=${range.endImage}`);
        return imageNumber >= range.startImage && imageNumber <= range.endImage;
      });
      allFiles = allFiles.concat(filteredFiles);
    } catch (error) {
      console.error(`Could not read image directory for ${range.folder}:`, error);
      // Continue to next folder even if one fails
    }
  }

  allFiles.sort(); // Sort all collected files
  console.log('API Call - Final collected files:', allFiles);

  return NextResponse.json({ files: allFiles });
}
