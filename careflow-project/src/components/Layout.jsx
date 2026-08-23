import { Menu, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || user?.email || 'Student';

  return (
    <div className="min-h-screen bg-soft">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            <button
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">Student Dashboard</p>
              <h1 className="text-lg font-bold text-ink">Placement Prep</h1>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <UserCircle size={22} />
              <span className="hidden sm:inline">{displayName}</span>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
