'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Card } from '@prisma/client';

type FormState = Partial<Card>;

const FIELDS: { key: keyof FormState; label: string; type?: string; full?: boolean }[] = [
  { key: 'fullName', label: 'Ονοματεπώνυμο *' },
  { key: 'jobTitle', label: 'Τίτλος θέσης' },
  { key: 'company', label: 'Εταιρεία' },
  { key: 'phone', label: 'Τηλέφωνο', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'whatsapp', label: 'WhatsApp (αριθμός)', type: 'tel' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
  { key: 'website', label: 'Ιστοσελίδα', type: 'url' },
  { key: 'address', label: 'Διεύθυνση', full: true },
  { key: 'photoUrl', label: 'URL φωτογραφίας προφίλ', type: 'url', full: true },
  { key: 'logoUrl', label: 'URL λογότυπου εταιρείας', type: 'url', full: true }
];

export default function CardForm({ initial }: { initial?: Card }) {
  const [form, setForm] = useState<FormState>(
    initial || { themeColor: '#6d28d9', slug: '' }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const isEdit = Boolean(initial);

  function update(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName) {
      setError('Το ονοματεπώνυμο είναι υποχρεωτικό.');
      return;
    }
    setSaving(true);
    setError('');
    const url = isEdit ? `/api/cards/${initial!.id}` : '/api/cards';
    const method = isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/${data.id}`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Κάτι πήγε στραβά.');
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="error-msg">{error}</div>}
      <div className="form-grid">
        {FIELDS.map((f) => (
          <div key={f.key} className={`field ${f.full ? 'full' : ''}`}>
            <label>{f.label}</label>
            <input
              type={f.type || 'text'}
              value={(form[f.key] as string) || ''}
              onChange={(e) => update(f.key, e.target.value)}
            />
          </div>
        ))}
        <div className="field">
          <label>Slug (URL) {isEdit ? '' : '— κενό = αυτόματο'}</label>
          <input
            type="text"
            value={form.slug || ''}
            onChange={(e) => update('slug', e.target.value)}
            placeholder="giannis-papadopoulos"
          />
        </div>
        <div className="field">
          <label>Χρώμα θέματος</label>
          <input
            type="color"
            value={form.themeColor || '#6d28d9'}
            onChange={(e) => update('themeColor', e.target.value)}
          />
        </div>
      </div>
      <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
        <button className="btn" disabled={saving}>
          {saving ? 'Αποθήκευση...' : isEdit ? 'Αποθήκευση αλλαγών' : 'Δημιουργία κάρτας'}
        </button>
      </div>
    </form>
  );
}
