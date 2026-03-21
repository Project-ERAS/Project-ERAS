import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "@/constants/firebase";

type CameraLocation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  location: string;
};

type LatestAlert = {
  id: string;
  location: string;
  createdAt: any;
  latitude: number | null;
  longitude: number | null;
};

let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== "web") {
  try {
    const req = eval("require");
    const maps = req("react-native-maps");
    MapView = maps.default;
    Marker = maps.Marker;
  } catch {
    MapView = null;
    Marker = null;
  }
}

const CAMERA_LOCATIONS: CameraLocation[] = [
  {
    id: 1,
    name: "Camera 1",
    latitude: 6.9271,
    longitude: 80.7743,
    location: "Colombo",
  },
  {
    id: 2,
    name: "Camera 2",
    latitude: 7.2906,
    longitude: 80.6337,
    location: "Kandy",
  },
  {
    id: 3,
    name: "Camera 3",
    latitude: 6.0535,
    longitude: 80.2158,
    location: "Galle",
  },
  {
    id: 4,
    name: "Camera 4",
    latitude: 9.6615,
    longitude: 80.7851,
    location: "Jaffna",
  },
  {
    id: 5,
    name: "Camera 5",
    latitude: 7.2064,
    longitude: 79.8581,
    location: "Negombo",
  },
];

