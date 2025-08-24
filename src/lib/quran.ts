
import { Surah } from './types';

interface QuranApiResponse {
  data: {
    ayahs: Array<{
      text: string;
      number: number;
      numberInSurah: number;
      juz: number;
      manzil: number;
      page: number;
      ruku: number;
      hizbQuarter: number;
      sajda: boolean;
      translation: string;
      surah: Surah;
    }>;
  };
}

const BASE_URL = 'https://api.alquran.cloud/v1';

export async function getAllSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching all surahs:', error);
    return [];
  }
}

export async function getSurahDetails(surahNumber: number) {
  try {
    const [translationResponse, indopakResponse] = await Promise.all([
      fetch(`${BASE_URL}/surah/${surahNumber}/en.ahmedraza`),
      fetch(`${BASE_URL}/surah/${surahNumber}/quran-uthmani-indopak`)
    ]);

    const translationData: QuranApiResponse = await translationResponse.json();
    const indopakData: QuranApiResponse = await indopakResponse.json();

    const combinedData = {
      ...translationData.data,
      ayahs: translationData.data.ayahs.map((ayah, index) => ({
        ...ayah,
        indopakText: indopakData.data.ayahs[index].text
      }))
    };

    return combinedData;
  } catch (error) {
    console.error(`Error fetching details for surah ${surahNumber}:`, error);
    return null;
  }
}

export async function getJuzDetails(juzNumber: number) {
    try {
      const [translationResponse, indopakResponse] = await Promise.all([
        fetch(`${BASE_URL}/juz/${juzNumber}/en.ahmedraza`),
        fetch(`${BASE_URL}/juz/${juzNumber}/quran-uthmani-indopak`)
      ]);
      
      const translationData: QuranApiResponse = await translationResponse.json();
      const indopakData: QuranApiResponse = await indopakResponse.json();
  
      const combinedData = {
        ...translationData.data,
        ayahs: translationData.data.ayahs.map((ayah, index) => ({
          ...ayah,
          indopakText: indopakData.data.ayahs[index].text
        }))
      };
  
      return combinedData;
    } catch (error) {
      console.error(`Error fetching details for juz ${juzNumber}:`, error);
      return null;
    }
  }
