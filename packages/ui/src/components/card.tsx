import * as React from 'react';
import { cn } from '../lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-[8px] border border-[#E5E5E5] bg-[#FFFFFF] text-[#111111] shadow-sm", className)} {...props} />
  )
)
Card.displayName = "Card"

export { Card }
