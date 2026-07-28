import { FC, useEffect } from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else
          // This would be handled by the parent ideally but for now just prevent default
          return;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[20vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="flex items-center border-b border-neutral-800 px-4 py-4">
          <svg
            className="mr-3 h-5 w-5 text-neutral-400"
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
          <input
            type="text"
            className="w-full bg-transparent text-lg text-white placeholder-neutral-500 focus:outline-none"
            placeholder="Search resources, settings, and commands..."
            autoFocus
          />
          <span className="ml-2 rounded bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-500">
            ESC
          </span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="mb-2 px-2 text-sm font-medium text-neutral-500">Suggestions</div>
          <div className="space-y-1">
            <button className="group flex w-full items-center rounded-xl bg-neutral-800/50 px-3 py-3 text-left text-neutral-200 transition-colors hover:bg-indigo-500/10 hover:text-indigo-400">
              <svg
                className="mr-3 h-5 w-5 text-neutral-400 group-hover:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
              Go to Workspace Settings
            </button>
            <button className="group flex w-full items-center rounded-xl px-3 py-3 text-left text-neutral-300 transition-colors hover:bg-neutral-800/50">
              <svg
                className="mr-3 h-5 w-5 text-neutral-500 group-hover:text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
