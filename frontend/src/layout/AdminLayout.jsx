import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  legality: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v18M5 8l-3 6a4 4 0 0 0 8 0l-3-6zM19 8l-3 6a4 4 0 0 0 8 0l-3-6z" strokeLinejoin="round" />
      <path d="M2 8h6M16 8h6M8 21h8" strokeLinecap="round" />
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const legalityLinks = [
  { to: '/admin/legality/alumni', label: 'Alumni' },
  { to: '/admin/legality/schools', label: 'Schools' },
];

export default function AdminLayout() {
  const { fullName, signOut } = useAuth();
  const location = useLocation();
  const isLegalitySection = location.pathname.startsWith('/admin/legality');
  const [legalityOpen, setLegalityOpen] = useState(isLegalitySection);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const sidebar = (
    <aside
      className={`w-60 shrink-0 bg-navy-950 text-white flex flex-col h-screen fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 md:translate-x-0 md:sticky md:top-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center font-display font-bold shrink-0">L</div>
        <div className="min-w-0">
          <div className="font-display font-semibold text-sm leading-tight truncate">Legality Sekolah Tengah</div>
          <div className="text-[11px] text-accent-300 tracking-wide uppercase">Admin</div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="md:hidden ml-auto text-navy-400 hover:text-white"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-navy-800 text-white' : 'text-navy-300 hover:bg-navy-900 hover:text-white'
            }`
          }
        >
          {icons.dashboard}
          Dashboard
        </NavLink>

        <div>
          <button
            onClick={() => setLegalityOpen((o) => !o)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isLegalitySection ? 'text-white' : 'text-navy-300 hover:bg-navy-900 hover:text-white'
            }`}
          >
            {icons.legality}
            <span className="flex-1 text-left">Legality</span>
            <span className={`transition-transform ${legalityOpen ? 'rotate-90' : ''}`}>{icons.chevron}</span>
          </button>
          {legalityOpen && (
            <div className="mt-1 ml-3 pl-4 border-l border-navy-800 space-y-1">
              {legalityLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-navy-800 text-white font-medium' : 'text-navy-400 hover:bg-navy-900 hover:text-white'
                    }`
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-navy-800">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-sm font-medium shrink-0">
            {(fullName || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{fullName || 'Admin'}</div>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="text-navy-400 hover:text-white transition-colors shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-20 bg-navy-950 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center font-display font-bold text-sm">L</div>
          <span className="font-display font-semibold text-sm">Legality Sekolah Tengah</span>
        </div>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-1">
          <MenuIcon />
        </button>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          aria-hidden="true"
        />
      )}

      {sidebar}

      <div className="flex-1 min-w-0">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
