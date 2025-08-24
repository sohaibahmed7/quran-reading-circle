

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  }
  
  export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
    translation: string;
    surah: Surah;
    indopakText?: string;
  }

  export interface Juz {
    number: number;
    name: string;
    arabicName: string;
    folder: string;
    numberOfSurahs: number;
  }
  