import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBqdQlv4tY3L1npqYqXsYQHhLzf9O-8ink",
  authDomain: "eras-cfa09.firebaseapp.com",
  projectId: "eras-cfa09",
  storageBucket: "eras-cfa09.firebasestorage.app",
  messagingSenderId: "318087849877",
  appId: "1:318087849877:web:49a4b74765c976081d789c",
  measurementId: "G-JNLJNVLBCJ",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : (() => {
        try {
          const persistence = getReactNativePersistence(AsyncStorage);
          return initializeAuth(app, {
            persistence,
          });
        } catch {
          return getAuth(app);
        }
      })();
export const db = getFirestore(app);
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

  connectAuthEmulator(auth, `http://${host}:${authPort}`, {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, host, firestorePort);
  emulatorsConnected = true;
}
