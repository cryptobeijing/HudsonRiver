'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import LiveCurrentMap from '@/components/LiveCurrentMap';
import DataDashboard from '@/components/DataDashboard';
import SafetyAlert from '@/components/SafetyAlert';
import TideTimeline from '@/components/TideTimeline';
import EducationalSection from '@/components/EducationalSection';
import LoadingSpinner from '@/components/LoadingSpinner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [activeTab, setActiveTab] = useState<'live' | 'data' | 'map' | 'learn'>('live');

  // Fetch river data from USGS
  const { data: riverData, error: riverError, isLoading: riverLoading } = useSWR(
    '/api/river-data',
    fetcher,
    { refreshInterval: 900000 } // Refresh every 15 minutes
  );

  // Fetch tide data from NOAA
  const { data: tideData, error: tideError, isLoading: tideLoading } = useSWR(
    '/api/tide-data',
    fetcher,
    { refreshInterval: 300000 } // Refresh every 5 minutes
  );

  const isLoading = riverLoading || tideLoading;
  const hasError = riverError || tideError;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('live')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'live'
                  ? 'border-river-blue text-river-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🌊 Live Conditions
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'data'
                  ? 'border-river-blue text-river-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Data Explorer
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'map'
                  ? 'border-river-blue text-river-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🗺️ Kayak Map
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'learn'
                  ? 'border-river-blue text-river-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📚 Learn
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner />
          </div>
        ) : hasError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold mb-2">Error loading data</p>
            <p className="text-red-600 text-sm">
              {riverError?.message || tideError?.message || 'Please try again later'}
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'live' && (
              <div className="space-y-6">
                <SafetyAlert
                  riverData={riverData?.data}
                  tideData={tideData?.data}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LiveCurrentMap tideData={tideData?.data} />
                  <TideTimeline tideData={tideData?.data} />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow p-6 border-l-4 border-river-blue">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">River Flow</h3>
                    <p className="text-3xl font-bold text-river-blue">
                      {riverData?.data?.measurements?.find((m: any) => m.type === 'discharge')?.current?.toFixed(0) || 'N/A'}
                      <span className="text-lg font-normal text-gray-500 ml-2">ft³/s</span>
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6 border-l-4 border-tide-high">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tide State</h3>
                    <p className="text-xl font-bold text-tide-high">
                      {tideData?.data?.tide?.current || 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Current Speed</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {tideData?.data?.current?.speed?.toFixed(1) || 'N/A'}
                      <span className="text-lg font-normal text-gray-500 ml-2">knots</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <DataDashboard
                riverData={riverData?.data}
                tideData={tideData?.data}
              />
            )}

            {activeTab === 'map' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🗺️</span>
                  Kayak Map - Hudson River Area
                </h2>
                <p className="text-gray-600 mb-4">
                  Interactive map showing kayaking routes, launch points, and points of interest along the Hudson River.
                </p>
                <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/d/embed?mid=17Cn-Lwu9g4UmhFDQjXk9GBEvcHWgQfaF&ehbc=2E312F"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Hudson River Kayak Map"
                  ></iframe>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">💡 Tip:</span> Use this map to plan your route and check current conditions before heading out.
                    Always check the live conditions tab for safety information.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'learn' && (
              <EducationalSection />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-2">Hudson Flow</h3>
              <p className="text-gray-400 text-sm">
                Learn science and safety from the real Hudson River
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Data Sources</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• USGS Water Data (River Flow)</li>
                <li>
                  • NOAA Tide Heights (Station{' '}
                  <a
                    href="https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8518750"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 underline"
                  >
                    8518750
                  </a>{' '}
                  - The Battery)
                </li>
                <li>
                  • NOAA Currents (Station{' '}
                  <a
                    href="https://tidesandcurrents.noaa.gov/noaacurrents/predictions?id=NYH1927_13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 underline"
                  >
                    NYH1927_13
                  </a>{' '}
                  - Hudson River Entrance)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Hoboken Cove Community Boathouse</h3>
              <p className="text-gray-400 text-sm">
                <a
                  href="https://sites.google.com/hobokencoveboathouse.org/hccb/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors underline"
                >
                  Visit HCCB Website ↗
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>Data updates every 15 minutes • Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
