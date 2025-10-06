# 🌊 Hudson Flow: Learn the River

**Tagline:** Learn science and safety from the real Hudson River — with live currents, tides, and kayak tips!

An educational web application that combines real-time river monitoring data with interactive visualizations and educational content to teach students, kayakers, and environmental learners about the Hudson River.

---

## 🎯 Mission

Teach users about:
- How tides and currents change over time
- How to read live river data (velocity, discharge, tide height)
- How weather and moon cycles affect water conditions
- Real-time safety alerts for kayaking in the Hoboken area

**This makes it both educational (STEM + environment) and practical (safety tool).**

---

## ✨ Features

### 🌊 Live Conditions Dashboard
- **Real-time Safety Alerts** - Color-coded safety levels (Safe/Caution/Danger) based on current conditions
- **Live Current Map** - Visual representation of current direction and strength with animated arrows
- **Tide Timeline** - View upcoming high/low tides with countdown timers
- **Quick Stats** - River flow, tide state, and current speed at a glance

### 📊 Data Explorer
- **River Discharge Charts** - 24-hour history of water flow rates from USGS
- **Gage Height Monitoring** - Water level trends over time
- **Tide Predictions** - Interactive charts showing tide cycles
- **Educational Context** - Each data type explained with "What is this?" sections

### 📚 Educational Content
- **6 Interactive Lessons** covering:
  - River Discharge & Hydrology
  - How Tides Work
  - Understanding Currents
  - Kayaking Safety
  - Gage Height Measurement
  - The Hudson River Estuary
- **Filterable by Category** - Hydrology, Tides, Safety, Environment
- **Difficulty Levels** - Beginner, Intermediate, Advanced
- **Quick Quizzes** - Test your knowledge after each lesson

---

## 🧩 Data Sources

| Source | Purpose | API Endpoint |
|--------|---------|--------------|
| **USGS Water Data** | Real-time gage height & discharge from Hudson River | `waterservices.usgs.gov/nwis/iv/` |
| **NOAA Tides & Currents** | Tide predictions & current measurements from The Battery, NY | `api.tidesandcurrents.noaa.gov/api/prod/datagetter` |

- **USGS Station**: 01377260 (Hudson River at Pier 40, NY)
- **NOAA Station**: 8518750 (The Battery, NY)
- **Update Frequency**: River data every 15 minutes, Tide data every 5 minutes

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hudson-flow

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app!

### Build for Production

```bash
npm run build
npm start
```

---

## 📦 Tech Stack

### Framework & Language
- **Next.js 14** (App Router with Server Components)
- **TypeScript** (Full type safety)
- **React 18** (Latest features)

### Styling & UI
- **Tailwind CSS** (Utility-first styling)
- **Custom CSS animations** (Water flow, current arrows, tide effects)

### Data & Visualization
- **SWR** (Real-time data fetching with auto-revalidation)
- **Recharts** (Interactive charts for data visualization)
- **date-fns** (Date formatting and manipulation)

### APIs
- **USGS Water Services API** (River monitoring data)
- **NOAA CO-OPS API** (Tide & current predictions)

---

## 🏗️ Project Structure

```
hudson-flow/
├── app/
│   ├── api/
│   │   ├── river-data/route.ts    # USGS API integration
│   │   └── tide-data/route.ts     # NOAA API integration
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main application
│   └── globals.css                # Global styles & animations
│
├── components/
│   ├── Header.tsx                 # Application header
│   ├── LiveCurrentMap.tsx         # Animated current visualization
│   ├── TideTimeline.tsx           # Tide predictions timeline
│   ├── SafetyAlert.tsx            # Color-coded safety warnings
│   ├── DataDashboard.tsx          # Charts & data explorer
│   ├── EducationalSection.tsx     # Interactive lessons
│   └── LoadingSpinner.tsx         # Loading state
│
├── lib/
│   └── safety.ts                  # Safety assessment logic & utilities
│
├── types/
│   └── river.ts                   # TypeScript interfaces
│
└── README.md
```

---

## 🎓 Educational Value

### Learning Objectives

**Students will learn:**
- ✅ How to read and interpret real-time hydrological data
- ✅ The relationship between tides, currents, and river discharge
- ✅ Safety considerations for recreational water activities
- ✅ The unique characteristics of estuarine environments
- ✅ How scientists monitor and measure natural water systems

### Standards Alignment
- **Next Generation Science Standards (NGSS)**: Earth's Systems, Human Impact
- **STEM Education**: Data analysis, environmental science, practical application
- **Water Safety Education**: Risk assessment, decision-making

