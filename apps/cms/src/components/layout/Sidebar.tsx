import { FC } from 'react';
import { navigationRegistry } from '../../core/registries/navigation.registry';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const groups = navigationRegistry.getGroups();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800/50 bg-neutral-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}
      >
        <div className="flex h-16 items-center border-b border-neutral-800/50 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            P
          </div>
          <span className="ml-3 text-lg font-semibold tracking-tight">Patterns</span>
        </div>

        <div className="flex-1 scrollbar-thin space-y-8 overflow-y-auto px-4 py-6">
          {groups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-2 px-3 text-xs font-medium tracking-wider text-neutral-500 uppercase">
                {group.label}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.route}
                      className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800/50 hover:text-white"
                    >
                      {item.icon && (
                        <span className="mr-3 text-neutral-500 transition-colors group-hover:text-indigo-400">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-800/50 p-4">
          <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-neutral-800/50">
            <div className="h-8 w-8 flex-shrink-0 rounded-full border border-neutral-700 bg-neutral-800" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Ayush Zala</p>
              <p className="truncate text-xs text-neutral-500">Admin Workspace</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
