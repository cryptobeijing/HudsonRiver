// Quick test script to verify API endpoints work
const fetch = require('node-fetch');

async function testUSGS() {
  console.log('Testing USGS API endpoint...');
  try {
    const url = 'https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01335754&period=P1D&parameterCd=00060,00065';
    const response = await fetch(url);
    const data = await response.json();

    if (data.value?.timeSeries && data.value.timeSeries.length > 0) {
      console.log('✅ USGS API working!');
      console.log(`   Station: ${data.value.timeSeries[0].sourceInfo.siteName}`);
      console.log(`   Time series count: ${data.value.timeSeries.length}`);

      data.value.timeSeries.forEach(series => {
        const varCode = series.variable.variableCode[0].value;
        const varName = series.variable.variableName;
        const values = series.values[0].value;
        console.log(`   ${varName} (${varCode}): ${values.length} data points`);
        console.log(`     Latest: ${values[values.length - 1].value} at ${values[values.length - 1].dateTime}`);
      });
    } else {
      console.log('❌ USGS API returned no data');
    }
  } catch (error) {
    console.error('❌ USGS API error:', error.message);
  }
}

async function testNOAA() {
  console.log('\nTesting NOAA API endpoint...');
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&datum=MLLW&station=8518750&time_zone=lst_ldt&units=english&interval=hilo&format=json&begin_date=${today}&range=24`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.predictions && data.predictions.length > 0) {
      console.log('✅ NOAA API working!');
      console.log(`   Predictions count: ${data.predictions.length}`);
      console.log('   Next few tides:');
      data.predictions.slice(0, 4).forEach(pred => {
        console.log(`     ${pred.type === 'H' ? 'High' : 'Low'} tide: ${pred.v} ft at ${pred.t}`);
      });
    } else {
      console.log('❌ NOAA API returned no predictions');
    }
  } catch (error) {
    console.error('❌ NOAA API error:', error.message);
  }
}

async function main() {
  await testUSGS();
  await testNOAA();
}

main();
