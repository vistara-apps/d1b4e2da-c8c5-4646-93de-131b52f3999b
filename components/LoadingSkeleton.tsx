import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function LoadingSkeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: LoadingSkeletonProps) {
  const baseClasses = 'loading-skeleton';
  
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 ? 'w-3/4' : 'w-full',
              className
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
    />
  );
}

// Preset skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="card-default space-y-4">
      <LoadingSkeleton variant="rectangular" height={48} />
      <LoadingSkeleton variant="text" lines={3} />
      <div className="flex justify-between items-center">
        <LoadingSkeleton variant="text" width="40%" />
        <LoadingSkeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="card-default space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" width="80%" />
          <LoadingSkeleton variant="text" lines={2} />
        </div>
        <LoadingSkeleton variant="circular" width={40} height={40} />
      </div>
      <div className="flex flex-wrap gap-2">
        <LoadingSkeleton variant="rectangular" width={60} height={24} />
        <LoadingSkeleton variant="rectangular" width={80} height={24} />
        <LoadingSkeleton variant="rectangular" width={70} height={24} />
      </div>
      <div className="flex justify-between items-center">
        <LoadingSkeleton variant="text" width="30%" />
        <LoadingSkeleton variant="rectangular" width={100} height={36} />
      </div>
    </div>
  );
}
