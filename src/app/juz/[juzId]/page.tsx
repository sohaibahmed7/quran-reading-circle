'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getJuzDetails } from '@/lib/quran';
import { juzData } from '@/lib/juz_data';
import { Ayah, Juz } from '@/lib/types';
import { useEffect, useState, useRef, useCallback } from 'react';
import TajweedRules from '@/components/TajweedRules';
import SlidingPanel from '@/components/SlidingPanel';
import TranslationsPanel from '@/components/TranslationsPanel';
import PanelHeaderButtons from '@/components/PanelHeaderButtons';


type JuzPageProps = {
  params: Promise<{
    juzId: string;
  }>;
};

export default function JuzPage({ params }: JuzPageProps) {
  const [juzInfo, setJuzInfo] = useState<Juz | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ juzId: string } | null>(null);
  const [juzDetails, setJuzDetails] = useState<{ ayahs: Array<Ayah & { indopakText: string }> } | null>(null);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTranslations, setShowTranslations] = useState(false);
  const [showTajweedPanel, setShowTajweedPanel] = useState(false); // New state for Tajweed panel
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
    
    const fetchJuzData = async () => {
      setLoading(true);
      const juzId = parseInt(resolvedParams.juzId, 10);
      const info = juzData.find(j => j.number === juzId);

      if (info) {
        setJuzInfo(info);
        const details = await getJuzDetails(juzId);
        setJuzDetails(details);

        const response = await fetch(`/api/images?juz=${juzId}`);
        if (response.ok) {
          const data = await response.json();
          setImageFiles(data.files);
        } else {
          console.error('Could not fetch image list.');
        }
      }
      setLoading(false);
    };

    fetchJuzData();
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

  if (!juzInfo || !juzDetails) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Juz not found</h1>
        <Link href="/" className="text-green-500 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-custom-bg font-sans text-gray-900">
      {/* TajweedModal is now a slide-out panel, so no longer rendered here directly */}
      <header className="fixed top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-md shadow-lg z-50 shrink-0">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="text-lg md:text-2xl font-didot text-white px-2">QRC - {juzInfo ? juzInfo.name : 'Loading...'}</Link>
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
          {imageFiles.length > 0 && (
            <div ref={scrollContainerRef} onScroll={handleScroll} className="flex w-full h-full overflow-x-scroll snap-x snap-mandatory scroll-smooth">
              {imageFiles.map((file, index) => (
                <div key={file} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-4">
                  <Image
                    src={file}
                    alt={`Page ${index + 1} from Juz ${juzInfo?.number}`}
                    width={800}
                    height={1100}
                    className="max-h-full w-auto h-auto object-contain shadow-lg"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          )}
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
        </main>

        {/* Desktop Translations Panel */}
        <SlidingPanel
          isOpen={showTranslations}
          title="Translation"
          variant="desktop"
          type="translations"
        >
          <TranslationsPanel ayahs={juzDetails?.ayahs || []} showSurahNumber={true} />
        </SlidingPanel>

        {/* Mobile Translations Panel */}
        <SlidingPanel
          isOpen={showTranslations}
          onClose={() => setShowTranslations(false)}
          title="Translation"
          variant="mobile"
          type="translations"
        >
          <TranslationsPanel ayahs={juzDetails?.ayahs || []} showSurahNumber={true} />
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