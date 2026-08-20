/**
 * One-off cleanup: delete `rooms` documents that aren't in ROOM_NUMBERS.
 *
 * The app seeds missing rooms but never removes old ones, so changing the
 * property's room list leaves the previous numbers behind as documents the UI
 * filters out. This deletes those leftovers.
 *
 * Reads the same Firebase config as the app (.env.local, or the environment)
 * and signs in anonymously, so it needs no service-account key -- just the
 * web config and the deployed Firestore rules.
 *
 *   node scripts/prune-rooms.mjs           # dry run: list what would go
 *   node scripts/prune-rooms.mjs --delete  # actually delete
 */
import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { collection, getDocs, getFirestore, writeBatch } from 'firebase/firestore';
import { ROOM_NUMBERS } from '../src/types.ts';

/** Firestore caps a batch at 500 writes. */
const BATCH_LIMIT = 400;

/** Minimal .env parser -- enough for the KEY=value lines the app's config uses. */
function loadEnvFile(path) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return {};
  }
  const out = {};
  for (const line of text.split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["'](.*)["']$/, '$1');
  }
  return out;
}

const fileEnv = loadEnvFile(new URL('../.env.local', import.meta.url));
const env = (key) => process.env[key] || fileEnv[key] || '';

const config = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
};

if (!config.apiKey || !config.projectId) {
  console.error(
    'Missing Firebase config. Copy .env.example to .env.local and fill it in,\n' +
      'or set VITE_FIREBASE_* in the environment before running this script.',
  );
  process.exit(1);
}

const dryRun = !process.argv.includes('--delete');

const app = initializeApp(config);
await signInAnonymously(getAuth(app));
const db = getFirestore(app);

const snap = await getDocs(collection(db, 'rooms'));
const keep = new Set(ROOM_NUMBERS);
// Match the app's filter, which goes by `name`, and fall back to the document
// id so a doc with a missing or malformed name is still caught.
const stale = snap.docs.filter((d) => !keep.has(String(d.data().name ?? d.id)));

console.log(`Project ${config.projectId}: ${snap.size} room docs, ${keep.size} rooms in the app.`);

if (stale.length === 0) {
  console.log('Nothing stale to remove.');
  process.exit(0);
}

console.log(`\n${stale.length} stale doc(s):`);
for (const d of stale) console.log(`  ${d.id}  (name: ${JSON.stringify(d.data().name ?? null)})`);

if (dryRun) {
  console.log('\nDry run -- nothing deleted. Re-run with --delete to remove them.');
  process.exit(0);
}

for (let i = 0; i < stale.length; i += BATCH_LIMIT) {
  const chunk = stale.slice(i, i + BATCH_LIMIT);
  const batch = writeBatch(db);
  for (const d of chunk) batch.delete(d.ref);
  await batch.commit();
  console.log(`Deleted ${i + chunk.length}/${stale.length}...`);
}

console.log('Done.');
process.exit(0);
