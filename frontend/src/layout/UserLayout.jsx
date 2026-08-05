import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Homepage', end: true },
  { to: '/legality', label: 'Legality', dropdown: [
    { to: '/legality/sekolah', label: 'Sekolah' },
    { to: '/legality/alumni', label: 'Alumni' },
  ]},
  { to: '/kit-legality', label: 'Kit Legality' },
  { to: '/template-form', label: 'Template Form Program Sekolah' },
  { to: '/tds-chart', label: 'TDS Organisation Chart' },
];

export default function UserLayout() {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center font-display font-bold">L</div>
            <span className="font-display font-semibold tracking-tight">Legality Sekolah Tengah</span>
          </div>
          <NavLink to="/login" className="text-sm text-navy-300 hover:text-white transition-colors">
            Admin login
          </NavLink>
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-1 border-t border-navy-800 overflow-x-auto">
          {navItems.map((item) =>
            item.dropdown ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(true)}
                onMouseLeave={() => setOpenDropdown(false)}
              >
                <button className="px-4 py-3 text-sm font-medium text-navy-200 hover:text-white transition-colors whitespace-nowrap">
                  {item.label} <span className="ml-1 text-xs">▾</span>
                </button>
                {openDropdown && (
                  <div className="absolute left-0 top-full bg-white text-navy-900 rounded-b-lg shadow-lg min-w-[160px] py-1">
                    {item.dropdown.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
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
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
