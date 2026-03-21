import * as admin from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';
import * as functions from 'firebase-functions/v1';

admin.initializeApp();

type UserProfileUpdate = {
  username?: string;
  phone?: string;
  fullName?: string;
  photoURL?: string;
};

type CreateIncidentInput = {
  location: string;
  latitude?: number;
  longitude?: number;
  cameraId?: string;
  severity?: 'low' | 'medium' | 'high';
  note?: string;
};

type CreateUpdateInput = {
  text: string;
  imagePath?: string;
};

const db = admin.firestore();

function requireAuth(context: functions.https.CallableContext) {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }
  return context.auth.uid;
}

function isAdmin(context: functions.https.CallableContext) {
  return context.auth?.token?.admin === true;
}

export const health = functions.https.onRequest((_req, res) => {
  res.status(200).json({ ok: true });
});

export const onUserCreated = functions.auth.user().onCreate(async (user: UserRecord) => {
  const userRef = db.collection('users').doc(user.uid);
  await userRef.set(
    {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
});

export const setUserProfile = functions.https.onCall(async (data: UserProfileUpdate, context) => {
  const uid = requireAuth(context);
  const update: Record<string, unknown> = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (typeof data?.username === 'string') update.username = data.username.trim();
  if (typeof data?.phone === 'string') update.phone = data.phone.trim();
  if (typeof data?.fullName === 'string') update.fullName = data.fullName.trim();
  if (typeof data?.photoURL === 'string') update.photoURL = data.photoURL.trim();

  await db.collection('users').doc(uid).set(update, { merge: true });
  return { ok: true };
});

export const createIncident = functions.https.onCall(async (data: CreateIncidentInput, context) => {
  const uid = requireAuth(context);

  if (!data || typeof data.location !== 'string' || data.location.trim().length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'location is required.');
  }

  const doc = {
    createdBy: uid,
    location: data.location.trim(),
    latitude: typeof data.latitude === 'number' ? data.latitude : null,
    longitude: typeof data.longitude === 'number' ? data.longitude : null,
    cameraId: typeof data.cameraId === 'string' ? data.cameraId.trim() : null,
    severity: data.severity ?? 'medium',
    note: typeof data.note === 'string' ? data.note.trim() : null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  } as const;

  const ref = await db.collection('incidents').add(doc);

  const shouldNotify = data.severity === 'high' || data.severity === 'medium';
  if (shouldNotify) {
    const topic = 'incidents';
    await admin.messaging().send({
      topic,
      notification: {
        title: 'New incident reported',
        body: doc.location,
      },
      data: {
        incidentId: ref.id,
        severity: doc.severity,
      },
    });
  }

  return { ok: true, incidentId: ref.id };
});

export const createUpdate = functions.https.onCall(async (data: CreateUpdateInput, context) => {
  const uid = requireAuth(context);

  if (!data || typeof data.text !== 'string' || data.text.trim().length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'text is required.');
  }

  const updateDoc = {
    createdBy: uid,
    text: data.text.trim(),
    imagePath: typeof data.imagePath === 'string' ? data.imagePath.trim() : null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  } as const;

  const ref = await db.collection('updates').add(updateDoc);
  return { ok: true, updateId: ref.id };
});

export const setAdminClaim = functions.https.onCall(async (data: { uid: string; admin: boolean }, context) => {
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin privileges required.');
  }
  if (!data || typeof data.uid !== 'string' || data.uid.trim().length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'uid is required.');
  }

  await admin.auth().setCustomUserClaims(data.uid.trim(), { admin: data.admin === true });
  return { ok: true };
});

export const onElephantAlert = functions.firestore
  .document('alerts/{alertId}')
  .onCreate(async (snap) => {
    const data = snap.data() as Record<string, unknown>;

    const userId =
      typeof data.userId === 'string' && data.userId.trim().length > 0
        ? data.userId.trim()
        : typeof data.createdBy === 'string' && data.createdBy.trim().length > 0
          ? data.createdBy.trim()
          : null;

    const location =
      typeof data.location === 'string' && data.location.trim().length > 0
        ? data.location.trim()
        : typeof data.locationName === 'string' && data.locationName.trim().length > 0
          ? data.locationName.trim()
          : 'Unknown location';

    if (!userId) {
      functions.logger.warn('onElephantAlert: missing userId on alert document', {
        alertId: snap.id,
      });
      return;
    }

    const userSnap = await db.collection('users').doc(userId).get();
    const phoneNumberRaw = userSnap.exists
      ? ((userSnap.get('phoneNumber') ?? userSnap.get('phone')) as unknown)
      : null;

    const phoneNumber =
      typeof phoneNumberRaw === 'string' && phoneNumberRaw.trim().length > 0
        ? phoneNumberRaw.trim()
        : null;

    if (!phoneNumber) {
      functions.logger.warn('onElephantAlert: missing phone number for user', {
        userId,
        alertId: snap.id,
      });
      return;
    }

    const message = `ERAS ALERT: An elephant has been detected at ${location}. Please take immediate action.`;

    try {
      await sendSmsPlaceholder(phoneNumber, message);
      functions.logger.info('onElephantAlert: SMS sent (placeholder)', {
        userId,
        phoneNumber,
        alertId: snap.id,
      });
    } catch (err) {
      functions.logger.error('onElephantAlert: failed to send SMS (placeholder)', {
        userId,
        phoneNumber,
        alertId: snap.id,
        error: (err as any)?.message ?? String(err),
      });
    }
  });

async function sendSmsPlaceholder(to: string, body: string) {
  functions.logger.info('SMS placeholder', { to, body });
}
