import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db, storage } from "@/constants/firebase";
import { useThemeColor } from "@/hooks/use-theme-color";

type ProfileState = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  profilePicUrl?: string;
};

export default function UserProfileScreen() {
  const [profile, setProfile] = useState<ProfileState>({
    fullName: "",
    username: "",
    email: "",
    phone: "",
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isEditingRef = useRef(false);
  const handledPermissionErrorRef = useRef(false);

  const headerGreen = useThemeColor({}, "signupPrimaryButton");
  const webOutlineNone =
    Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null;

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  useEffect(() => {
    let firestoreUnsubscribe: null | (() => void) = null;

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
        firestoreUnsubscribe = null;
      }

      if (!user?.uid) {
        setProfile({
          fullName: "",
          username: "",
          email: "",
          phone: "",
        });
        setDraftProfile({
          fullName: "",
          username: "",
          email: "",
          phone: "",
        });
        router.replace("/signin");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      firestoreUnsubscribe = onSnapshot(
        userRef,
        (snapshot) => {
          const data = snapshot.data() as any;

          if (!snapshot.exists()) {
            void setDoc(
              userRef,
              {
                uid: user.uid,
                email: typeof user.email === "string" ? user.email : null,
                username:
                  typeof user.displayName === "string" ? user.displayName : "",
                displayName:
                  typeof user.displayName === "string" ? user.displayName : "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true },
            );
          }

          const nextProfile: ProfileState = {
            fullName:
              typeof data?.fullName === "string"
                ? data.fullName
                : typeof data?.displayName === "string"
                  ? data.displayName
                  : typeof user.displayName === "string"
                    ? user.displayName
                    : "",
            username:
              typeof data?.username === "string"
                ? data.username
                : typeof user.displayName === "string"
                  ? user.displayName
                  : "",
            email: typeof user.email === "string" ? user.email : "",
            phone: typeof data?.phone === "string" ? data.phone : "",
            profilePicUrl:
              typeof data?.profilePicUrl === "string" ? data.profilePicUrl : "",
          };

          setProfile(nextProfile);
          setDraftProfile((prev) =>
            isEditingRef.current ? prev : nextProfile,
          );
        },
        (err) => {
          const code =
            typeof (err as any)?.code === "string" ? (err as any).code : "";
          if (code === "permission-denied") {
            if (handledPermissionErrorRef.current) return;
            handledPermissionErrorRef.current = true;

            const usingEmulators =
              typeof __DEV__ !== "undefined" &&
              __DEV__ &&
              typeof process !== "undefined" &&
              typeof process.env !== "undefined" &&
              (process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS ?? "0") === "1";

            Alert.alert(
              "Missing or insufficient permissions.",
              usingEmulators
                ? "Your login session may be from a different backend (emulators vs production). Please sign in again."
                : "Your Firestore rules may be blocking access. Please sign in again.",
            );

            void (async () => {
              try {
                await signOut(auth);
              } finally {
                router.replace("/signin");
              }
            })();
            return;
          }

          Alert.alert((err as any)?.message || "Failed to load profile.");
        },
      );
    });

    return () => {
      if (firestoreUnsubscribe) firestoreUnsubscribe();
      authUnsubscribe();
    };
  }, []);

  function handleEditPress() {
    if (!isEditing) {
      setDraftProfile(profile);
      setIsEditing(true);
      return;
    }

    void handleSavePress();
  }

  async function handleSavePress() {
    const user = auth.currentUser;
    if (!user?.uid) {
      router.replace("/signin");
      return;
    }

    const fullName = draftProfile.fullName.trim();
    const phone = draftProfile.phone.trim();

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        phone,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
      Alert.alert("Profile updated successfully.");
    } catch (err: any) {
      Alert.alert(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoutPress() {
    try {
      await signOut(auth);
    } finally {
      router.replace("/signin");
    }
  }

  async function handlePickProfileImage() {
    const user = auth.currentUser;
    if (!user?.uid) {
      router.replace("/signin");
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Allow gallery access to upload a photo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
        base64: true,
      });
      if (result.canceled) return;

      const asset = result.assets?.[0];
      const base64 = asset?.base64;
      if (!base64) {
        Alert.alert("Failed to read image. Try another image.");
        return;
      }

      setUploading(true);
      const path = `users/${user.uid}/profile_pic.jpg`;
      const storageRef = ref(storage, path);
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      await uploadString(storageRef, dataUrl, "data_url");
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "users", user.uid), {
        profilePicUrl: url,
        updatedAt: serverTimestamp(),
      });
      setProfile((prev) => ({ ...prev, profilePicUrl: url }));
      Alert.alert("Profile photo updated.");
    } catch (err: any) {
      Alert.alert(err?.message || "Failed to upload profile photo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.headerSection}>
        <Pressable
          accessibilityRole="button"
          onPress={handlePickProfileImage}
          disabled={uploading}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <View style={styles.avatarCircle}>
            {profile.profilePicUrl ? (
              <Image
                source={{ uri: profile.profilePicUrl }}
                style={{ width: 140, height: 140, borderRadius: 70 }}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={72} color="#2f6a39" />
            )}
          </View>
        </Pressable>

        <Text style={styles.usernameText}>
          {profile.username ? `@${profile.username}` : ""}
        </Text>
        <Text style={styles.nameText}>{profile.fullName}</Text>
      </View>

      <ScrollView
        style={styles.contentSection}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full name</Text>
          {isEditing ? (
            <TextInput
              value={draftProfile.fullName}
              onChangeText={(value) =>
                setDraftProfile((prev) => ({ ...prev, fullName: value }))
              }
              style={[styles.inputCard, styles.inputEditable, webOutlineNone]}
              placeholder="Enter full name"
              placeholderTextColor="#707070"
              selectionColor={headerGreen}
            />
          ) : (
            <View style={[styles.inputCard]}>
              <Text style={styles.inputText}>{profile.fullName}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputCard, styles.inputCardReadOnly]}>
            <Text style={styles.inputText}>{profile.email}</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone number</Text>
          {isEditing ? (
            <TextInput
              value={draftProfile.phone}
              onChangeText={(value) =>
                setDraftProfile((prev) => ({ ...prev, phone: value }))
              }
              style={[styles.inputCard, styles.inputEditable, webOutlineNone]}
              placeholder="Enter phone number"
              placeholderTextColor="#707070"
              selectionColor={headerGreen}
              keyboardType="phone-pad"
            />
          ) : (
            <View style={[styles.inputCard]}>
              <Text style={styles.inputText}>{profile.phone}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            accessibilityRole="button"
            onPress={handleEditPress}
            disabled={saving}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: "#95d57d",
                opacity: saving ? 0.7 : pressed ? 0.86 : 1,
              },
            ]}
          >
            <Feather
              name={isEditing ? "check" : "edit-2"}
              size={23}
              color="#FFFFFF"
            />
            <Text style={[styles.actionText, { color: "#FFFFFF" }]}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleLogoutPress}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: "#95d57d",
                opacity: pressed ? 0.86 : 1,
              },
            ]}
          >
            <Feather name="log-out" size={23} color="#FFFFFF" />
            <Text style={[styles.actionText, { color: "#FFFFFF" }]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable
          accessibilityRole="button"
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
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.navButton}
          onPress={() => router.push("/homepage")}
        >
          <View style={styles.navIconCircle}>
            <Image
              source={require("@/assets/icons/homeicon.png")}
              style={styles.bottomNavIconImage}
            />
          </View>
          <Text style={styles.navLabel}>Home</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.navButton}
          onPress={() => router.push("/User-Profile")}
        >
          <View style={[styles.navIconCircle, styles.activeNavIcon]}>
            <Image
              source={require("@/assets/icons/profile.png")}
              style={styles.profileNavIconImage}
            />
          </View>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2EE",
  },
  avatarCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EEE8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  usernameText: {
    color: "#7A8A7A",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  nameText: {
    color: "#2D3E2D",
    marginTop: 6,
    fontSize: 24,
    fontWeight: "800",
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 140,
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
    color: "#2D3E2D",
    opacity: 0.9,
  },
  inputCard: {
    minHeight: 54,
    borderRadius: 18,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EEE8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  inputCardReadOnly: {
    backgroundColor: "#F8FAF9",
  },
  inputText: {
    color: "#2D3E2D",
    fontSize: 16,
    fontWeight: "500",
  },
  inputEditable: {
    color: "#2D3E2D",
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#8BCB82",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "800",
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
    borderTopWidth: 1,
    borderTopColor: "#EEF2EE",
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
    backgroundColor: "#F8FAF9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  activeNavIcon: {
    backgroundColor: "#EFF6EF",
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
    color: "#2D3E2D",
  },
});
