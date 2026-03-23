import fs from 'node:fs';
import path from 'node:path';

function readProjectId() {
  const envId = process.env.FIREBASE_PROJECT_ID ?? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  if (typeof envId === 'string' && envId.trim().length > 0) return envId.trim();

  try {
    const firebasercPath = path.join(process.cwd(), '.firebaserc');
    const json = JSON.parse(fs.readFileSync(firebasercPath, 'utf8'));
    const id = json?.projects?.default;
    if (typeof id === 'string' && id.trim().length > 0) return id.trim();
  } catch {
    return null;
  }

  return null;
}

function readEmulatorHostPort(service, fallback) {
  const map = {
    auth: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    firestore: process.env.FIRESTORE_EMULATOR_HOST,
  };

  const env = map[service];
  if (typeof env === 'string' && env.trim().length > 0) return env.trim();

  try {
    const firebaseJsonPath = path.join(process.cwd(), 'firebase.json');
    const json = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
    const emulator = json?.emulators?.[service];
    const host = typeof emulator?.host === 'string' && emulator.host.trim().length > 0 ? emulator.host.trim() : '127.0.0.1';
    const port = typeof emulator?.port === 'number' ? emulator.port : null;
    if (port) return `${host}:${port}`;
  } catch {
    return fallback;
  }

  return fallback;
}

async function doFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${options?.method ?? 'GET'} ${url} -> ${res.status} ${res.statusText}${text ? `\n${text}` : ''}`);
  }
}

const projectId = readProjectId();
if (!projectId) {
  console.error('Unable to determine Firebase project id. Set FIREBASE_PROJECT_ID and retry.');
  process.exit(1);
}

const authHost = readEmulatorHostPort('auth', '127.0.0.1:9099');
const firestoreHost = readEmulatorHostPort('firestore', '127.0.0.1:8080');

const authUrl = `http://${authHost}/emulator/v1/projects/${encodeURIComponent(projectId)}/accounts`;
const firestoreUrl = `http://${firestoreHost}/emulator/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;

try {
  await doFetch(authUrl, { method: 'DELETE' });
  await doFetch(firestoreUrl, { method: 'DELETE' });
  console.log(`Cleared Auth + Firestore emulator data for project "${projectId}".`);
} catch (err) {
  console.error(String(err?.message ?? err));
  process.exit(1);
}
