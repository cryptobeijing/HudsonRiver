'use client';

import { assessSafety } from '@/lib/safety';
import { RiverData, TideData } from '@/types/river';

interface SafetyAlertProps {
  riverData?: RiverData;
  tideData?: TideData;
}

export default function SafetyAlert({ riverData, tideData }: SafetyAlertProps) {
  if (!riverData || !tideData) {
    return null;
  }

  const discharge = riverData.measurements.find(m => m.type === 'discharge')?.current;
  const currentSpeed = tideData.current.speed;
  const tideState = tideData.tide.current;

  const safety = assessSafety(discharge, currentSpeed, tideState);

  const icons = {
    safe: '✅',
    caution: '⚠️',
    danger: '🚫',
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${safety.color}`}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icons[safety.level]}</div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Kayaking Safety: {safety.message}
          </h2>

          <div className="space-y-2 mt-4">
            {safety.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-current/20">
            <p className="text-sm font-semibold">
              Current Conditions:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm">
              <div>
                <span className="font-medium">Discharge:</span> {discharge?.toFixed(0)} ft³/s
              </div>
              <div>
                <span className="font-medium">Current:</span> {currentSpeed?.toFixed(1) || 'N/A'} knots
              </div>
              <div>
                <span className="font-medium">Tide:</span> {tideState}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