---

## ⚙️ How It Works

### Data Flow

```
[User Request]
     ↓
[Next.js Page]
     ↓
[SWR Hook] ──→ [API Routes]
                    ↓
          [External APIs (USGS/NOAA)]
                    ↓
          [Data Processing & Parsing]
                    ↓
          [Safety Assessment]
                    ↓
     [Components Render with Live Data]
```

### Safety Assessment Logic

The app calculates safety levels based on:

```typescript
// Discharge thresholds (ft³/s)
< 15,000: Safe
15,000 - 25,000: Caution
> 25,000: Danger

// Current speed thresholds (knots)
< 1.5: Safe
1.5 - 2.5: Caution
> 2.5: Danger
```

Recommendations adjust based on:
- River discharge rate
- Tidal current speed
- Tide state (flood/ebb)
- Combined conditions

---

## 🎨 Design Features

### Visual Theme
- **Water-inspired gradients** - Blues, teals, and river colors
- **Animated elements** - Flowing water, current arrows, tide pulses
- **Color-coded safety zones** - Green (safe), Yellow (caution), Red (danger)
- **Responsive design** - Works on desktop, tablet, and mobile

### Animations
- `water-flow` - Gradient animation for river effects
- `current-arrow` - Pulsing arrows showing current direction
- `tide-indicator` - Rising/falling tide visualization
- `pulse-slow` - Gentle pulsing for emphasis

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel dashboard for automatic deployments.

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

### Environment Variables

No environment variables required! The app uses public APIs.

For future enhancements (analytics, caching), you might add:
```env
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## 🌟 Perfect For

### Educational Use
- 🏫 **Schools & Classrooms** - STEM education, environmental science
- 👨‍🏫 **Teachers** - Real-world data for lessons
- 🎓 **Students** - Interactive learning tool
- 📚 **Field Trips** - Prepare for river visits

### Recreational Use
- 🛶 **Kayakers** - Check conditions before paddling
- 🎣 **Fishers** - Understand tide and current patterns
- 🚤 **Boaters** - Plan safe outings
- 🏖️ **Waterfront Visitors** - Learn about the river

### Technical Showcases
- 🏆 **Hackathons** - Unique educational + practical angle
- 💼 **Portfolios** - Full-stack Next.js application
- 🎯 **Interviews** - API integration, data visualization
- 📊 **EdTech** - Real-time data in education

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Weather integration (wind speed, precipitation)
- [ ] Historical data comparison (year-over-year)
- [ ] User accounts & saved locations
- [ ] Notification system for unsafe conditions
- [ ] Mobile app (React Native)

### Phase 3
- [ ] Multiple monitoring locations along Hudson
- [ ] Predictive safety forecasting (24-hour ahead)
- [ ] Social features (trip reports, photos)
- [ ] Gamification (badges, challenges)
- [ ] Teacher dashboard & lesson plans

### Technical Improvements
- [ ] Database caching (Supabase/PostgreSQL)
- [ ] WebSocket for real-time updates
- [ ] PWA features (offline mode)
- [ ] Advanced visualizations (3D river model)
- [ ] Multi-language support

---

## 📊 API Rate Limits

- **USGS**: No explicit rate limit, updates every 15 minutes
- **NOAA**: 10 requests per second per IP
- **App Caching**: 15 minutes for river data, 5 minutes for tide data

---

## 🤝 Contributing

This project is perfect for:
- Adding new monitoring locations
- Improving educational content
- Enhancing visualizations
- Adding accessibility features
- Creating lesson plans for teachers

---

## 📜 License

MIT License - Free to use for educational purposes

---

## 🙏 Credits

**Data Sources:**
- USGS (U.S. Geological Survey) - Water Resources Data
- NOAA (National Oceanic and Atmospheric Administration) - Tides & Currents

**Built with:**
- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts
- SWR

---

## 📧 Support

For questions or issues:
- Check the educational lessons in the app
- Review API documentation (USGS/NOAA)
- Inspect browser console for errors

---

## 🌊 Safety Disclaimer

**IMPORTANT:** This app provides educational information and general safety guidance. Always:
- Check official weather forecasts before going on the water
- Follow local regulations and restrictions
- Wear a properly fitted life jacket
- Tell someone your plans and expected return time
- Use common sense - when in doubt, don't go out!

The developers are not responsible for decisions made based on this app's data.

---

## 🎉 Have Fun Learning!

Explore the Hudson River through data, understand the forces that shape our waterways, and stay safe on the water!

**Built for hackathons, education, and the love of rivers 🌊**
