import Link from 'next/link';

export default function Home() {
  return (
    <div className="wrap" style={{ color: '#fff', textAlign: 'center', paddingTop: '30vh' }}>
      <h1>DigiCard</h1>
      <p style={{ opacity: 0.6 }}>Ψηφιακές επαγγελματικές κάρτες</p>
      <Link href="/admin" className="btn" style={{ marginTop: 20, display: 'inline-block' }}>
        Πίνακας διαχείρισης
      </Link>
    </div>
  );
}
