import Link from 'next/link';
import CardForm from '../CardForm';

export default function NewCardPage() {
  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Νέα κάρτα</h1>
        <Link href="/admin" className="btn secondary">← Πίσω</Link>
      </div>
      <div className="form-card">
        <CardForm />
      </div>
    </div>
  );
}
