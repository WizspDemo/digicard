'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Card } from '@prisma/client';

type FormState = Partial<Card>;

type FieldDef = { key: keyof FormState; label: string; type?: string; full?: boolean };

const SECTIONS: { title: string; fields: FieldDef[] }[] = [
  {
    title: 'Βασικά στοιχεία',
    fields: [
      { key: 'fullName', label: 'Ονοματεπώνυμο *' },
      { key: 'jobTitle', label: 'Τίτλος θέσης' },
      { key: 'company', label: 'Εταιρεία' },
      { key: 'headline', label: 'Σύντομη περιγραφή / headline', full: true }
    ]
  },
  {
    title: 'Επικοινωνία',
    fields: [
      { key: 'phone', label: 'Τηλέφωνο (κινητό)', type: 'tel' },
      { key: 'phone2', label: 'Τηλέφωνο 2 (σταθερό/εργασίας)', type: 'tel' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'email2', label: 'Email 2', type: 'email' },
      { key: 'whatsapp', label: 'WhatsApp (αριθμός)', type: 'tel' },
      { key: 'website', label: 'Ιστοσελίδα', type: 'url' }
    ]
  },
  {
    title: 'Κοινωνικά δίκτυα',
    fields: [
      { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { key: 'instagram', label: 'Instagram URL', type: 'url' },
      { key: 'facebook', label: 'Facebook URL', type: 'url' },
      { key: 'tiktok', label: 'TikTok URL', type: 'url' },
      { key: 'telegram', label: 'Telegram URL', type: 'url' },
      { key: 'twitter', label: 'X / Twitter URL', type: 'url' }
    ]
  },
  {
    title: 'Διεύθυνση & λοιπές πληροφορίες',
    fields: [
      { key: 'addressStreet', label: 'Οδός & αριθμός', full: true },
      { key: 'addressCity', label: 'Πόλη' },
      { key: 'addressState', label: 'Νομός / Περιοχή' },
      { key: 'addressPostalCode', label: 'Τ.Κ.' },
      { key: 'addressCountry', label: 'Χώρα' },
      { key: 'birthday', label: 'Γενέθλια', type: 'date' }
    ]
  }
];

const IMAGE_FIELDS: { key: keyof FormState; label: string }[] = [
  { key: 'photoUrl', label: 'Φωτογραφία προφίλ (avatar)' },
  { key: 'coverUrl', label: 'Εικόνα εξωφύλλου (cover)' },
  { key: 'logoUrl', label: 'Λογότυπο εταιρείας' }
];

function ImageUploadField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Η μεταφόρτωση απέτυχε.');
    }
  }

  return (
    <div className="field full image-field">
      <label>{label}</label>
      {error && <div className="error-msg" style={{ marginBottom: 8 }}>{error}</div>}
      <div className="image-field-row">
        {value && <img src={value} alt="" className="image-preview" />}
        <div style={{ flex: 1 }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={onFileChange}
            style={{ marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="url"
              placeholder="ή επικόλλησε URL εικόνας"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            {value && (
              <button type="button" className="btn secondary" onClick={() => onChange('')}>
                Αφαίρεση
              </button>
            )}
          </div>
          {uploading && <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Μεταφόρτωση...</div>}
        </div>
      </div>
    </div>
  );
}

export default function CardForm({
  initial,
  hideSlug = false
}: {
  initial?: Card;
  hideSlug?: boolean;
}) {
  const [form, setForm] = useState<FormState>(
    initial || { themeColor: '#6d28d9', slug: '' }
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const isEdit = Boolean(initial);

  function update(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName) {
      setError('Το ονοματεπώνυμο είναι υποχρεωτικό.');
      return;
    }
    setSaving(true);
    setError('');
    const url = hideSlug ? '/api/cards/me' : isEdit ? `/api/cards/${initial!.id}` : '/api/cards';
    const method = hideSlug ? 'PATCH' : isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setSaved(true);
      if (!hideSlug) {
        router.push(`/admin/${data.id}`);
      }
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Κάτι πήγε στραβά.');
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="error-msg">{error}</div>}
      {saved && hideSlug && <div className="success-msg">Οι αλλαγές αποθηκεύτηκαν.</div>}

      <div className="form-section">
        <h3 className="form-section-title">Εικόνες</h3>
        <div className="form-grid">
          {IMAGE_FIELDS.map((f) => (
            <ImageUploadField
              key={f.key}
              label={f.label}
              value={(form[f.key] as string) || ''}
              onChange={(v) => update(f.key, v)}
            />
          ))}
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="form-section">
          <h3 className="form-section-title">{section.title}</h3>
          <div className="form-grid">
            {section.fields.map((f) => (
              <div key={f.key} className={`field ${f.full ? 'full' : ''}`}>
                <label>{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={(form[f.key] as string) || ''}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {!hideSlug && (
        <div className="form-section">
          <h3 className="form-section-title">Ρυθμίσεις</h3>
          <div className="form-grid">
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
        </div>
      )}

      {hideSlug && (
        <div className="form-section">
          <h3 className="form-section-title">Εμφάνιση</h3>
          <div className="form-grid">
            <div className="field">
              <label>Χρώμα θέματος</label>
              <input
                type="color"
                value={form.themeColor || '#6d28d9'}
                onChange={(e) => update('themeColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
        <button className="btn" disabled={saving}>
          {saving ? 'Αποθήκευση...' : isEdit || hideSlug ? 'Αποθήκευση αλλαγών' : 'Δημιουργία κάρτας'}
        </button>
      </div>
    </form>
  );
}
