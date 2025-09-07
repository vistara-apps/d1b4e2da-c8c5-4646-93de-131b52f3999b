import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  leftIcon,
  rightIcon,
  fullWidth = false
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative';
  
  const variantClasses = {
    primary: 'btn-primary focus:ring-primary/50',
    secondary: 'btn-secondary focus:ring-secondary/50', 
    outline: 'btn-outline focus:ring-primary/50',
    ghost: 'text-text-primary hover:bg-muted active:bg-muted/80 focus:ring-primary/50',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 focus:ring-destructive/50 shadow-sm hover:shadow-md'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading && (
        <LoadingSpinner 
          size={size === 'lg' ? 'md' : 'sm'} 
          className="absolute" 
        />
      )}
      
      <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
        {leftIcon && (
          <span className={cn('flex-shrink-0', iconSizeClasses[size])}>
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className={cn('flex-shrink-0', iconSizeClasses[size])}>
            {rightIcon}
          </span>
        )}
      </span>
    </button>
  );
}
