import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user =
        mode === 'signin'
          ? await signIn(form.email, form.password)
          : await signUp(form.email, form.password, form.fullName);
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center font-display font-bold text-white">L</div>
          <span className="font-display font-semibold text-navy-900">Legality Sekolah Tengah</span>
        </div>

        <h1 className="font-display text-xl font-semibold text-navy-900 mb-1">
          {mode === 'signin' ? 'Sign in' : 'Create an account'}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {mode === 'signin' ? 'Use your PIC or admin account.' : 'New PIC accounts default to user access.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              className="input"
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          )}
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-navy-800 disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          className="w-full text-center text-sm text-accent-500 hover:text-accent-400 mt-4"
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>

        <p className="text-xs text-slate-400 mt-6 text-center">
          Admin access is granted separately — ask your system owner to run
          <code className="mx-1 bg-slate-100 px-1 rounded">npm run create-admin</code>
          for your account after signing up.
        </p>
      </div>
    </div>
  );
}
