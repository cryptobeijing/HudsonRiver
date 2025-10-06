# 🔧 Troubleshooting Guide - Hudson Flow

## Common Issues and Solutions

### Issue: No Data Showing in Charts

**Symptoms:**
- River Discharge chart is empty
- Gage Height chart is empty
- "Loading..." state persists

**Solutions:**

#### Solution 1: Check API Endpoints
Open browser console (F12) and look for errors. If you see USGS or NOAA API errors, the app will automatically use **mock data** for demonstration.

The app includes intelligent fallbacks:
- ✅ Tries multiple USGS stations
- ✅ Falls back to realistic simulated data
- ✅ Shows warning badge when using mock data

#### Solution 2: Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

#### Solution 3: Clear Browser Cache
```bash
# In browser:
# - Open DevTools (F12)
# - Right-click Refresh button
# - Select "Empty Cache and Hard Reload"
```

#### Solution 4: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `/api/river-data` and `/api/tide-data` requests
5. Check their responses

---

### Understanding Mock Data

#### When Does the App Use Mock Data?

The app automatically uses simulated data when:
1. USGS API is temporarily unavailable
2. NOAA API is temporarily unavailable
3. The selected monitoring station has no current data
4. Network connectivity issues

#### How to Tell If You're Seeing Mock Data?

Look for indicators:
- Footer shows: **"USGS (Mock Data)"** or **"NOAA (Mock Data)"**
- Console logs show warnings
- Data source badge in footer

#### Is Mock Data Realistic?

**Yes!** The mock data is designed to be:
- ✅ Educationally accurate (proper ranges)
- ✅ Realistic patterns (tidal cycles, flow variations)
- ✅ Properly formatted (matches real API structure)
- ✅ Useful for demonstrations and learning

---

### Issue: API Errors in Console

**Error:** `USGS API request failed`

**Cause:** External API might be down or rate-limited

**Solution:**
App automatically handles this! Mock data will be used. No action needed.

---

### Issue: Charts Not Rendering

**Symptoms:**
- Blank spaces where charts should be
- "Cannot read property" errors

**Solutions:**

#### Solution 1: Verify Dependencies
```bash
npm install recharts date-fns
```

#### Solution 2: Check Data Format
Open browser console and check:
```javascript
// In DevTools Console:
fetch('/api/river-data')
  .then(r => r.json())
  .then(d => console.log(d))
```

Should see:
```json
{
  "success": true,
  "data": { ... },
  "source": "USGS" or "USGS (Mock Data)"
}
```

---

### Issue: TypeScript Errors

**Error:** `Cannot find module 'recharts'`

**Solution:**
```bash
npm install --save-dev @types/recharts
```

**Error:** `Property 'measurements' does not exist`

**Solution:**
Check that `types/river.ts` exists and is properly imported.

---

### Issue: Slow Loading

**Symptoms:**
- App takes >5 seconds to load data
- Spinner shows for extended period

**Causes:**
1. External APIs are slow
2. Network latency
3. Multiple API retries

**Solutions:**

#### Optimize API Calls
The app already includes:
- ✅ 15-minute caching for river data
- ✅ 1-hour caching for tide data
- ✅ Multiple station fallbacks
- ✅ Quick mock data fallback

#### Reduce Refresh Interval
Edit `app/page.tsx`:
```typescript
// Change from:
refreshInterval: 900000  // 15 minutes

// To:
refreshInterval: 1800000  // 30 minutes
```

---

### Issue: Safety Alert Not Showing

**Symptoms:**
- No colored safety banner at top
- No recommendations

**Cause:** Missing data from APIs

**Solution:**
Check if `riverData` and `tideData` are loaded:

1. Open browser console
2. Look for error messages
3. Verify API responses

The safety alert requires BOTH river and tide data to calculate conditions.

---

### Issue: Tide Timeline Empty

**Symptoms:**
- "Loading..." persists
- No tide predictions shown

**Solution:**
The app will use mock tide data automatically. Check:

