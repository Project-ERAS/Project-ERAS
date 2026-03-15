import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
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
