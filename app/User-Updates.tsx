import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db, storage } from "@/constants/firebase";

type UserUpdate = {
  id: string;
  text: string;
  displayName: string;
  createdAt: any;
  imageUrl: string | null;
};

export default function UserUpdatesScreen() {
  const router = useRouter();
  const [updateText, setUpdateText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [userUpdates, setUserUpdates] = useState<UserUpdate[]>([]);

  useEffect(() => {
    const updatesQuery = query(
      collection(db, "updates"),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(
      updatesQuery,
      (snapshot) => {
        const nextUpdates: UserUpdate[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            text: typeof data?.text === "string" ? data.text : "",
            displayName:
              typeof data?.displayName === "string" && data.displayName
                ? data.displayName
                : "Anonymous",
            createdAt: data?.createdAt,
            imageUrl: typeof data?.imageUrl === "string" ? data.imageUrl : null,
          };
        });
        setUserUpdates(nextUpdates);
      },
      (err) => {
        Alert.alert((err as any)?.message || "Failed to load updates.");
      },
    );
  }, []);

  function formatUpdateTime(createdAt: any) {
    const date: Date | null =
      createdAt && typeof createdAt?.toDate === "function"
        ? createdAt.toDate()
        : createdAt instanceof Date
          ? createdAt
          : null;

    if (!date) return "";
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function uploadUpdateImageFromUri(uri: string) {
    const user = auth.currentUser;
    if (!user?.uid) {
      router.replace("/signin");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `updates/${user.uid}/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const nextImageUrl = await getDownloadURL(imageRef);
      setImageUrl(nextImageUrl);
      Alert.alert("Image uploaded.");
    } catch (err: any) {
      Alert.alert(err?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function handlePickImageFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow gallery access to add an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return;
    const uri = result.assets[0]?.uri ?? null;
    if (!uri) return;

    await uploadUpdateImageFromUri(uri);
  }

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow camera access to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return;
    const uri = result.assets[0]?.uri ?? null;
    if (!uri) return;

    await uploadUpdateImageFromUri(uri);
  }

  async function handlePostUpdate() {
    const user = auth.currentUser;
    if (!user?.uid) {
      router.replace("/signin");
      return;
    }

    const text = updateText.trim();
    if (!text) {
      Alert.alert("Error", "Please enter a description.");
      return;
    }

    setPosting(true);
    try {
      const payload: Record<string, unknown> = {
        text,
        userId: user.uid,
        displayName:
          typeof user.displayName === "string" && user.displayName
            ? user.displayName
            : "Anonymous",
        createdAt: serverTimestamp(),
      };

      if (imageUrl) payload.imageUrl = imageUrl;

      await addDoc(collection(db, "updates"), payload);
      setUpdateText("");
      setImageUrl(null);
      Alert.alert("Success", "Elephant sighting posted!");
    } catch (err: any) {
      Alert.alert(err?.message || "Failed to post update.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={28} color="#2f6a39" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User updates</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <FlatList<UserUpdate>
          data={userUpdates}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.updatesListContent}
          ListHeaderComponent={
            <View style={styles.composer}>
              <Text style={styles.shareLabel}>Share an update</Text>

              <TextInput
                value={updateText}
                onChangeText={setUpdateText}
                style={styles.shareInput}
                multiline
                textAlignVertical="top"
                placeholder=""
              />

              <View style={styles.actionsBar}>
                <TouchableOpacity
                  style={styles.mediaButton}
                  activeOpacity={0.85}
                  onPress={handleTakePhoto}
                  disabled={uploading || posting}
                >
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                  <Text style={styles.mediaButtonText}>
                    {uploading ? "Uploading..." : "Camera"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.mediaButton}
                  activeOpacity={0.85}
                  onPress={handlePickImageFromGallery}
                  disabled={uploading || posting}
                >
                  <Ionicons name="image" size={18} color="#FFFFFF" />
                  <Text style={styles.mediaButtonText}>
                    {uploading ? "Uploading..." : "Gallery"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.postButton}
                  activeOpacity={0.85}
                  onPress={handlePostUpdate}
                  disabled={posting || uploading}
                >
                  <Text style={styles.postButtonText}>
                    {posting ? "Posting..." : "Post Update"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.updateCard}>
              <View style={styles.updateHeaderRow}>
                <Ionicons name="person-circle" size={34} color="#1f8a3b" />
                <View style={styles.updateHeaderTextWrap}>
                  <Text style={styles.updateName}>{item.displayName}</Text>
                  <Text style={styles.updateTime}>
                    {formatUpdateTime(item.createdAt)}
                  </Text>
                </View>
              </View>

              <Text style={styles.updateText}>{item.text}</Text>

              {item.imageUrl ? (
                <View style={styles.imageBadge}>
                  <Ionicons name="image" size={14} color="#2f6a39" />
                  <Text style={styles.imageBadgeText}>image</Text>
                </View>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.illustrationContainer}>
              <View style={styles.chatBubbleWrap}>
                <Ionicons
                  name="chatbubble"
                  size={150}
                  color="#86BDF6"
                  style={styles.chatBack}
                />
                <Ionicons
                  name="chatbubble"
                  size={170}
                  color="#B9DCFF"
                  style={styles.chatFront}
                />
              </View>
            </View>
          }
        />
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
  container: {
    flex: 1,
    backgroundColor: "#F5F6F7",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 22,
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
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "800",
    color: "#2f6a39",
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  body: {
    flex: 1,
    backgroundColor: "#F5F6F7",
    paddingBottom: 140,
  },
  composer: {
    paddingTop: 26,
    paddingBottom: 18,
  },
  shareLabel: {
    fontSize: 18,
    color: "#2f6a39",
    fontWeight: "800",
    marginBottom: 14,
  },
  shareInput: {
    minHeight: 150,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  mediaButton: {
    backgroundColor: "#95d57d",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  mediaButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  actionsBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  updatesListContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 220,
  },
  updateCard: {
    backgroundColor: "#95d57d",
    borderRadius: 20,
    marginVertical: 8,
    padding: 15,
  },
  updateHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  updateHeaderTextWrap: {
    flex: 1,
  },
  updateName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B1B0B",
  },
  updateTime: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: "#0B1B0B",
    opacity: 0.75,
  },
  updateText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#0B1B0B",
  },
  imageBadge: {
    marginTop: 12,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  imageBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2f6a39",
    textTransform: "uppercase",
  },
  postButton: {
    flex: 1,
    backgroundColor: "#95d57d",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 22,
    paddingBottom: 10,
  },
  chatBubbleWrap: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },
  chatBack: {
    position: "absolute",
    left: 18,
    top: 44,
    transform: [{ rotate: "-10deg" }],
  },
  chatFront: {
    position: "absolute",
    right: 12,
    top: 26,
    transform: [{ rotate: "8deg" }],
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
