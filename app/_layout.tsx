import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";

import { auth, db } from "@/constants/firebase";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

type ElephantAlert = {
  id: string;
  location: string;
  createdAt: any;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeAlert, setActiveAlert] = useState<ElephantAlert | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const lastAlertIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  const formattedTime = useMemo(() => {
    if (!activeAlert?.createdAt) return "";
    const date: Date | null =
      activeAlert.createdAt && typeof activeAlert.createdAt?.toDate === "function"
        ? activeAlert.createdAt.toDate()
        : activeAlert.createdAt instanceof Date
          ? activeAlert.createdAt
          : null;
    return date
      ? date.toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  }, [activeAlert?.createdAt]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    const route = segments[0] ?? "";
    const inAuthFlow =
      route === "signin" ||
      route === "signup" ||
      route === "verify-email" ||
      route === "splash";

    if (!currentUser && !inAuthFlow) {
      router.replace("/signin");
      return;
    }

    if (currentUser && (route === "signin" || route === "signup")) {
      router.replace("/(tabs)/homepage");
    }
  }, [authChecked, currentUser, router, segments]);

  useEffect(() => {
    const alertsQuery = query(
      collection(db, "alerts"),
      orderBy("createdAt", "desc"),
      limit(1),
    );

    return onSnapshot(
      alertsQuery,
      async (snapshot) => {
        const docSnap = snapshot.docs[0];
        if (!docSnap) return;

        const nextId = docSnap.id;
        if (!initializedRef.current) {
          initializedRef.current = true;
          lastAlertIdRef.current = nextId;
          return;
        }

        if (lastAlertIdRef.current === nextId) return;
        lastAlertIdRef.current = nextId;

        const data = docSnap.data() as any;
        const location =
          typeof data?.location === "string" && data.location.trim()
            ? data.location.trim()
            : typeof data?.locationName === "string" && data.locationName.trim()
              ? data.locationName.trim()
              : "Unknown location";

        setActiveAlert({
          id: nextId,
          location,
          createdAt: data?.createdAt ?? null,
        });
        setShowAlertModal(true);

        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch {
          // ignore
        }

        try {
          Speech.stop();
          Speech.speak("Elephant detected near railway. Please take immediate action.", {
            rate: 0.95,
            pitch: 1.0,
          });
        } catch {
          // ignore
        }
      },
      () => {
        // ignore listener errors for global UI
      },
    );
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={styles.root}>
        <Stack>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="verify-email" options={{ headerShown: false }} />
          <Stack.Screen name="User-Updates" options={{ headerShown: false }} />
          <Stack.Screen name="Live-Camera-Feed" options={{ headerShown: false }} />
          <Stack.Screen name="live-alert" options={{ headerShown: false }} />
          <Stack.Screen name="live-alert/otp" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>

        <Modal
          transparent
          visible={showAlertModal}
          animationType="fade"
          onRequestClose={() => setShowAlertModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                ⚠️ ELEPHANT DETECTED NEAR RAILWAY
              </Text>
              <Text style={styles.modalMeta}>Location: {activeAlert?.location}</Text>
              {formattedTime ? (
                <Text style={styles.modalMeta}>Time: {formattedTime}</Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.dismissButton,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
                onPress={() => setShowAlertModal(false)}
              >
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: "#D63B3B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#8A1A1A",
    lineHeight: 24,
  },
  modalMeta: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  dismissButton: {
    marginTop: 16,
    backgroundColor: "#D63B3B",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  dismissButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
