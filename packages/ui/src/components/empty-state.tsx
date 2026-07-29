import * as React from 'react';
import { cn } from '../lib/utils';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center',
        className,
      )}
      {...props}
    >
      <div className="bg-surface flex h-20 w-20 items-center justify-center rounded-full">
        {Icon && <Icon className="text-muted h-10 w-10" />}
      </div>
      <h3 className="text-heading-m mt-4 font-semibold">{title}</h3>
      {description && <p className="text-muted mt-2 mb-4 max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
