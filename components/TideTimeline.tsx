'use client';

import { TideData } from '@/types/river';
import { getTimeUntil } from '@/lib/safety';
import { format } from 'date-fns';

interface TideTimelineProps {
  tideData?: TideData;
}

export default function TideTimeline({ tideData }: TideTimelineProps) {
  if (!tideData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🌊 Tide Timeline</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const { tide } = tideData;
  const { nextHigh, nextLow, predictions } = tide;

  // Get today's predictions
  const todaysPredictions = predictions.slice(0, 8);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-tide-high">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>🌊</span>
        Tide Timeline
      </h2>

      {/* Next Tides */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {nextHigh && (
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⬆️</span>
              <span className="font-bold text-blue-700">Next High Tide</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {format(new Date(nextHigh.time), 'h:mm a')}
            </p>
            <p className="text-sm text-blue-600">
              {nextHigh.height.toFixed(2)} ft • {getTimeUntil(nextHigh.time)}
            </p>
          </div>
        )}

        {nextLow && (
          <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⬇️</span>
              <span className="font-bold text-amber-700">Next Low Tide</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">
              {format(new Date(nextLow.time), 'h:mm a')}
            </p>
            <p className="text-sm text-amber-600">
              {nextLow.height.toFixed(2)} ft • {getTimeUntil(nextLow.time)}
            </p>
          </div>
        )}
      </div>

      {/* Tide Animation */}
      <div className="relative bg-gradient-to-b from-sky-200 to-blue-400 rounded-lg h-32 overflow-hidden mb-6">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-600 opacity-50 tide-indicator">
          <div className="absolute top-0 left-0 right-0 h-2 bg-white opacity-30"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
          {tide.current}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-700">Today's Tides</h3>
        <div className="space-y-2">
          {todaysPredictions.map((pred, index) => {
            const isHigh = pred.type === 'High';
            const time = new Date(pred.time);
            const isPast = time < new Date();

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isPast
                    ? 'bg-gray-100 opacity-60'
                    : isHigh
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <div className="text-2xl">
                  {isHigh ? '⬆️' : '⬇️'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {format(time, 'h:mm a')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {pred.type} • {pred.height.toFixed(2)} ft
                  </p>
                </div>
                {!isPast && (
                  <div className="text-sm text-gray-500">
                    {getTimeUntil(pred.time)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
        <p className="font-semibold text-blue-900 mb-1">💡 Did You Know?</p>
        <p className="text-blue-700">
          The Hudson River experiences semi-diurnal tides with two high and two low tides per day.
          Tidal influence extends about 153 miles north to Troy, NY!
        </p>
      </div>
    </div>
  );
}
