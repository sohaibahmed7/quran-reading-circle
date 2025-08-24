
'use client';

import Link from 'next/link';
import { getSurahDetails } from '@/lib/quran';
import { Ayah, Surah } from '@/lib/types';
import { useEffect, useState } from 'react';
import TajweedRules from '@/components/TajweedRules';
import SlidingPanel from '@/components/SlidingPanel';
import TranslationsPanel from '@/components/TranslationsPanel';
import PanelHeaderButtons from '@/components/PanelHeaderButtons';


type SurahPageProps = {
  params: Promise<{
    surahId: string;
  }>;
};

export default function SurahPage({ params }: SurahPageProps) {
  const [surahId, setSurahId] = useState<string | null>(null);
  const [surahInfo, setSurahInfo] = useState<Surah | null>(null);
  const [surahDetails, setSurahDetails] = useState<{ ayahs: Array<Ayah & { indopakText: string }> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranslations, setShowTranslations] = useState(false);
  const [showTajweedPanel, setShowTajweedPanel] = useState(false); // New state for Tajweed panel

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setSurahId(resolved.surahId);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!surahId) return;
    
    const fetchSurahData = async () => {
      setLoading(true);
      const id = parseInt(surahId, 10);
      const details = await getSurahDetails(id);

      if (details) {
        // Extract surah info from the first ayah
        const firstAyah = details.ayahs[0];
        if (firstAyah) {
          setSurahInfo(firstAyah.surah);
        }
        setSurahDetails(details);
      }
      setLoading(false);
    };

    fetchSurahData();
  }, [surahId]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!surahInfo || !surahDetails) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Surah not found</h1>
        <Link href="/" className="text-green-500 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-custom-bg font-sans text-gray-900">      
      <header className="fixed top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-md shadow-lg z-50 shrink-0">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="text-lg md:text-2xl font-sans text-white px-2">QRC - {surahInfo ? surahInfo.englishName : 'Loading...'}</Link>
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => {
                if (showTranslations) setShowTranslations(false);
                setShowTajweedPanel(!showTajweedPanel);
              }} className="text-lg text-gray-300 hover:text-white transition-colors">
                Tajweed Rules
              </button>
              <button 
                onClick={() => {
                  if (showTajweedPanel) setShowTajweedPanel(false);
                  setShowTranslations(!showTranslations);
                }}
                className="text-lg text-gray-300 hover:text-white transition-colors"
              >
                {showTranslations ? 'Hide' : 'Show'} Translations
              </button>
              <a href="https://www.youtube.com/channel/UCDp-6IjyN7nbZhpAgjzIhLQ" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-300 hover:text-white transition-colors">QRC YouTube</a>
            </div>
            <PanelHeaderButtons
              showTranslations={showTranslations}
              showTajweedPanel={showTajweedPanel}
              onToggleTranslations={() => setShowTranslations(!showTranslations)}
              onToggleTajweed={() => setShowTajweedPanel(!showTajweedPanel)}
              variant="mobile"
            />
          </div>
        </div>
      </header>


      <div className="flex-1 relative overflow-hidden pt-16">
        <main className="w-full h-full flex flex-col items-center relative overflow-hidden pt-24 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-4 px-4">{surahInfo.englishName} ({surahInfo.name})</h1>
          <p className="text-lg mb-8 px-4">{surahInfo.englishNameTranslation} - {surahInfo.numberOfAyahs} Ayahs</p>

          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 px-4">
            {surahDetails.ayahs.map((ayah: Ayah) => (
              <div key={ayah.number} className="border-b border-gray-200 dark:border-gray-700 py-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-green-500">{ayah.numberInSurah}</span>
                </div>
                <p className="text-right text-3xl font-zuhair-display leading-relaxed tracking-wide rtl mb-4">
                  {ayah.indopakText}
                </p>
                <p className="text-left text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {ayah.text}
                </p>
              </div>
            ))}
          </div>
        </main>

        {/* Desktop Translations Panel */}
        <SlidingPanel
          isOpen={showTranslations}
          title="Ayahs"
          variant="desktop"
          type="translations"
        >
          <TranslationsPanel ayahs={surahDetails.ayahs} showSurahNumber={false} />
        </SlidingPanel>

        {/* Mobile Translations Panel */}
        <SlidingPanel
          isOpen={showTranslations}
          onClose={() => setShowTranslations(false)}
          title="Ayahs"
          variant="mobile"
          type="translations"
        >
          <TranslationsPanel ayahs={surahDetails.ayahs} showSurahNumber={false} />
        </SlidingPanel>

        {/* Desktop Tajweed Rules Panel */}
        <SlidingPanel
          isOpen={showTajweedPanel}
          title="Tajweed Rules"
          variant="desktop"
          type="tajweed"
        >
          <TajweedRules />
        </SlidingPanel>

        {/* Mobile Tajweed Rules Panel */}
        <SlidingPanel
          isOpen={showTajweedPanel}
          onClose={() => setShowTajweedPanel(false)}
          title="Tajweed Rules"
          variant="mobile"
          type="tajweed"
        >
          <TajweedRules />
        </SlidingPanel>
      </div>
    </div>
  );
}
