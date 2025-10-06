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
      const currentPredictions = currentsData.current_predictions.cp;
      console.log('Currents predictions count:', currentPredictions.length);

      // Find the current active period (not just closest time)
      // We need to find which period we're currently IN, not which event is closest
      // IMPORTANT: NOAA returns times in LST/LDT (Eastern Time), we need to parse them correctly
      const now = new Date();

      // Convert current time to Eastern Time for comparison
      // Create a formatter for Eastern Time
      const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

      let activePrediction = null;

      // Sort predictions by time
      const sortedPredictions = [...currentPredictions].sort((a, b) =>
        new Date(a.Time).getTime() - new Date(b.Time).getTime()
      );

      // Find the last prediction that has already occurred
      for (let i = sortedPredictions.length - 1; i >= 0; i--) {
        // Parse NOAA time as Eastern Time (it's already in LST/LDT)
        const predTime = new Date(sortedPredictions[i].Time);
        if (predTime <= easternTime) {
          activePrediction = sortedPredictions[i];
          break;
        }
      }

      // If no past prediction found, use the first one
      if (!activePrediction && sortedPredictions.length > 0) {
        activePrediction = sortedPredictions[0];
      }

      if (activePrediction) {
        const currentIndex = sortedPredictions.indexOf(activePrediction);
        const velocity = parseFloat(activePrediction.Velocity_Major);
        currentType = activePrediction.Type; // "ebb", "flood", or "slack"

        // Interpolate current speed between this prediction and the next
        if (currentIndex < sortedPredictions.length - 1) {
          const nextPred = sortedPredictions[currentIndex + 1];
          const thisTime = new Date(activePrediction.Time);
          const nextTime = new Date(nextPred.Time);
          const thisVelocity = parseFloat(activePrediction.Velocity_Major);
          const nextVelocity = parseFloat(nextPred.Velocity_Major);

          // Calculate time ratio (how far between the two predictions we are)
          const totalDuration = nextTime.getTime() - thisTime.getTime();
          const elapsed = easternTime.getTime() - thisTime.getTime();
          const ratio = totalDuration > 0 ? elapsed / totalDuration : 0;

          // Interpolate velocity (linear interpolation)
          const interpolatedVelocity = thisVelocity + (nextVelocity - thisVelocity) * ratio;
          currentSpeed = Math.abs(interpolatedVelocity);

          // Determine current type based on interpolated velocity
          if (Math.abs(interpolatedVelocity) < 0.2) {
            currentType = 'slack';
          } else if (interpolatedVelocity > 0) {
            currentType = 'flood';
          } else {
            currentType = 'ebb';
          }
        } else {
          // No next prediction, use current value
          currentSpeed = Math.abs(velocity);
        }

        // Set direction based on current type
        // Flood = upstream/north (11°), Ebb = downstream/south (183°)
        if (currentType === 'flood') {
          currentDirection = parseFloat(activePrediction.meanFloodDir);
        } else if (currentType === 'ebb') {
          currentDirection = parseFloat(activePrediction.meanEbbDir);
        } else {
          // Slack water - check next prediction to determine direction
          if (currentIndex < sortedPredictions.length - 1) {
            const nextPred = sortedPredictions[currentIndex + 1];
            if (nextPred.Type === 'flood') {
              currentDirection = parseFloat(nextPred.meanFloodDir);
            } else if (nextPred.Type === 'ebb') {
              currentDirection = parseFloat(nextPred.meanEbbDir);
            } else {
              currentDirection = parseFloat(activePrediction.meanEbbDir);
            }
          } else {
            currentDirection = parseFloat(activePrediction.meanEbbDir);
          }
        }

        currentsAvailable = true;
        console.log('Current type:', currentType, 'Speed:', currentSpeed, 'Direction:', currentDirection, 'Time:', activePrediction.Time);
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
