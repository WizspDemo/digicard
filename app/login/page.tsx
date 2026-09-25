'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      if (data.mustChangePassword) {
        router.push('/change-password');
      } else {
        router.push(params.get('next') || (data.role === 'ADMIN' ? '/admin' : '/dashboard'));
      }
      router.refresh();
    } else {
      setError('Λάθος email ή κωδικός.');
    }
  }

  return (
    <div className="login-card">
      <h1 style={{ marginTop: 0 }}>Σύνδεση</h1>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Κωδικός πρόσβασης</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Έλεγχος...' : 'Είσοδος'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="wrap">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
