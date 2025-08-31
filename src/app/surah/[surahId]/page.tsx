'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getSurahDetails } from '@/lib/quran';
import { surahData } from '@/lib/surah_data';
import { Ayah, Surah } from '@/lib/types';
import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [surahInfo, setSurahInfo] = useState<(typeof surahData)[0] | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ surahId: string } | null>(null);
  const [surahDetails, setSurahDetails] = useState<{ ayahs: Array<Ayah & { indopakText: string }> } | null>(null);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTranslations, setShowTranslations] = useState(false);
  const [showTajweedPanel, setShowTajweedPanel] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    const fetchSurahData = async () => {
      setLoading(true);
      const surahId = parseInt(resolvedParams.surahId, 10);
      const info = surahData.find(s => s.number === surahId);

      if (info) {
        setSurahInfo(info);
        const details = await getSurahDetails(surahId);
        setSurahDetails(details);

        const response = await fetch(`/api/images?surah=${surahId}`);
        if (response.ok) {
          const data = await response.json();
          setImageFiles(data.files);
        } else {
          console.error('Could not fetch image list.');
        }
      }
      setLoading(false);
    };

    fetchSurahData();
  }, [resolvedParams]);

  const handleNextPage = useCallback(() => {
    if (currentPage < imageFiles.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, imageFiles.length]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNextPage();
      } else if (event.key === 'ArrowLeft') {
        handlePreviousPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, imageFiles.length, handleNextPage, handlePreviousPage]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollAmount = currentPage * scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        if (scrollContainerRef.current) {
          const page = Math.round(scrollContainerRef.current.scrollLeft / scrollContainerRef.current.offsetWidth);
          setCurrentPage(page);
        }
      }, 100);
    }
  };

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
            <Link href="/" className="text-lg md:text-2xl font-didot text-white px-2">QRC - {surahInfo ? surahInfo.name : 'Loading...'}</Link>
            <PanelHeaderButtons
              showTranslations={showTranslations}
              showTajweedPanel={showTajweedPanel}
              onToggleTranslations={() => setShowTranslations(!showTranslations)}
              onToggleTajweed={() => setShowTajweedPanel(!showTajweedPanel)}
              variant="desktop"
            />
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
        <main 
          className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
        >
          {imageFiles.length > 0 ? (
            <div ref={scrollContainerRef} onScroll={handleScroll} className="flex w-full h-full overflow-x-scroll snap-x snap-mandatory scroll-smooth">
              {imageFiles.map((file, index) => (
                <div key={file} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-4">
                  <Image
                    src={file}
                    alt={`Page ${index + 1} from Surah ${surahInfo?.name}`}
                    width={800}
                    height={1100}
                    className="max-h-full w-auto h-auto object-contain shadow-lg"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 px-4">
              {surahDetails.ayahs.map((ayah: Ayah) => (
                <div key={ayah.number} className="border-b border-gray-200 py-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-green-500">{ayah.numberInSurah}</span>
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
          )}
          {imageFiles.length > 0 && (
            <>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full disabled:opacity-20 z-10 text-2xl"
              >
                &#x276E;
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === imageFiles.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full disabled:opacity-20 z-10 text-2xl"
              >
                &#x276F;
              </button>
            </>
          )}
        </main>

        {/* Desktop Translations Panel */}
        <SlidingPanel
          isOpen={showTranslations}
          title="Translation"
          variant="desktop"
          type="translations"
        >
          <TranslationsPanel ayahs={surahDetails?.ayahs || []} showSurahNumber={false} />
        </SlidingPanel>

        {/* Mobile Translations Panel */}
        <SlidingPanel
          isOpen={showTranslations}
          onClose={() => setShowTranslations(false)}
          title="Translation"
          variant="mobile"
          type="translations"
        >
          <TranslationsPanel ayahs={surahDetails?.ayahs || []} showSurahNumber={false} />
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