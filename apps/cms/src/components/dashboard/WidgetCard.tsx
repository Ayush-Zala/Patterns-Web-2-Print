import { FC, ReactNode } from 'react';

interface WidgetCardProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const WidgetCard: FC<WidgetCardProps> = ({ title, children, actions, className = '' }) => {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
        <h3 className="font-semibold tracking-tight text-white">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      <div className="flex flex-1 flex-col p-5">{children}</div>
    </div>
  );
};
