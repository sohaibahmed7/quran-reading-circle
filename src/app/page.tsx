
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllSurahs } from '@/lib/quran';
import { Surah } from '@/lib/types';
import { juzData } from '@/lib/juz_data';

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'surah' | 'juz'>('juz');

  useEffect(() => {
    const fetchSurahs = async () => {
      setLoading(true);
      const allSurahs = await getAllSurahs();
      setSurahs(allSurahs);
      setLoading(false);
    };
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter((surah) => {
    const term = searchTerm.toLowerCase();
    return (
      surah.englishName.toLowerCase().includes(term) ||
      surah.name.toLowerCase().includes(term) ||
      surah.englishNameTranslation.toLowerCase().includes(term) ||
      surah.number.toString().includes(term)
    );
  });

  const filteredJuz = juzData.filter((juz) => {
    const term = searchTerm.toLowerCase();
    return (
        juz.name.toLowerCase().includes(term) ||
        juz.number.toString().includes(term)
    );
  });

  return (
    <div className="bg-custom-bg text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-md shadow-lg z-50 font-didot">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <Link href="#top" className="text-2xl text-white">QRC - Home</Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#juz-select" className="text-lg text-gray-300 hover:text-white transition-colors">Read</Link>
              {/* /<Link href="#surah-section" className="text-lg text-gray-300 hover:text-white transition-colors">Surahs</Link> */}
              <a href="https://www.youtube.com/channel/UCDp-6IjyN7nbZhpAgjzIhLQ" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-300 hover:text-white transition-colors">QRC YouTube</a>
            </div>
          </div>
        </div>
      </nav>

      <div id="top"></div>

      {/* Hero Section */}
      <section className="font-didot pt-20 pb-12 text-gray-800 px-4 text-center md:text-left">
        <div className="container mx-auto">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-7xl font-bold">Quran Reading Circle</h1>
              <h2 className="font-zuhair-display font-bold text-3xl md:text-5xl my-4">اِقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</h2>
              <p className="text-xl">&ldquo;Read in the name of your Lord who created&rdquo; (Quran 96:1)</p>
              <Link href="#juz-select">
                <button className="mt-6 px-8 py-4 bg-gray-800 text-white text-xl font-bold rounded-lg hover:bg-gray-700 transition-colors hidden md:inline-block">
                  Start Reading
                </button>
              </Link>
            </div>
            <div className="hidden md:flex justify-center md:w-1/2 mt-8 md:mt-0">
              <Image
                src="/images/logo.svg"
                alt="Quran Reading Circle image"
                width={500}
                height={500}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="w-3/4 mx-auto border-b-4 border-gray-800" id="juz-select"></div>

      {/* Search and Toggle Section */}
      <section className="py-2">
        <div className="container mx-auto px-4">
          <div className="mb-8 max-w-2xl mx-auto">
            <h1 className="text-center text-4xl md:text-7xl font-zuhair-display my-6">
              <span className="block">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</span>
            </h1>
            
          </div>
            <div>
            <div className="flex justify-center mb-4">
              <input
              type="text"
              placeholder="Search by name or number..."
              className="w-full md:w-1/2 p-3 text-lg border-2 border-gray-400 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex justify-center border-b-2 border-gray-800">
              <button onClick={() => setView('juz')} className={`px-6 py-3 text-xl font-bold ${view === 'juz' ? ' text-green-600' : 'text-gray-600'}`}>
                Juz
              </button>
              <button onClick={() => setView('surah')} className={`px-6 py-3 text-xl font-bold ${view === 'surah' ? 'text-green-600' : 'text-gray-600'}`}>
                Surah
              </button>
            </div>
            </div>
        </div>
      </section>

      <main className="container mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          view === 'surah' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSurahs.map((surah) => (
                <Link href={`/surah/${surah.number}`} key={surah.number}>
                  <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-green-600">{surah.number}</span>
                          <div className="ml-4">
                            <h2 className="text-xl font-semibold">{surah.englishName}</h2>
                            <p className="text-sm text-gray-500">{surah.englishNameTranslation}</p>
                          </div>
                        </div>
                        <h2 className="text-2xl font-zuhair-text text-right rtl">{surah.name}</h2>
                      </div>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-2">{surah.numberOfAyahs} Ayahs - {surah.revelationType}</p>
                    {/* <span className="text-xs text-gray-500 mt-1 text-right">{surah.revelationType}</span> */}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredJuz.map((juz) => (
                <Link href={`/juz/${juz.number}`} key={juz.number}>
                  <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-green-600">{juz.number}</span>
                          <div className="ml-4">
                            <h2 className="text-xl font-semibold">{juz.name}</h2>
                          </div>
                        </div>
                        <h2 className="text-2xl font-zuhair-text text-right rtl">{juz.arabicName}</h2>
                      </div>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-2">{juz.numberOfSurahs} Surahs</p>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
