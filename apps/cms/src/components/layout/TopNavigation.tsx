import { FC } from 'react';

export const TopNavigation: FC = () => {
  return (
    <nav className="scrollbar-hide mb-6 flex space-x-4 overflow-x-auto border-b border-neutral-800/50 px-4">
      <a
        href="#"
        className="border-b-2 border-indigo-500 px-3 py-2 text-sm font-medium whitespace-nowrap text-white"
      >
        Overview
      </a>
      <a
        href="#"
        className="border-b-2 border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap text-neutral-400 transition-colors hover:text-white"
      >
        Activity
      </a>
      <a
        href="#"
        className="border-b-2 border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap text-neutral-400 transition-colors hover:text-white"
      >
        Settings
      </a>
    </nav>
  );
};
