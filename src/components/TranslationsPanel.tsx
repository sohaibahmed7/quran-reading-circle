import React from 'react';
import { Ayah } from '@/lib/types';

interface TranslationsPanelProps {
  ayahs: Ayah[];
  showSurahNumber?: boolean;
}

const TranslationsPanel: React.FC<TranslationsPanelProps> = ({ ayahs, showSurahNumber = false }) => {
  return (
    <div>
      {ayahs.map((ayah: Ayah) => (
        <div key={ayah.number} className="border-b border-gray-200 py-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-green-500">
              {showSurahNumber ? `${ayah.surah.number}:${ayah.numberInSurah}` : ayah.numberInSurah}
            </span>
          </div>
          <p className="text-right text-3xl font-zuhair-display leading-relaxed tracking-wide rtl mb-4">
            {ayah.indopakText}
          </p>
          <p className="text-left text-lg text-gray-700 leading-relaxed">
            {ayah.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TranslationsPanel;
