import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export default function UserProfileScreen() {
  const [profile, setProfile] = useState({
    fullName: "Methuka Pathirana",
    email: "methuka108@gmail.com",
    phone: "+94 72 xxx xxxx",
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const headerGreen = useThemeColor({}, "signupPrimaryButton");
  const backgroundGreen = useThemeColor({}, "signupBackground");
  const fieldBackground = useThemeColor({}, "signupInputBackground");
  const buttonText = useThemeColor({}, "signupButtonText");
  const shadowColor = useThemeColor({}, "signupShadow");
  const webOutlineNone =
    Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null;

  function handleEditPress() {
    if (!isEditing) {
      setDraftProfile(profile);
      setIsEditing(true);
      return;
    }

    setProfile(draftProfile);
    setIsEditing(false);
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: backgroundGreen }]}
    >
      <View style={[styles.headerSection, { backgroundColor: headerGreen }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={32} color="#FFFFFF" />
        </Pressable>

        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: "#67C23A", shadowColor },
          ]}
        >
          <Ionicons name="person" size={72} color="#F3F3F3" />
        </View>

        <Text style={styles.nameText}>{profile.fullName}</Text>
      </View>

      <ScrollView
        style={styles.contentSection}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: headerGreen }]}>Full name</Text>
          {isEditing ? (
            <TextInput
              value={draftProfile.fullName}
              onChangeText={(value) =>
                setDraftProfile((prev) => ({ ...prev, fullName: value }))
              }
              style={[
                styles.inputCard,
                styles.inputEditable,
                webOutlineNone,
                { backgroundColor: fieldBackground, shadowColor },
              ]}
              placeholder="Enter full name"
              placeholderTextColor="#707070"
              selectionColor={headerGreen}
            />
          ) : (
            <View
              style={[
                styles.inputCard,
                { backgroundColor: fieldBackground, shadowColor },
              ]}
            >
              <Text style={styles.inputText}>{profile.fullName}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: headerGreen }]}>Email</Text>
          {isEditing ? (
            <TextInput
              value={draftProfile.email}
              onChangeText={(value) =>
                setDraftProfile((prev) => ({ ...prev, email: value }))
              }
              style={[
                styles.inputCard,
                styles.inputEditable,
                webOutlineNone,
                { backgroundColor: fieldBackground, shadowColor },
              ]}
              placeholder="Enter email"
              placeholderTextColor="#707070"
              selectionColor={headerGreen}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          ) : (
            <View
              style={[
                styles.inputCard,
                { backgroundColor: fieldBackground, shadowColor },
              ]}
            >
              <Text style={styles.inputText}>{profile.email}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: headerGreen }]}>
            Phone number
          </Text>
          {isEditing ? (
            <TextInput
              value={draftProfile.phone}
              onChangeText={(value) =>
                setDraftProfile((prev) => ({ ...prev, phone: value }))
              }
              style={[
                styles.inputCard,
                styles.inputEditable,
                webOutlineNone,
                { backgroundColor: fieldBackground, shadowColor },
              ]}
              placeholder="Enter phone number"
              placeholderTextColor="#707070"
              selectionColor={headerGreen}
              keyboardType="phone-pad"
            />
          ) : (
            <View
              style={[
                styles.inputCard,
                { backgroundColor: fieldBackground, shadowColor },
              ]}
            >
              <Text style={styles.inputText}>{profile.phone}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            accessibilityRole="button"
            onPress={handleEditPress}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: headerGreen,
                shadowColor,
                opacity: pressed ? 0.86 : 1,
              },
            ]}
          >
            <Feather
              name={isEditing ? "check" : "edit-2"}
              size={23}
              color={buttonText}
            />
            <Text style={[styles.actionText, { color: buttonText }]}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => console.log("Logout")}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: headerGreen,
                shadowColor,
                opacity: pressed ? 0.86 : 1,
              },
            ]}
          >
            <Feather name="log-out" size={23} color={buttonText} />
            <Text style={[styles.actionText, { color: buttonText }]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 52,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  nameText: {
    color: "#FFFFFF",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "400",
  },
  contentSection: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: 48,
    paddingBottom: 44,
    gap: 24,
  },
  fieldGroup: { gap: 10 },
  label: { fontSize: 16, fontWeight: "500", marginLeft: 8 },
  inputCard: {
    minHeight: 48,
    borderRadius: 18,
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  inputText: { color: "#121212", fontSize: 16, fontWeight: "400" },
  inputEditable: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "400",
    paddingVertical: 12,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 18,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minWidth: 118,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionText: { fontSize: 16, fontWeight: "500" },
});
