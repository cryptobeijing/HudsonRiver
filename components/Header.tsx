export default function Header() {
  return (
    <header className="relative text-white shadow-lg overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/HCCB.jpg')`,
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 drop-shadow-lg">
              <span className="text-5xl">🌊</span>
              Hudson Flow
            </h1>
            <p className="text-blue-100 mt-1 text-lg drop-shadow-md">
              Learn the River • Live Data • Stay Safe
            </p>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-blue-200">Monitoring</p>
                <p className="font-semibold">Hudson River Entrance (NYH1927)</p>
                <p className="text-xs text-blue-100 mt-0.5">
                  LAT/LON: 40.7076° N 74.0253° W
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                📍
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
