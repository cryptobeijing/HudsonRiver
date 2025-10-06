export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-river-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-river-blue font-medium">Loading river data...</p>
      <p className="text-sm text-gray-500">Fetching live conditions from USGS & NOAA</p>
    </div>
  );
}
