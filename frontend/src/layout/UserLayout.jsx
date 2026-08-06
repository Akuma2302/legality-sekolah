import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  legality: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v18M5 8l-3 6a4 4 0 0 0 8 0l-3-6zM19 8l-3 6a4 4 0 0 0 8 0l-3-6z" strokeLinejoin="round" />
      <path d="M2 8h6M16 8h6M8 21h8" strokeLinecap="round" />
    </svg>
  ),
  kit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" />
      <path d="M8 7.5L11 15M16 7.5L13 15" strokeLinecap="round" />
    </svg>
  ),
  template: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="5" r="2.2" /><circle cx="6" cy="14" r="2.2" /><circle cx="18" cy="14" r="2.2" />
      <path d="M12 7.2V11M9 12.5l-1.5-.7M15 12.5l1.5-.7M6 16.2V19M18 16.2V19" strokeLinecap="round" />
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  login: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const legalityLinks = [
  { to: '/legality/alumni', label: 'Alumni' },
  { to: '/legality/sekolah', label: 'Sekolah' },
];

export default function UserLayout() {
  const location = useLocation();
  const isLegalitySection = location.pathname.startsWith('/legality');
  const [legalityOpen, setLegalityOpen] = useState(isLegalitySection);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-60 shrink-0 bg-navy-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center font-display font-bold shrink-0">L</div>
          <div className="min-w-0">
            <div className="font-display font-semibold text-sm leading-tight truncate">Legality Sekolah Tengah</div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-navy-800 text-white' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            {icons.home}
            Homepage
          </NavLink>

          <div>
            <button
              onClick={() => setLegalityOpen((o) => !o)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isLegalitySection ? 'text-white' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
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
                        isActive ? 'bg-navy-800 text-white font-medium' : 'text-navy-400 hover:bg-navy-800 hover:text-white'
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

          <NavLink
            to="/kit-legality"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-navy-800 text-white' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            {icons.kit}
            Kit Legality
          </NavLink>
          <NavLink
            to="/template-form"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-navy-800 text-white' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            {icons.template}
            Template Form Program Sekolah
          </NavLink>
          <NavLink
            to="/tds-chart"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-navy-800 text-white' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            {icons.chart}
            TDS Organisation Chart
          </NavLink>
        </nav>

        <div className="px-3 py-4 border-t border-navy-800">
          <NavLink
            to="/login"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white transition-colors"
          >
            {icons.login}
            Admin login
          </NavLink>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <main className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
