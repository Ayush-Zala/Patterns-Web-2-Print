import { FC } from 'react';
import { TopNavigation } from './TopNavigation';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: FC<HeaderProps> = ({ onOpenSidebar, onOpenCommandPalette }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800/50 bg-neutral-950/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="-ml-2 rounded-lg p-2 text-neutral-400 hover:bg-neutral-800/50 hover:text-white lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="group hidden items-center gap-3 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-sm text-neutral-400 transition-colors hover:border-neutral-700 sm:flex"
        >
          <svg
            className="h-4 w-4 text-neutral-500 group-hover:text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Search workspaces, settings, resources...</span>
          <span className="ml-8 flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-400">
            <span>⌘</span>K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="relative rounded-lg p-2 text-neutral-400 hover:bg-neutral-800/50 hover:text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full border-2 border-neutral-950 bg-indigo-500"></span>
        </button>
        <button className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800/50 hover:text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
