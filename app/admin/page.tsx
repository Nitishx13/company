'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication (replace with real auth in production)
    if (credentials.email === 'admin@onyxry.agency' && credentials.password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-chalk-dark flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <svg
            width="60"
            height="60"
            viewBox="0 0 120 120"
            className="mx-auto mb-4"
          >
            <rect x="40" y="20" width="40" height="80" className="chalk-line" />
            <line x1="40" y1="60" x2="80" y2="60" className="chalk-line" />
            <circle cx="60" cy="60" r="35" className="chalk-line" />
          </svg>
          <h1 className="text-3xl font-bold mb-2">ONYXRY</h1>
          <p className="text-chalk-gray font-mono text-sm">ADMIN PORTAL</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full bg-transparent border border-chalk-gray/30 px-4 py-3 text-chalk-white focus:outline-none focus:border-chalk-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs tracking-wider text-chalk-gray mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full bg-transparent border border-chalk-gray/30 px-4 py-3 text-chalk-white focus:outline-none focus:border-chalk-white transition-colors"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm font-mono">{error}</div>
          )}

          <button
            type="submit"
            className="w-full px-8 py-4 border border-chalk-white hover:bg-chalk-white hover:text-chalk-black transition-all duration-300 font-mono text-sm tracking-wider"
          >
            LOGIN
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 border border-chalk-gray/20 text-center">
          <p className="text-chalk-gray text-xs font-mono mb-2">DEMO CREDENTIALS</p>
          <p className="text-chalk-white text-sm">admin@onyxry.agency</p>
          <p className="text-chalk-white text-sm">admin123</p>
        </div>
      </div>
    </div>
  );
}
