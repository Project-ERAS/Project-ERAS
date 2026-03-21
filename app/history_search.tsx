import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "@/constants/firebase";

type LatestAlert = {
  id: string;
  location: string;
  createdAt: any;
};

export default function HistorySearchScreen() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [latestAlert, setLatestAlert] = useState<LatestAlert | null>(null);

  const latestAlertTime = useMemo(() => {
    if (!latestAlert?.createdAt) return "";
    const date: Date | null =
      latestAlert.createdAt &&
      typeof latestAlert.createdAt?.toDate === "function"
        ? latestAlert.createdAt.toDate()
        : latestAlert.createdAt instanceof Date
          ? latestAlert.createdAt
          : null;
    return date
      ? date.toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  }, [latestAlert?.createdAt]);

  useEffect(() => {
    const alertsQuery = query(
      collection(db, "alerts"),
      orderBy("createdAt", "desc"),
      limit(1),
    );

    return onSnapshot(
      alertsQuery,
      (snapshot) => {
        const docSnap = snapshot.docs[0];
        if (!docSnap) {
          setLatestAlert(null);
          return;
        }

        const data = docSnap.data() as any;
        const nextLocation =
          typeof data?.location === "string" && data.location.trim()
            ? data.location.trim()
            : typeof data?.locationName === "string" && data.locationName.trim()
              ? data.locationName.trim()
              : "Unknown location";

        setLatestAlert({
          id: docSnap.id,
          location: nextLocation,
          createdAt: data?.createdAt ?? null,
        });
      },
      () => {
        setLatestAlert(null);
      },
    );
  }, []);

  const handleEnter = () => {
    // Handle the search/enter action
    if (location.trim()) {
      console.log("Searching for location:", location);
      // Add your navigation or search logic here
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#2F3B2F" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <View
          style={[
            styles.latestAlertCard,
            latestAlert ? styles.latestAlertDanger : styles.latestAlertSafe,
          ]}
        >
          <View style={styles.latestAlertRow}>
            <Ionicons
              name={
                latestAlert ? "warning-outline" : "checkmark-circle-outline"
              }
              size={18}
              color={latestAlert ? "#B42318" : "#2f6a39"}
            />
            <Text
              style={[
                styles.latestAlertTitle,
                { color: latestAlert ? "#B42318" : "#2f6a39" },
              ]}
            >
              {latestAlert ? "Latest alert" : "Latest alert status"}
            </Text>
          </View>
          {latestAlert ? (
            <>
              <Text style={styles.latestAlertText}>
                ELEPHANT DETECTED NEAR RAILWAY
              </Text>
              <Text style={styles.latestAlertMeta}>
                Location: {latestAlert.location}
              </Text>
              {latestAlertTime ? (
                <Text style={styles.latestAlertMeta}>
                  Time: {latestAlertTime}
                </Text>
              ) : null}
            </>
          ) : (
            <Text style={styles.latestAlertText}>No recent alerts</Text>
          )}
        </View>

        <Text style={styles.label}>Enter location</Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#667085"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Search by location..."
            placeholderTextColor="#9AA3AF"
            returnKeyType="search"
            onSubmitEditing={handleEnter}
          />
        </View>

        <TouchableOpacity style={styles.enterButton} onPress={handleEnter}>
          <Text style={styles.enterButtonText}>Enter</Text>
        </TouchableOpacity>

        <View style={styles.illustrationContainer}>
          <Ionicons name="time-outline" size={180} color="#2F3B2F" />
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/about-us")}
        >
          <View style={styles.navIconCircle}>
            <Image
              source={require("@/assets/icons/about.png")}
              style={styles.bottomNavIconImage}
            />
          </View>
          <Text style={styles.navLabel}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/homepage")}
        >
          <View style={[styles.navIconCircle, styles.activeNavIcon]}>
            <Image
              source={require("@/assets/icons/homeicon.png")}
              style={styles.bottomNavIconImage}
            />
          </View>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/User-Profile")}
        >
          <View style={styles.navIconCircle}>
            <Image
              source={require("@/assets/icons/profile.png")}
              style={styles.profileNavIconImage}
            />
          </View>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F6F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 22,
    backgroundColor: "#F5F6F7",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#263526",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 170,
  },
  latestAlertCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
  },
  latestAlertDanger: {
    backgroundColor: "#FEF3F2",
    borderColor: "#FDA29B",
  },
  latestAlertSafe: {
    backgroundColor: "#F2F9F2",
    borderColor: "#A7D58A",
  },
  latestAlertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  latestAlertTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  latestAlertText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 18,
  },
  latestAlertMeta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#344054",
  },
  label: {
    fontSize: 14,
    color: "#2f6a39",
    marginBottom: 10,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  enterButton: {
    backgroundColor: "#95d57d",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  enterButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
    opacity: 0.35,
  },
  bottomNav: {
    position: "absolute",
    bottom: -6,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navButton: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  activeNavIcon: {
    backgroundColor: "#FFFFFF",
  },
  bottomNavIconImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  profileNavIconImage: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
  navLabel: {
    fontSize: 12,
    color: "#7A8A7A",
    fontWeight: "600",
  },
  activeNavLabel: {
    color: "#4A6A4A",
  },
});
