import { FC, ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="inline-flex items-center">
              {index > 0 && (
                <svg
                  className="mx-1 h-4 w-4 text-neutral-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="inline-flex items-center text-sm font-medium text-neutral-300">
                  {item.icon && <span className="mr-2 text-neutral-500">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  className="inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-white"
                >
                  {item.icon && <span className="mr-2 text-neutral-500">{item.icon}</span>}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