1. **Browser Console** - Look for NOAA errors
2. **Network Tab** - Check `/api/tide-data` response
3. **Mock Data** - Should show simulated tides even if API fails

---

### Issue: Educational Lessons Not Opening

**Symptoms:**
- Clicking lesson cards does nothing
- Modal doesn't appear

**Solutions:**

#### Solution 1: Check JavaScript Errors
```bash
# In browser console (F12)
# Look for errors related to useState or event handlers
```

#### Solution 2: Clear State
```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

---

### Development Issues

#### Issue: `npm run dev` Fails

**Error:** `Cannot find module 'next'`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Issue: Port 3000 In Use

**Solution:**
```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Issue: Build Fails

**Error:** `Type error in components/...`

**Solution:**
```bash
# Run type check
npx tsc --noEmit

# Fix any type errors shown
# Then rebuild
npm run build
```

---

### Testing API Endpoints Directly

#### Test River Data API
```bash
# In browser or terminal:
curl http://localhost:3000/api/river-data

# Should return JSON with:
# - success: true
# - data: { measurements: [...] }
# - source: "USGS" or "USGS (Mock Data)"
```

#### Test Tide Data API
```bash
curl http://localhost:3000/api/tide-data

# Should return JSON with:
# - success: true
# - data: { tide: {...}, current: {...} }
# - source: "NOAA" or "NOAA (Mock Data)"
```

---

### External API Issues

#### USGS API Status
Check: https://waterservices.usgs.gov/

If down, app uses mock data automatically.

#### NOAA API Status
Check: https://tidesandcurrents.noaa.gov/

If down, app uses mock data automatically.

---

### Performance Optimization

#### Reduce Bundle Size
```bash
# Analyze bundle
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

#### Optimize Images (if added)
```javascript
// next.config.js
images: {
  domains: ['your-cdn.com'],
  formats: ['image/avif', 'image/webp'],
}
```

---

### Debugging Checklist

When something isn't working:

- [ ] Check browser console for errors (F12)
- [ ] Check Network tab for failed requests
- [ ] Verify API endpoints return data
- [ ] Clear browser cache and cookies
- [ ] Restart development server
- [ ] Delete `.next` folder and rebuild
- [ ] Check Node.js version (should be 18+)
- [ ] Verify all dependencies installed
- [ ] Check for TypeScript errors
- [ ] Review Recent code changes

---

### Getting Help

#### Check Documentation
1. `README.md` - Full documentation
2. `QUICKSTART.md` - Quick start guide
3. `INSTALL.md` - Installation steps
4. This file - Troubleshooting

#### Check Console Logs
Most issues show helpful error messages in:
- **Browser Console** (F12 → Console tab)
- **Terminal** (where `npm run dev` is running)

#### Verify API Responses
Use browser DevTools Network tab to see actual API responses.

---

### Known Limitations

#### External API Reliability
- USGS and NOAA APIs are free public services
- May have occasional downtime
- Rate limits apply
- App handles this gracefully with mock data

#### Mock Data Usage
- Mock data is for demonstration only
- DO NOT use for actual kayaking decisions
- Always check official sources for real conditions

#### Current Speed Data
- NOAA current speed API often unavailable for The Battery station
- App uses calculated estimates based on tide state
- Real current measurements when API available

---

### Success Indicators

Your app is working correctly if you see:

✅ Safety alert with color coding
✅ Charts displaying data (real or mock)
✅ Tide timeline with predictions
✅ Current map with animated arrows
✅ Educational lessons opening
✅ No JavaScript errors in console
✅ Data refreshing automatically

---

### Still Having Issues?

1. **Read the error message** - Usually tells you what's wrong
2. **Check this guide** - Common issues covered above
3. **Review code** - Look at the component causing issues
4. **Start fresh** - Delete `.next`, reinstall, rebuild
5. **Check versions** - Node 18+, npm 9+

---

## 🎉 Most Issues Are Normal!

External APIs being unavailable is expected! The app is designed to handle this gracefully with mock data, so you can always demonstrate and learn from the application.

**Remember:** Mock data is realistic and educational. Perfect for demos, hackathons, and learning!
