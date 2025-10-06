'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RiverData, TideData } from '@/types/river';
import { format } from 'date-fns';

interface DataDashboardProps {
  riverData?: RiverData;
  tideData?: TideData;
}

export default function DataDashboard({ riverData, tideData }: DataDashboardProps) {
  if (!riverData || !tideData) {
    return <div className="text-center py-12">No data available</div>;
  }

  const discharge = riverData.measurements.find(m => m.type === 'discharge');
  const gageHeight = riverData.measurements.find(m => m.type === 'gageHeight');

  // Prepare chart data
  const dischargeChartData = discharge?.history.map(d => ({
    time: format(new Date(d.time), 'HH:mm'),
    value: d.value,
  })) || [];

  const gageChartData = gageHeight?.history.map(d => ({
    time: format(new Date(d.time), 'HH:mm'),
    value: d.value,
  })) || [];

  const tideChartData = tideData.tide.predictions.slice(0, 12).map(p => ({
    time: format(new Date(p.time), 'HH:mm'),
    height: p.height,
    type: p.type,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">📊 Data Explorer</h2>
        <p className="text-gray-600">
          Explore real-time and historical data from USGS and NOAA monitoring stations
        </p>
      </div>

      {/* River Discharge Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-river-blue">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          💧 River Discharge (Flow Rate)
        </h3>
        <div className="mb-4">
          <p className="text-3xl font-bold text-river-blue">
            {discharge?.current.toFixed(0)}
            <span className="text-lg font-normal text-gray-500 ml-2">ft³/s</span>
          </p>
          <p className="text-sm text-gray-600">Last 24 hours</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dischargeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: 'Discharge (ft³/s)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1e40af"
              strokeWidth={2}
              dot={false}
              name="Discharge"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
          <p className="font-semibold">📚 What is Discharge?</p>
          <p className="text-gray-700 mt-1">
            Discharge is the volume of water flowing past a point per unit time, measured in cubic feet per second (ft³/s).
            Higher discharge means more water is flowing, which creates stronger currents.
          </p>
        </div>
      </div>

      {/* Gage Height Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          📏 Gage Height (Water Level)
        </h3>
        <div className="mb-4">
          <p className="text-3xl font-bold text-green-600">
            {gageHeight?.current.toFixed(2)}
            <span className="text-lg font-normal text-gray-500 ml-2">ft</span>
          </p>
          <p className="text-sm text-gray-600">Above gage datum</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={gageChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: 'Height (ft)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Gage Height"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-green-50 rounded-lg text-sm">
          <p className="font-semibold">📚 What is Gage Height?</p>
          <p className="text-gray-700 mt-1">
            Gage height is the water level measured from a fixed reference point (datum). Changes in gage height help
            hydrologists monitor river conditions and predict flooding.
          </p>
        </div>
      </div>

      {/* Tide Predictions Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-tide-high">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          🌊 Tide Height Predictions
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={tideChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: 'Height (ft MLLW)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="height"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 4 }}
              name="Tide Height"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
          <p className="font-semibold">📚 Understanding Tides</p>
          <p className="text-gray-700 mt-1">
            Tides are caused by the gravitational pull of the moon and sun. The Hudson River experiences
            semi-diurnal tides (two highs and two lows per day). MLLW = Mean Lower Low Water, a standard tidal datum.
          </p>
        </div>
      </div>

      {/* Data Sources Info */}
      <div className="bg-gradient-to-r from-river-dark to-river-blue text-white rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📡 Data Sources & Updates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <a
              href="https://waterdata.usgs.gov/nwis/rt"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-white/10 rounded-lg p-3 transition-colors"
            >
              <p className="font-semibold mb-2 flex items-center gap-2">
                🏞️ USGS Water Data
                <span className="text-xs">↗</span>
              </p>
              <p className="text-sm text-blue-100">
                Real-time discharge and gage height from Hudson River monitoring stations.
                Data updates every 15 minutes.
              </p>
            </a>
          </div>
          <div>
            <a
              href="https://tidesandcurrents.noaa.gov/map/"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-white/10 rounded-lg p-3 transition-colors"
            >
              <p className="font-semibold mb-2 flex items-center gap-2">
                🌊 NOAA Tides & Currents
                <span className="text-xs">↗</span>
              </p>
              <p className="text-sm text-blue-100">
                Tide predictions and current measurements from The Battery, NY station.
                Predictions generated from harmonic analysis.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
