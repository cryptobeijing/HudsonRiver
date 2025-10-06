import { NextResponse } from 'next/server';

// Force dynamic rendering - don't cache at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// NOAA The Battery station for tides (near Hoboken)
const NOAA_TIDE_STATION = '8518750'; // The Battery, NY
// NOAA Currents station - Hudson River north of George Washington Bridge
const NOAA_CURRENTS_STATION = 'NYH1927'; // Station ID
const NOAA_CURRENTS_BIN = '13'; // Bin (depth) number
const NOAA_CURRENTS_FULL_ID = 'NYH1927_13';

export async function GET() {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    // Fetch tide predictions
    const NOAA_TIDE_URL = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&datum=MLLW&station=${NOAA_TIDE_STATION}&time_zone=lst_ldt&units=english&interval=hilo&format=json&begin_date=${dateStr}&range=24`;

    // Fetch current predictions using the standard API with station and bin
    const NOAA_CURRENTS_URL = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=currents_predictions&station=${NOAA_CURRENTS_STATION}&bin=${NOAA_CURRENTS_BIN}&date=today&time_zone=lst_ldt&units=english&format=json&interval=MAX_SLACK`;

    // Try to fetch real tide data
    let tideData = null;
    let currentsData = null;
    let apiError = null;

    try {
      console.log(`Attempting to fetch tide data from NOAA station ${NOAA_TIDE_STATION}...`);
      const tideResponse = await fetch(NOAA_TIDE_URL, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Accept': 'application/json',
        }
      });

      if (tideResponse.ok) {
        tideData = await tideResponse.json();
        console.log('NOAA tide response:', JSON.stringify(tideData).substring(0, 500));
      } else {
        apiError = `HTTP ${tideResponse.status}: ${tideResponse.statusText}`;
        console.error('NOAA Tide API HTTP error:', apiError);
      }
    } catch (e) {
      apiError = String(e);
      console.error('NOAA Tide API failed:', e);
    }

    // Try to fetch currents data
    try {
      console.log(`Attempting to fetch currents data from NOAA station ${NOAA_CURRENTS_FULL_ID}...`);
      const currentsResponse = await fetch(NOAA_CURRENTS_URL, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Accept': 'application/json',
        }
      });

      if (currentsResponse.ok) {
        currentsData = await currentsResponse.json();
        console.log('NOAA currents response:', JSON.stringify(currentsData).substring(0, 500));
      } else {
        console.error('NOAA Currents API HTTP error:', currentsResponse.status);
      }
    } catch (e) {
      console.error('NOAA Currents API failed:', e);
      // Don't fail if currents unavailable, we'll use calculated values
    }

    // If tide API fails, return error
    if (!tideData || !tideData.predictions || tideData.predictions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Unable to fetch tide data from NOAA API',
        details: apiError || 'No predictions returned',
        station: NOAA_TIDE_STATION
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

    // Parse currents data if available
    let currentSpeed = 0;
    let currentDirection = 0;
    let currentType = 'unknown';
    let currentsAvailable = false;

    if (currentsData && currentsData.current_predictions && currentsData.current_predictions.cp) {
      // Find the most recent current prediction
      const currentPredictions = currentsData.current_predictions.cp;
      console.log('Currents predictions count:', currentPredictions.length);

      // Find current or upcoming prediction
      const currentTime = new Date();
      let closestPrediction = null;
      let minDiff = Infinity;

      for (const pred of currentPredictions) {
        const predTime = new Date(pred.Time);
        const diff = Math.abs(predTime.getTime() - currentTime.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          closestPrediction = pred;
        }
      }

      if (closestPrediction) {
        const velocity = parseFloat(closestPrediction.Velocity_Major);
        currentSpeed = Math.abs(velocity);
        currentType = closestPrediction.Type; // "ebb", "flood", or "slack"

        // Set direction based on current type
        // Flood = upstream/north (11°), Ebb = downstream/south (183°)
        if (currentType === 'flood') {
          currentDirection = parseFloat(closestPrediction.meanFloodDir);
        } else if (currentType === 'ebb') {
          currentDirection = parseFloat(closestPrediction.meanEbbDir);
        } else {
          // Slack water - use last known direction
          currentDirection = parseFloat(closestPrediction.meanFloodDir);
        }

        currentsAvailable = true;
        console.log('Current type:', currentType, 'Speed:', currentSpeed, 'Direction:', currentDirection);
      }
    }

    // Fallback: calculate current speed from tide state if currents not available
    if (!currentsAvailable) {
      currentSpeed = calculateCurrentSpeedFromTide(tideState, nextHigh, nextLow);
      // Flood = Rising = upstream/north (11°), Ebb = Falling = downstream/south (183°)
      if (tideState.includes('Flood') || tideState.includes('Rising')) {
        currentDirection = 11; // North/upstream
      } else if (tideState.includes('Ebb') || tideState.includes('Falling')) {
        currentDirection = 183; // South/downstream
      } else {
        currentDirection = 0; // Unknown/slack
      }
      console.log('Using calculated current speed:', currentSpeed, 'Direction:', currentDirection);
    }

    const parsedData = {
      timestamp: new Date().toISOString(),
      station: {
        id: NOAA_TIDE_STATION,
        name: 'The Battery, NY (Tide Heights)',
        currentsId: NOAA_CURRENTS_FULL_ID,
        currentsName: 'Hudson River Entrance - NYH1927_13 (Currents)',
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
        direction: currentDirection,
        speedUnit: 'knots',
        available: currentsAvailable,
        source: currentsAvailable ? 'NOAA Currents' : 'Calculated from tide',
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

// Calculate current speed based on tide state and timing
function calculateCurrentSpeedFromTide(
  tideState: string,
  nextHigh: any,
  nextLow: any
): number {
  const now = new Date();

  // Get time to next tide change
  let nextTideTime: Date | null = null;
  if (nextHigh && nextLow) {
    const highTime = new Date(nextHigh.time);
    const lowTime = new Date(nextLow.time);
    nextTideTime = highTime < lowTime ? highTime : lowTime;
  }

  // Calculate relative position in tidal cycle
  // Maximum current is typically mid-tide (3 hours from high/low)
  // Slack water is at high/low tide
  if (nextTideTime) {
    const minutesToNextTide = (nextTideTime.getTime() - now.getTime()) / (1000 * 60);
    const cyclePosition = Math.abs(minutesToNextTide - 180) / 180; // 0 at slack, 1 at max

    if (tideState.includes('Rising') || tideState.includes('Falling')) {
      // Mid-tide = stronger currents, estimate based on position in cycle
      return 0.5 + cyclePosition * 1.5; // 0.5 to 2.0 knots
    }
  }

  // Slack tide = weaker currents
  return 0.2 + Math.random() * 0.3;
}
