import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Homepage', end: true },
  { to: '/legality', label: 'Legality', dropdown: [
    { to: '/legality/alumni', label: 'Alumni' },
    { to: '/legality/sekolah', label: 'Sekolah' },
    { to: '/legality/random', label: 'Random' },
  ]},
  { to: '/kit-legality', label: 'Kit Legality' },
  { to: '/template-form', label: 'Template Form Program Sekolah' },
  { to: '/tds-chart', label: 'TDS Organisation Chart' },
];

export default function UserLayout() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileLegalityOpen, setMobileLegalityOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close the desktop dropdown on outside click/tap — works for mouse and touch alike
  useEffect(() => {
    if (!openDropdown) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openDropdown]);

  // Close menus whenever the route changes
  useEffect(() => {
    setOpenDropdown(false);
    setMobileOpen(false);
    setMobileLegalityOpen(false);
  }, [location.pathname]);

  const isLegalityActive = location.pathname.startsWith('/legality');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center font-display font-bold shrink-0">L</div>
            <span className="font-display font-semibold tracking-tight truncate">Legality Sekolah Tengah</span>
          </div>

          <div className="flex items-center gap-3">
            <NavLink to="/login" className="hidden sm:inline text-sm text-navy-300 hover:text-white transition-colors">
              Admin login
            </NavLink>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="md:hidden text-white p-1.5 -mr-1.5"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex max-w-7xl mx-auto px-6 flex-wrap gap-1 border-t border-navy-800">
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.label} ref={dropdownRef} className="relative">
                <button
                  onClick={() => setOpenDropdown((open) => !open)}
                  aria-expanded={openDropdown}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    isLegalityActive
                      ? 'text-white border-accent-500'
                      : 'text-navy-200 border-transparent hover:text-white'
                  }`}
                >
                  {item.label} <span className={`ml-1 text-xs inline-block transition-transform ${openDropdown ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openDropdown && (
                  <div className="absolute left-0 top-[calc(100%+4px)] bg-white text-navy-900 rounded-xl border border-slate-200 shadow-xl min-w-[180px] py-1.5 z-40 overflow-hidden">
                    {item.dropdown.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 text-sm transition-colors ${
                            isActive ? 'bg-accent-50 text-accent-600 font-medium' : 'hover:bg-slate-50'
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'text-white border-accent-500'
                      : 'text-navy-200 border-transparent hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-navy-800 px-4 py-3 space-y-1 max-h-[calc(100vh-56px)] overflow-y-auto">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'bg-navy-800 text-white' : 'text-navy-200'}`
              }
            >
              Homepage
            </NavLink>

            <div>
              <button
                onClick={() => setMobileLegalityOpen((o) => !o)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isLegalityActive ? 'text-white' : 'text-navy-200'
                }`}
              >
                Legality
                <span className={`text-xs transition-transform ${mobileLegalityOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {mobileLegalityOpen && (
                <div className="ml-3 pl-3 border-l border-navy-800 space-y-1 mt-1">
                  {navItems[1].dropdown.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-navy-800 text-white font-medium' : 'text-navy-300'}`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {navItems.slice(2).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'bg-navy-800 text-white' : 'text-navy-200'}`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="pt-2 mt-2 border-t border-navy-800">
              <NavLink to="/login" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-navy-300">
                Admin login
              </NavLink>
            </div>
          </nav>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
