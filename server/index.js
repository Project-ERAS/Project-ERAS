require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const fallbackPath = path.resolve(__dirname, '..', 'serviceAccountKey.json');

  if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson);
    return admin.initializeApp({
      credential: admin.credential.cert(parsed),
    });
  }

  const candidatePath = serviceAccountPath || fallbackPath;
  if (candidatePath && fs.existsSync(candidatePath)) {
    const parsed = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    return admin.initializeApp({
      credential: admin.credential.cert(parsed),
    });
  }

  return admin.initializeApp();
}

initializeFirebase();

const db = admin.firestore();
const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '1mb' }));

function asTrimmedString(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function asNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeAlert(doc) {
  const data = doc.data() || {};

  return {
    id: doc.id,
    status: typeof data.status === 'string' ? data.status : null,
    location: typeof data.location === 'string' ? data.location : 'Unknown location',
    latitude: asNumber(data.latitude),
    longitude: asNumber(data.longitude),
    cameraId: asNumber(data.cameraId),
    device: asTrimmedString(data.device),
    note: asTrimmedString(data.note),
    severity: asTrimmedString(data.severity),
    createdAt: data.createdAt || null,
    resolvedAt: data.resolvedAt || null,
  };
}

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'eras-node-backend' });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/alerts/latest', async (_req, res) => {
  try {
    const snapshot = await db.collection('alerts').orderBy('createdAt', 'desc').limit(1).get();
    if (snapshot.empty) {
      return res.status(404).json({ ok: false, message: 'No alerts found' });
    }

    return res.json({ ok: true, alert: normalizeAlert(snapshot.docs[0]) });
  } catch (error) {
    console.error('GET /alerts/latest failed', error);
    return res.status(500).json({ ok: false, message: 'Failed to load latest alert' });
  }
});

app.get('/alerts/:id', async (req, res) => {
  try {
    const doc = await db.collection('alerts').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ ok: false, message: 'Alert not found' });
    }

    return res.json({ ok: true, alert: normalizeAlert(doc) });
  } catch (error) {
    console.error('GET /alerts/:id failed', error);
    return res.status(500).json({ ok: false, message: 'Failed to load alert' });
  }
});

app.get('/alerts', async (req, res) => {
  try {
    const limitParam = Number(req.query.limit || 20);
    const safeLimit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;
    const status = asTrimmedString(req.query.status);

    let query = db.collection('alerts').orderBy('createdAt', 'desc').limit(safeLimit);
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const alerts = snapshot.docs.map(normalizeAlert);

    return res.json({ ok: true, alerts });
  } catch (error) {
    console.error('GET /alerts failed', error);
    return res.status(500).json({ ok: false, message: 'Failed to load alerts' });
  }
});

app.post('/alerts', async (req, res) => {
  try {
    const location = asTrimmedString(req.body.location);
    if (!location) {
      return res.status(400).json({ ok: false, message: 'location is required' });
    }

    const alertDoc = {
      status: asTrimmedString(req.body.status) || 'active',
      location,
      latitude: asNumber(req.body.latitude),
      longitude: asNumber(req.body.longitude),
      cameraId: asNumber(req.body.cameraId),
      device: asTrimmedString(req.body.device),
      note: asTrimmedString(req.body.note),
      severity: asTrimmedString(req.body.severity) || 'medium',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await db.collection('alerts').add(alertDoc);
    return res.status(201).json({ ok: true, alertId: ref.id });
  } catch (error) {
    console.error('POST /alerts failed', error);
    return res.status(500).json({ ok: false, message: 'Failed to create alert' });
  }
});

app.post('/detections/elephant', async (req, res) => {
  try {
    const location = asTrimmedString(req.body.location) || 'Railway Sector 04';
    const cameraId = asNumber(req.body.cameraId) || 1;
    const latitude = asNumber(req.body.latitude) || 6.9271;
    const longitude = asNumber(req.body.longitude) || 80.7743;
    const device = asTrimmedString(req.body.device) || 'IoT-Sensor-Phone-01';

    const alertDoc = {
      status: 'active',
      location,
      latitude,
      longitude,
      cameraId,
      device,
      note: asTrimmedString(req.body.note),
      severity: asTrimmedString(req.body.severity) || 'high',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await db.collection('alerts').add(alertDoc);
    return res.status(201).json({ ok: true, alertId: ref.id });
  } catch (error) {
    console.error('POST /detections/elephant failed', error);
    return res.status(500).json({ ok: false, message: 'Failed to create elephant detection' });
  }
});

app.patch('/alerts/:id/done', async (req, res) => {
  try {
    const ref = db.collection('alerts').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return res.status(404).json({ ok: false, message: 'Alert not found' });
    }

    await ref.update({
      status: 'done',
      resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true, alertId: req.params.id });
  } catch (error) {
    console.error('PATCH /alerts/:id/done failed', error);
    return res.status(500).json({ ok: false, message: 'Failed to mark alert done' });
  }
});

app.post('/alerts/:id/done', async (req, res) => {
  try {
    const ref = db.collection('alerts').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return res.status(404).json({ ok: false, message: 'Alert not found' });
    }

    await ref.update({
      status: 'done',
      resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true, alertId: req.params.id });
  } catch (error) {
    console.error('POST /alerts/:id/done failed', error);
    return res.status(500).json({ ok: false, message: 'Failed to mark alert done' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`ERAS Node backend listening on port ${port}`);
});