import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
  const { fullName, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-950 text-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center font-display font-bold">L</div>
            <div>
              <span className="font-display font-semibold tracking-tight block leading-tight">Legality Sekolah Tengah</span>
              <span className="text-[11px] text-accent-300 tracking-wide uppercase">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-navy-300">{fullName || 'Admin'}</span>
            <button onClick={signOut} className="text-navy-300 hover:text-white transition-colors">
              Sign out
            </button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-1 border-t border-navy-800">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                isActive ? 'text-white border-accent-500' : 'text-navy-200 border-transparent hover:text-white'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/legality-sekolah"
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                isActive ? 'text-white border-accent-500' : 'text-navy-200 border-transparent hover:text-white'
              }`
            }
          >
            Legality (Sekolah)
          </NavLink>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
