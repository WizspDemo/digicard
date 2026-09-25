'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [homeHref, setHomeHref] = useState('/dashboard');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.role === 'ADMIN') setHomeHref('/admin');
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    setLoading(false);
    if (res.ok) {
      router.push(homeHref);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Κάτι πήγε στραβά.');
    }
  }

  return (
    <div className="wrap">
      <div className="login-card">
        <h1 style={{ marginTop: 0 }}>Αλλαγή κωδικού</h1>
        <p style={{ color: '#666', fontSize: 14, marginTop: -8 }}>
          Βάλε τον τρέχοντα κωδικό σου (ή τον προσωρινό που έλαβες) και όρισε νέο.
        </p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="field" style={{ marginBottom: 16 }}>
            <label>Τρέχων κωδικός</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field" style={{ marginBottom: 16 }}>
            <label>Νέος κωδικός (τουλάχιστον 8 χαρακτήρες)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: 16 }}>
            <label>Επιβεβαίωση νέου κωδικού</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Αποθήκευση...' : 'Ορισμός νέου κωδικού'}
          </button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href={homeHref} style={{ color: '#888', fontSize: 13 }}>← Πίσω</Link>
        </div>
      </div>
    </div>
  );
}
