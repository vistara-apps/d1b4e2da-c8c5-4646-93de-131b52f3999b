import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'featured';
  className?: string;
  onClick?: () => void;
}

export function Card({ 
  children, 
  variant = 'default', 
  className = '',
  onClick 
}: CardProps) {
  const baseClasses = 'transition-all duration-200 cursor-pointer';
  
  const variantClasses = {
    default: 'card-default',
    featured: 'card-featured'
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
