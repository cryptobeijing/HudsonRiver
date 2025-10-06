# 🚀 Installation Guide - Hudson Flow

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- A code editor (VS Code recommended)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## Step 1: Install Dependencies

Open your terminal and navigate to the project:

```bash
cd /Users/hk/Desktop/1006/hudson-flow
```

Install all required packages:

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts (for charts)
- SWR (for data fetching)
- axios, date-fns, lucide-react

**Expected time**: 1-2 minutes

---

## Step 2: Verify Installation

Check that everything installed correctly:

```bash
npm list --depth=0
```

You should see all dependencies listed without errors.

---

## Step 3: Start Development Server

Run the development server:

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

---

## Step 4: Open in Browser

Visit **http://localhost:3000**

You should see:
- Hudson Flow header
- Three navigation tabs (Live Conditions, Data Explorer, Learn)
- Loading spinner while fetching data
- After ~2 seconds, live river data appears!

---

## 🎉 Success!

If you see the app loading river data, you're all set!

---

## 🐛 Troubleshooting

### Issue: `npm install` fails

**Solution 1**: Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2**: Use different Node version
```bash
nvm install 18
nvm use 18
npm install
```

---

### Issue: Port 3000 already in use

**Solution**: Use a different port
```bash
PORT=3001 npm run dev
```

Or kill the process using port 3000:
```bash
# On Mac/Linux
lsof -ti:3000 | xargs kill

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Issue: TypeScript errors

**Solution**: Ensure TypeScript is installed
```bash
npm install -D typescript @types/react @types/node
```

---

### Issue: "Cannot find module..."

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules .next
npm install
npm run dev
```

---

### Issue: API data not loading

**Possible causes**:
1. No internet connection
2. USGS/NOAA APIs temporarily down
3. Firewall blocking API requests

**Check**: Open browser console (F12) and look for errors

---

## 📦 Build for Production

When ready to deploy:

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm start
```

---

## 🚀 Deploy

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel
```

### Or connect GitHub to Vercel:
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import repository
4. Click "Deploy"

---

## 🔧 Development Scripts

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📁 Verify File Structure

Make sure you have these key files:

```
hudson-flow/
├── app/
│   ├── api/
│   │   ├── river-data/route.ts ✓
│   │   └── tide-data/route.ts ✓
│   ├── layout.tsx ✓
│   ├── page.tsx ✓
│   └── globals.css ✓
├── components/ (9 files) ✓
├── lib/safety.ts ✓
├── types/river.ts ✓
├── package.json ✓
├── tsconfig.json ✓
├── next.config.js ✓
├── tailwind.config.ts ✓
└── README.md ✓
```

---

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🎓 Next Steps After Installation

1. **Explore the app** - Click through all three tabs
2. **Check live data** - Verify USGS/NOAA data is loading
3. **Test responsiveness** - Resize browser window
4. **Read lessons** - Click through educational content
5. **Review code** - Familiarize yourself with structure
6. **Make changes** - Edit and see hot reload in action

---

## 📚 Useful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts**: https://recharts.org/en-US/
- **USGS API**: https://waterservices.usgs.gov/
- **NOAA API**: https://api.tidesandcurrents.noaa.gov/

---

## 🆘 Still Having Issues?

1. Check `README.md` for detailed documentation
2. Review `QUICKSTART.md` for usage guide
3. Inspect browser console (F12) for errors
4. Verify Node.js version: `node --version` (should be 18+)
5. Check npm version: `npm --version` (should be 9+)

---

## ✅ Installation Checklist

- [ ] Node.js 18+ installed
- [ ] Navigated to project directory
- [ ] Ran `npm install` successfully
- [ ] Started dev server with `npm run dev`
- [ ] Opened http://localhost:3000 in browser
- [ ] Saw Hudson Flow app load
- [ ] Live data displaying (river flow, tides, etc.)
- [ ] All three tabs working (Live, Data, Learn)
- [ ] No console errors in browser (F12)

If all boxes are checked - you're ready to go! 🎉

---

## 🌊 Happy Coding!

You now have a fully functional Hudson Flow application running locally. Explore the code, make changes, and deploy when ready!

**Remember**: This app uses public APIs - no API keys or environment variables needed!
