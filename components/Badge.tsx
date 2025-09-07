import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-muted text-text-secondary',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
    outline: 'border border-border text-text-secondary hover:bg-muted'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Preset badge components for common use cases
export function StatusBadge({ status }: { status: 'active' | 'inactive' | 'pending' | 'expired' }) {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    inactive: { variant: 'default' as const, label: 'Inactive' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    expired: { variant: 'error' as const, label: 'Expired' }
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: 'low' | 'medium' | 'high' | 'urgent' }) {
  const priorityConfig = {
    low: { variant: 'default' as const, label: 'Low' },
    medium: { variant: 'primary' as const, label: 'Medium' },
    high: { variant: 'warning' as const, label: 'High' },
    urgent: { variant: 'error' as const, label: 'Urgent' }
  };

  const config = priorityConfig[priority];
  
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: 'grant' | 'competition' | 'investor' | 'accelerator' }) {
  const typeConfig = {
    grant: { variant: 'primary' as const, label: 'Grant' },
    competition: { variant: 'accent' as const, label: 'Competition' },
    investor: { variant: 'secondary' as const, label: 'Investor' },
    accelerator: { variant: 'success' as const, label: 'Accelerator' }
  };

  const config = typeConfig[type];
  
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}
