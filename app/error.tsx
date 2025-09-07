'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">
            Something went wrong!
          </h2>
          <p className="text-text-secondary">
            We encountered an error while loading NicheConnect. Please try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn-outline block w-full"
          >
            Go to Dashboard
          </button>
        </div>
        
        {error.digest && (
          <p className="text-xs text-text-secondary">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
