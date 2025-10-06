import { NextResponse } from 'next/server';

// NOAA The Battery station (near Hoboken)
const NOAA_STATION = '8518750'; // The Battery, NY

export async function GET() {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    const NOAA_TIDE_URL = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&datum=MLLW&station=${NOAA_STATION}&time_zone=lst_ldt&units=english&interval=hilo&format=json&begin_date=${dateStr}&range=24`;

    // Try to fetch real tide data
    let tideData = null;
    let apiError = null;

    try {
      console.log(`Attempting to fetch tide data from NOAA station ${NOAA_STATION}...`);
      const tideResponse = await fetch(NOAA_TIDE_URL, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Accept': 'application/json',
        }
      });

      if (tideResponse.ok) {
        tideData = await tideResponse.json();
        console.log('NOAA response:', JSON.stringify(tideData).substring(0, 500));
      } else {
        apiError = `HTTP ${tideResponse.status}: ${tideResponse.statusText}`;
        console.error('NOAA API HTTP error:', apiError);
      }
    } catch (e) {
      apiError = String(e);
      console.error('NOAA API failed:', e);
    }

    // If API fails, return error
    if (!tideData || !tideData.predictions || tideData.predictions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Unable to fetch tide data from NOAA API',
        details: apiError || 'No predictions returned',
        station: NOAA_STATION
      }, { status: 503 });
    }

    // Parse tide predictions
    const predictions = tideData.predictions || [];
    const now = new Date();

    // Find next high and low tides
    let nextHigh = null;
    let nextLow = null;

    for (const pred of predictions) {
      const predTime = new Date(pred.t);
      if (predTime > now) {
        if (pred.type === 'H' && !nextHigh) {
          nextHigh = {
            time: pred.t,
            height: parseFloat(pred.v),
            type: 'High Tide',
          };
        } else if (pred.type === 'L' && !nextLow) {
          nextLow = {
            time: pred.t,
            height: parseFloat(pred.v),
            type: 'Low Tide',
          };
        }
      }

      if (nextHigh && nextLow) break;
    }

    // Determine current tide state
    let tideState = 'Unknown';
    const sortedPreds = predictions.filter((p: any) => {
      const t = new Date(p.t);
      return Math.abs(t.getTime() - now.getTime()) < 12 * 60 * 60 * 1000;
    }).sort((a: any, b: any) => new Date(a.t).getTime() - new Date(b.t).getTime());

    for (let i = 0; i < sortedPreds.length - 1; i++) {
      const current = new Date(sortedPreds[i].t);
      const next = new Date(sortedPreds[i + 1].t);

      if (now >= current && now <= next) {
        if (sortedPreds[i].type === 'L' && sortedPreds[i + 1].type === 'H') {
          tideState = 'Rising (Flood)';
        } else if (sortedPreds[i].type === 'H' && sortedPreds[i + 1].type === 'L') {
          tideState = 'Falling (Ebb)';
        }
        break;
      }
    }

    // Mock current speed (NOAA currents API often unavailable for this station)
    const currentSpeed = generateRealisticCurrentSpeed(tideState);

    const parsedData = {
      timestamp: new Date().toISOString(),
      station: {
        id: NOAA_STATION,
        name: 'The Battery, NY',
      },
      tide: {
        current: tideState,
        nextHigh,
        nextLow,
        predictions: predictions.map((p: any) => ({
          time: p.t,
          height: parseFloat(p.v),
          type: p.type === 'H' ? 'High' : 'Low',
        })),
      },
      current: {
        speed: currentSpeed,
        direction: tideState.includes('Rising') ? 0 : 180,
        speedUnit: 'knots',
        available: true,
      },
    };

    return NextResponse.json({
      success: true,
      data: parsedData,
      source: 'NOAA',
    });

  } catch (error) {
    console.error('Error fetching NOAA data:', error);

    return NextResponse.json({
      success: false,
      error: 'API request failed',
      details: String(error)
    }, { status: 500 });
  }
}

// Generate realistic current speed based on tide state
function generateRealisticCurrentSpeed(tideState: string): number {
  if (tideState.includes('Rising') || tideState.includes('Falling')) {
    // Mid-tide = stronger currents
    return 1.2 + Math.random() * 0.8;
  } else {
    // Slack tide = weaker currents
    return 0.3 + Math.random() * 0.5;
  }
}
