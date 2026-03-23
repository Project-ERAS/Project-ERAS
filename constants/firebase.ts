import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, initializeAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { Platform } from "react-native";

export const firebaseConfig = {
  apiKey: "AIzaSyBqdQlv4tY3L1npqYqXsYQHhLzf9O-8ink",
  authDomain: "eras-cfa09.firebaseapp.com",
  projectId: "eras-cfa09",
  storageBucket: "eras-cfa09.firebasestorage.app",
  messagingSenderId: "318087849877",
  appId: "1:318087849877:web:49a4b74765c976081d789c",
  measurementId: "G-JNLJNVLBCJ",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Some libraries (e.g. expo-firebase-recaptcha) still read the compat default app.
// Keep compat and modular app initialization in sync.
try {
  const compatModule = require("firebase/compat/app");
  const compatFirebase = (compatModule?.default ?? compatModule) as any;
  if (compatFirebase?.apps?.length === 0) {
    compatFirebase.initializeApp(firebaseConfig);
  }
} catch {
  // Compat package may be unavailable in some environments.
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

if (
  typeof firebaseConfig.projectId === "string" &&
  typeof firebaseConfig.authDomain === "string"
) {
  const expectedAuthDomain = `${firebaseConfig.projectId}.firebaseapp.com`;
  if (firebaseConfig.authDomain.trim() !== expectedAuthDomain) {
    console.warn(
      `Firebase authDomain mismatch. Expected "${expectedAuthDomain}", got "${firebaseConfig.authDomain}".`,
    );
  }
}

export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : (() => {
        try {
          const persistence = getReactNativePersistence(AsyncStorage);
          const rnAuth = require("@firebase/auth/dist/rn/index.js") as any;
          const persistence = rnAuth?.getReactNativePersistence
            ? rnAuth.getReactNativePersistence(AsyncStorage)
            : undefined;
          return initializeAuth(app, {
            persistence,
          });
        } catch {
          return getAuth(app);
        }
      })();
export const db = getFirestore(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

let emulatorsConnected = false;

const shouldUseEmulators =
  typeof __DEV__ !== "undefined" &&
  __DEV__ &&
  typeof process !== "undefined" &&
  typeof process.env !== "undefined" &&
  (process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS ?? "0") === "1";

if (shouldUseEmulators && !emulatorsConnected) {
  const hostFromEnv =
    typeof process !== "undefined" &&
    typeof process.env !== "undefined" &&
    typeof process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST === "string"
      ? process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST
      : null;

  const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
  const host = hostFromEnv ?? defaultHost;

  const authPortRaw =
    typeof process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT === "string"
      ? process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT
      : null;
  const firestorePortRaw =
    typeof process.env.EXPO_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT === "string"
      ? process.env.EXPO_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT
      : null;

  const authPort = authPortRaw ? Number(authPortRaw) : 9098;
  const firestorePort = firestorePortRaw ? Number(firestorePortRaw) : 8088;
  const storagePortRaw =
    typeof process.env.EXPO_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT === "string"
      ? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT
      : null;
  const storagePort = storagePortRaw ? Number(storagePortRaw) : 9198;

  connectAuthEmulator(auth, `http://${host}:${authPort}`, {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, host, firestorePort);
  emulatorsConnected = true;
}
  connectStorageEmulator(storage, host, storagePort);
  emulatorsConnected = true;
}

export type EmergencyAlert = {
  id: string;
  location: string;
  createdAt: any;
  latitude: number | null;
  longitude: number | null;
  cameraId: number | null;
  status: string | null;
};

export type EmergencyState = {
  active: boolean;
  alert: EmergencyAlert | null;
};

let emergencyState: EmergencyState = { active: false, alert: null };
const emergencyListeners = new Set<(state: EmergencyState) => void>();

export function getEmergencyState() {
  return emergencyState;
}

export function setEmergencyState(next: EmergencyState) {
  emergencyState = next;
  emergencyListeners.forEach((listener) => listener(emergencyState));
}

export function subscribeEmergencyState(listener: (state: EmergencyState) => void) {
  emergencyListeners.add(listener);
  listener(emergencyState);
  return () => {
    emergencyListeners.delete(listener);
  };
}
