'use client';

import { TideData } from '@/types/river';
import { getCurrentDirection } from '@/lib/safety';

interface LiveCurrentMapProps {
  tideData?: TideData;
}

export default function LiveCurrentMap({ tideData }: LiveCurrentMapProps) {
  if (!tideData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🗺️ Live Current Map</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const { current, tide } = tideData;
  const direction = current.direction;
  const speed = current.speed || 0;

  // Determine arrow direction based on current
  const getArrowRotation = () => {
    if (direction !== null) {
      return direction;
    }
    // Fallback based on tide state
    if (tide.current.includes('Flood') || tide.current.includes('Rising')) {
      return 0; // North (upstream)
    } else if (tide.current.includes('Ebb') || tide.current.includes('Falling')) {
      return 180; // South (downstream)
    }
    return 90; // Default east
  };

  const rotation = getArrowRotation();

  // Determine current strength visualization
  const getStrengthColor = () => {
    if (speed > 2) return 'text-red-500';
    if (speed > 1) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-river-blue">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>🗺️</span>
        Live Current Direction
      </h2>

      {/* Visual Map */}
      <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg p-8 h-80 flex items-center justify-center overflow-hidden">
        {/* River representation */}
        <div className="absolute inset-0 water-gradient opacity-30"></div>

        {/* Shore lines */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-green-700 opacity-20"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-green-700 opacity-20"></div>

        {/* Direction indicators */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-gray-600 font-semibold">
          ⬆️ North (Upstream)
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 font-semibold">
          ⬇️ South (Downstream)
        </div>

        {/* Current arrows */}
        <div className="relative z-10">
          <div className="flex flex-col items-center gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`current-arrow text-6xl ${getStrengthColor()} transition-all duration-1000`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 1 - i * 0.2,
                }}
              >
                ➡️
              </div>
            ))}
          </div>
        </div>

        {/* Kayaker icon */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-4xl opacity-80">
          🛶
        </div>
      </div>

      {/* Current Info */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Direction</p>
          <p className="text-2xl font-bold text-river-blue">
            {getCurrentDirection(direction)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {direction !== null ? `${direction}°` : 'Based on tide'}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Speed</p>
          <p className={`text-2xl font-bold ${getStrengthColor()}`}>
            {speed.toFixed(1)} knots
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {speed > 2 ? 'Strong' : speed > 1 ? 'Moderate' : 'Weak'}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          <span className="font-semibold">Tide State:</span> {tide.current}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {(tide.current.includes('Rising') || tide.current.includes('Flood')) && '📈 Flood current - flows upstream (north)'}
          {(tide.current.includes('Falling') || tide.current.includes('Ebb')) && '📉 Ebb current - flows downstream (south)'}
        </p>
        {current.source && (
          <p className="text-xs text-gray-500 mt-2 italic">
            Data source: {current.source}
          </p>
        )}
      </div>
    </div>
  );
}
