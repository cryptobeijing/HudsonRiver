import { NextResponse } from 'next/server';

// Force dynamic rendering - don't cache at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// USGS Hudson River gauges - using stations with active data
// Note: Lower Hudson (NYC area) stations don't provide real-time discharge data
// Using upstate Hudson River stations with reliable discharge and gage height data
const USGS_STATIONS = [
  '01335754', // Hudson River above Lock 1 near Waterford NY (most downstream with data)
  '01335755', // Hudson River at Lock 1 near Waterford NY
  '01318500', // Hudson River at Hadley NY
];

export async function GET() {
  try {
    let data = null;
    let usedStation = '';
    let lastError = null;

    // Try each station until we get data
    for (const station of USGS_STATIONS) {
      try {
        const USGS_API_URL = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${station}&period=P1D&parameterCd=00060,00065`;

        console.log(`Attempting to fetch from station ${station}...`);
        const response = await fetch(USGS_API_URL, {
          next: { revalidate: 900 }, // Cache for 15 minutes
          headers: {
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const json = await response.json();
          console.log(`Station ${station} response:`, JSON.stringify(json).substring(0, 500));

          if (json.value?.timeSeries && json.value.timeSeries.length > 0) {
            data = json;
            usedStation = station;
            console.log(`Successfully retrieved data from station ${station}`);
            break;
          } else {
            console.log(`Station ${station} returned no time series data`);
          }
        } else {
          console.log(`Station ${station} HTTP error: ${response.status}`);
        }
      } catch (e) {
        lastError = e;
        console.error(`Station ${station} failed:`, e);
        continue;
      }
    }

    // If no data from real stations, return error
    if (!data) {
      console.error('All USGS stations failed. Last error:', lastError);
      return NextResponse.json({
        success: false,
        error: 'Unable to fetch river data from USGS API. All stations failed to respond.',
        details: lastError ? String(lastError) : 'No stations returned valid data',
        stations: USGS_STATIONS
      }, { status: 503 });
    }

    // Parse USGS data
    const timeSeries = data.value.timeSeries;

    const parsedData = {
      timestamp: new Date().toISOString(),
      site: {
        name: timeSeries[0]?.sourceInfo?.siteName || 'Hudson River',
        location: timeSeries[0]?.sourceInfo?.geoLocation?.geogLocation || {
          latitude: 40.7484,
          longitude: -73.9857
        },
      },
      measurements: [] as any[],
    };

    timeSeries.forEach((series: any) => {
      const variable = series.variable;
      const values = series.values[0]?.value;

      if (!values || values.length === 0) return;

      if (variable.variableCode[0].value === '00060') {
        // Discharge (flow rate)
        parsedData.measurements.push({
          type: 'discharge',
          name: 'Discharge',
          unit: 'cubic feet per second',
          unitCode: 'ft³/s',
          current: parseFloat(values[values.length - 1].value),
          history: values.slice(-48).map((v: any) => ({
            time: v.dateTime,
            value: parseFloat(v.value),
          })),
        });
      } else if (variable.variableCode[0].value === '00065') {
        // Gage height
        parsedData.measurements.push({
          type: 'gageHeight',
          name: 'Gage Height',
          unit: 'feet',
          unitCode: 'ft',
          current: parseFloat(values[values.length - 1].value),
          history: values.slice(-48).map((v: any) => ({
            time: v.dateTime,
            value: parseFloat(v.value),
          })),
        });
      }
    });

    // If no measurements found, return error
    if (parsedData.measurements.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Station data contains no valid measurements for discharge or gage height',
        station: usedStation
      }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      source: `USGS (Station ${usedStation})`,
    });

  } catch (error) {
    console.error('Error fetching USGS data:', error);

    return NextResponse.json({
      success: false,
      error: 'API request failed',
      details: String(error)
    }, { status: 500 });
  }
}

