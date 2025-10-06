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
  const [activeTab, setActiveTab] = useState<'live' | 'data' | 'learn'>('live');

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
                <li>• USGS Water Data</li>
                <li>• NOAA Tides & Currents</li>
                <li>• Real-time monitoring</li>
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
