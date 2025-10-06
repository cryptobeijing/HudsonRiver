# 🚀 Hudson Flow - Quick Start Guide

## Get Running in 3 Minutes!

### 1. Install Dependencies
```bash
cd hudson-flow
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Visit **http://localhost:3000**

---

## 🎮 How to Use the App

### Live Conditions Tab (Default View)
1. **Check the Safety Alert** at the top - color-coded for easy assessment
2. **View the Current Map** - see direction and strength of water flow
3. **Check Tide Timeline** - see when next high/low tide occurs
4. **Review Quick Stats** - river flow, tide state, current speed

### Data Explorer Tab
1. Click **"📊 Data Explorer"** in the navigation
2. **Scroll through charts** - Discharge, Gage Height, Tide Predictions
3. **Read explanations** - Each chart has educational context
4. **Hover over charts** - See specific values at different times

### Learn Tab
1. Click **"📚 Learn"** in the navigation
2. **Browse lessons** - 6 interactive educational modules
3. **Filter by category** - Hydrology, Tides, Safety, Environment
4. **Click a lesson card** - Opens detailed content modal
5. **Read through content** - Step-by-step learning points
6. **Take the quick quiz** - Test your knowledge

---

## 📱 Navigation

| Tab | Icon | Purpose |
|-----|------|---------|
| Live Conditions | 🌊 | Real-time safety & current info |
| Data Explorer | 📊 | Charts & historical data |
| Learn | 📚 | Educational lessons |

---

## 🎨 Understanding Safety Colors

| Color | Level | Meaning |
|-------|-------|---------|
| 🟢 Green | Safe | Good for kayaking |
| 🟡 Yellow | Caution | Experienced paddlers only |
| 🔴 Red | Danger | Stay off the water |

---

## 📊 Key Metrics Explained

### River Discharge (ft³/s)
- **What it is**: Volume of water flowing past a point per second
- **Safe range**: < 15,000 ft³/s
- **Caution**: 15,000 - 25,000 ft³/s
- **Danger**: > 25,000 ft³/s

### Current Speed (knots)
- **What it is**: How fast water is moving
- **Safe range**: < 1.5 knots
- **Caution**: 1.5 - 2.5 knots
- **Danger**: > 2.5 knots

### Tide State
- **Flood/Rising**: Water flowing upstream (north)
- **Ebb/Falling**: Water flowing downstream (south)
- **Slack**: Brief calm period - best for kayaking!

---

## 🔄 Data Updates

- **River Data**: Every 15 minutes from USGS
- **Tide Data**: Every 5 minutes from NOAA
- **Auto-refresh**: Built-in with SWR
- **Manual refresh**: Reload the page

---

## 🐛 Troubleshooting

### "Loading river data..." stuck?
- Check your internet connection
- USGS/NOAA APIs might be temporarily down
- Try refreshing the page

### Charts not showing?
- Ensure JavaScript is enabled
- Try a different browser (Chrome/Firefox recommended)
- Check browser console for errors (F12)

### API Errors?
- External APIs might be under maintenance
- Check your network connection
- Wait a few minutes and try again

---

## 💻 Development Commands

```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Type checking
npx tsc --noEmit

# Lint code
npm run lint
```

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main application page |
| `app/api/river-data/route.ts` | USGS API integration |
| `app/api/tide-data/route.ts` | NOAA API integration |
| `lib/safety.ts` | Safety assessment logic |
| `components/*` | UI components |

---

## 🎓 For Teachers

### Classroom Use
1. **Project on screen** - Show live data to class
2. **Discuss safety** - Use color coding to teach risk assessment
3. **Explain charts** - Walk through data interpretation
4. **Assign lessons** - Students complete educational modules
5. **Field trip prep** - Check conditions before river visit

### Learning Activities
- Compare discharge over different days
- Predict next tide time
- Calculate time between high tides
- Research how tides work
- Design a kayaking safety checklist

---

## 🚀 Deploy to Production

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Manual Deployment
1. Run `npm run build`
2. Upload `.next` folder to your host
3. Run `npm start` on server
4. Configure reverse proxy (nginx/apache)

---

## 📊 Expected Performance

- **Page Load**: < 2 seconds
- **Data Fetch**: < 1 second
- **Chart Render**: Instant
- **Bundle Size**: ~500KB gzipped

---

## 🎯 Quick Tips

1. ✅ **Always check safety alert first** before kayaking
2. 📈 **Look for slack tide** - easiest time to paddle
3. 📊 **Compare current to historical** - is it normal?
4. 🌊 **Watch the current map** - know which way water flows
5. 📚 **Complete all lessons** - become a river expert!

---

## 🆘 Need Help?

1. Check **README.md** for full documentation
2. Review **educational lessons** in the app
3. Inspect browser console (F12) for errors
4. Check USGS/NOAA status pages

---

## 🎉 You're Ready!

Start exploring the Hudson River through real-time data and interactive learning!

**Remember**: Safety first - always wear a life jacket! 🛶
