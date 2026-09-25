# DigiCard — Ψηφιακές επαγγελματικές κάρτες

Next.js + Prisma/Postgres εφαρμογή:
- Κάθε άτομο έχει σελίδα `/u/<slug>` με τα στοιχεία επικοινωνίας του.
- Κουμπί "Αποθήκευση στις Επαφές" κατεβάζει αρχείο `.vcf` (vCard) που ανοίγει
  απευθείας ως νέα επαφή στο κινητό (iOS & Android).
- `/admin` (προστατευμένο με κωδικό) για δημιουργία/επεξεργασία/διαγραφή καρτών
  και λήψη του QR code κάθε κάρτας (δείχνει στο `/u/<slug>`).

## Τοπική ανάπτυξη

```bash
cp .env.example .env
# βάλε DATABASE_URL (postgres), ADMIN_PASSWORD, SESSION_SECRET
npm install
npm run db:push
npm run dev
```

## Deploy στο Coolify

1. Πρόσθεσε Postgres resource στο Coolify (ή χρησιμοποίησε υπάρχον) και πάρε
   το connection string.
2. Δημιούργησε Application από αυτό το repo (build pack: Dockerfile).
3. Environment variables στο Coolify:
   - `DATABASE_URL` — το postgres connection string
   - `ADMIN_PASSWORD` — κωδικός για το `/admin`
   - `SESSION_SECRET` — τυχαίο μεγάλο string
4. Deploy. Το entrypoint τρέχει αυτόματα `prisma db push` πριν ξεκινήσει τον
   server, οπότε το schema δημιουργείται μόνο του στην πρώτη εκκίνηση.
5. Μπες στο `https://<domain>/admin`, βάλε τον κωδικό, δημιούργησε κάρτα,
   κατέβασε το QR από τη σελίδα της κάρτας (`/admin/<id>/qr`) και τύπωσέ το.
