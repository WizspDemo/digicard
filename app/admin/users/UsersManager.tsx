'use client';

import { useEffect, useState } from 'react';

type UserRow = {
  id: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
  createdAt: string;
  card: { id: string; slug: string; fullName: string } | null;
};

export default function UsersManager() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [tempCred, setTempCred] = useState<{ email: string; tempPassword: string } | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCreating(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName })
    });
    const data = await res.json().catch(() => ({}));
    setCreating(false);
    if (res.ok) {
      setTempCred({ email: data.email, tempPassword: data.tempPassword });
      setEmail('');
      setFullName('');
      load();
    } else {
      setError(data.error || 'Κάτι πήγε στραβά.');
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Διαγραφή αυτού του χρήστη; Η κάρτα του θα μείνει αλλά χωρίς ιδιοκτήτη.')) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  }

  async function onResetPassword(id: string, email: string) {
    if (!confirm(`Επαναφορά κωδικού για ${email};`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setTempCred({ email, tempPassword: data.tempPassword });
    }
  }

  return (
    <div>
      {tempCred && (
        <div className="success-msg" style={{ marginBottom: 20 }}>
          Προσωρινός κωδικός για <strong>{tempCred.email}</strong>: <code>{tempCred.tempPassword}</code>
          <br />
          Στείλ' τον στον χρήστη — θα του ζητηθεί να τον αλλάξει με το πρώτο login.
          <button
            type="button"
            className="btn secondary"
            style={{ marginLeft: 12 }}
            onClick={() => setTempCred(null)}
          >
            Κλείσιμο
          </button>
        </div>
      )}

      <div className="form-card" style={{ marginBottom: 24 }}>
        <h3 className="form-section-title" style={{ marginTop: 0 }}>Νέος χρήστης</h3>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={onCreate}>
          <div className="form-grid">
            <div className="field">
              <label>Ονοματεπώνυμο *</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="field">
              <label>Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" disabled={creating}>
              {creating ? 'Δημιουργία...' : '+ Δημιουργία χρήστη & κάρτας'}
            </button>
          </div>
        </form>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Ρόλος</th>
              <th>Κάρτα</th>
              <th>Κατάσταση</th>
              <th>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role === 'ADMIN' ? 'Διαχειριστής' : 'Χρήστης'}</td>
                <td>
                  {u.card ? (
                    <a href={`/u/${u.card.slug}`} target="_blank" rel="noreferrer">/u/{u.card.slug}</a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{u.mustChangePassword ? 'Εκκρεμεί αλλαγή κωδικού' : 'Ενεργός'}</td>
                <td className="actions-row">
                  <button className="btn secondary" type="button" onClick={() => onResetPassword(u.id, u.email)}>
                    Επαναφορά κωδικού
                  </button>
                  {u.role !== 'ADMIN' && (
                    <button className="btn danger" type="button" onClick={() => onDelete(u.id)}>
                      Διαγραφή
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>
                  Δεν υπάρχουν χρήστες ακόμα.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