export default function LiveCameraFeedScreen() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [cameraNo, setCameraNo] = useState("");
  const [markers, setMarkers] = useState(CAMERA_LOCATIONS);
  const [hasSearched, setHasSearched] = useState(false);
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

        const latitude =
          typeof data?.latitude === "number"
            ? data.latitude
            : typeof data?.lat === "number"
              ? data.lat
              : null;
        const longitude =
          typeof data?.longitude === "number"
            ? data.longitude
            : typeof data?.lng === "number"
              ? data.lng
              : null;

        setLatestAlert({
          id: docSnap.id,
          location: nextLocation,
          createdAt: data?.createdAt ?? null,
          latitude,
          longitude,
        });
      },
      () => {
        setLatestAlert(null);
      },
    );
  }, []);

  const handleEnter = () => {
    setHasSearched(true);
    let filtered = CAMERA_LOCATIONS;

    const nextLocation = location.trim().toLowerCase();
    if (nextLocation) {
      filtered = filtered.filter((cam) =>
        cam.location.toLowerCase().includes(nextLocation),
      );
    }

    const nextCameraNo = cameraNo.trim();
    if (nextCameraNo) {
      const ids = nextCameraNo
        .split(/[,\s]+/g)
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => Number(t))
        .filter((n) => Number.isFinite(n));

      if (ids.length > 0) {
        filtered = filtered.filter((cam) => ids.includes(cam.id));
      }
    }

    setMarkers(filtered);
  };

  const handleReset = () => {
    setHasSearched(false);
    setLocation("");
    setCameraNo("");
    setMarkers(CAMERA_LOCATIONS);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.85}
          >
            <MaterialIcons name="arrow-back" size={24} color="#2f6a39" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live camera feed</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.inputCard}>
              <Text style={styles.label}>Enter location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Anuradhapura"
                placeholderTextColor="#7C867C"
                value={location}
                onChangeText={setLocation}
              />

              <Text style={[styles.label, styles.labelSpaced]}>
                Enter camera no.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 1, 2, 3"
                placeholderTextColor="#7C867C"
                value={cameraNo}
                onChangeText={setCameraNo}
                keyboardType="numeric"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.enterButton]}
                  onPress={handleEnter}
                  activeOpacity={0.85}
                >
                  <Text style={styles.enterButtonText}>Enter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.resetButton]}
                  onPress={handleReset}
                  activeOpacity={0.85}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.alertCard}>
              <View style={styles.alertTitleRow}>
                <MaterialIcons name="warning" size={24} color="#B42318" />
                <Text style={styles.alertTitle}>Latest elephant alert</Text>
              </View>

              {latestAlert ? (
                <>
                  <Text style={styles.alertHeadline}>
                    ELEPHANT DETECTED NEAR RAILWAY
                  </Text>
                  <Text style={styles.alertMeta}>
                    Location: {latestAlert.location}
                  </Text>
                  {latestAlertTime ? (
                    <Text style={styles.alertMeta}>
                      Time: {latestAlertTime}
                    </Text>
                  ) : null}

                  {MapView &&
                  Marker &&
                  typeof latestAlert.latitude === "number" &&
                  typeof latestAlert.longitude === "number" ? (
                    <View style={styles.mapWrap}>
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: latestAlert.latitude,
                          longitude: latestAlert.longitude,
                          latitudeDelta: 0.04,
                          longitudeDelta: 0.04,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: latestAlert.latitude,
                            longitude: latestAlert.longitude,
                          }}
                          title="Elephant detected"
                          description={latestAlert.location}
                        >
                          <View style={styles.elephantMarker}>
                            <Image
                              source={require("@/assets/images/elephant.png")}
                              style={styles.elephantMarkerImage}
                              resizeMode="contain"
                            />
                          </View>
                        </Marker>
                      </MapView>
                    </View>
                  ) : (
                    <Text style={styles.alertHint}>
                      Map preview unavailable (missing coordinates or
                      unsupported on this platform).
                    </Text>
                  )}
                </>
              ) : (
                <Text style={styles.alertHint}>No recent alerts</Text>
              )}
            </View>

            <View style={styles.listCard}>
              <View style={styles.listTitleWrap}>
                <MaterialIcons name="location-on" size={44} color="#2f6a39" />
                <Text style={styles.listTitle}>Camera Locations</Text>
              </View>

              {hasSearched && markers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Image
                    source={require("@/assets/images/search1.png")}
                    style={styles.emptyIllustration}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>No cameras found</Text>
                </View>
              ) : (
                <FlatList<CameraLocation>
                  data={markers}
                  keyExtractor={(item) => String(item.id)}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <View style={styles.cameraCard}>
                      <View style={styles.cameraHeader}>
                        <MaterialIcons
                          name="videocam"
                          size={22}
                          color="#2f6a39"
                        />
                        <Text style={styles.cameraName}>{item.name}</Text>
                      </View>
                      <Text style={styles.cameraLocation}>{item.location}</Text>
                      <Text style={styles.cameraCoords}>
                        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </Text>
                    </View>
                  )}
                />
              )}

              <View style={styles.cameraCount}>
                <Text style={styles.cameraCountText}>
                  Found {markers.length} camera{markers.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9F7",
  },
  keyboardAvoid: {
    flex: 1,
    paddingBottom: 140,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 18,
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
    fontSize: 18,
    fontWeight: "800",
    color: "#2f6a39",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 240,
  },
  content: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2f6a39",
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 16,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  input: {
    backgroundColor: "#F0F2F0",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
  },
  button: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  enterButton: {
    backgroundColor: "#95d57d",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  resetButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE3DD",
  },
  enterButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2f6a39",
  },
  alertCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#FDA29B",
  },
  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#B42318",
  },
  alertHeadline: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 18,
  },
  alertMeta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#344054",
  },
  alertHint: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  mapWrap: {
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  map: {
    width: "100%",
    height: 220,
  },
  elephantMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D63B3B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  elephantMarkerImage: {
    width: 28,
    height: 28,
    tintColor: "#FFFFFF",
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  listTitleWrap: {
    alignItems: "center",
    marginBottom: 14,
  },
  listTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "900",
    color: "#2f6a39",
  },
  listContent: {
    paddingBottom: 20,
  },
  cameraCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginVertical: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#2f6a39",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cameraName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  cameraLocation: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
  cameraCoords: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 26,
  },
  emptyImage: {
    width: 140,
    height: 140,
    opacity: 0.9,
  },
  emptyIllustration: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "800",
    color: "#6B7280",
  },
  cameraCount: {
    alignItems: "center",
    paddingTop: 6,
  },
  cameraCountText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
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
