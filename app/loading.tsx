export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-md">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex justify-center">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
