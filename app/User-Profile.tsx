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

export default function UserProfileScreen() {
  const [profile, setProfile] = useState({
    fullName: "Methuka Pathirana",
    email: "methuka108@gmail.com",
    phone: "+94 72 xxx xxxx",
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const backgroundColor = "#F8FAF9";
  const surfaceColor = "#FFFFFF";
  const borderColor = "#E8EEE8";
  const textPrimary = "#2D3E2D";
  const accentGreen = "#93cc72";
  const accentGreenPressed = "#4c9c3e";
  const cardShadowColor = "#000";
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View
        style={[
          styles.headerSection,
          { backgroundColor: surfaceColor, borderBottomColor: borderColor },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            {
              opacity: pressed ? 0.8 : 1,
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={28} color={textPrimary} />
        </Pressable>

        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: accentGreen, shadowColor: cardShadowColor },
          ]}
        >
          <Ionicons name="person" size={64} color="#FFFFFF" />
        </View>

        <Text style={[styles.nameText, { color: textPrimary }]}>
          {profile.fullName}
        </Text>
      </View>

      <ScrollView
        style={[styles.contentSection, { backgroundColor }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: textPrimary }]}>Full name</Text>
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
                {
                  backgroundColor: surfaceColor,
                  shadowColor: cardShadowColor,
                  borderColor,
                },
              ]}
              placeholder="Enter full name"
              placeholderTextColor="#707070"
              selectionColor={accentGreen}
            />
          ) : (
            <View
              style={[
                styles.inputCard,
                {
                  backgroundColor: surfaceColor,
                  shadowColor: cardShadowColor,
                  borderColor,
                },
              ]}
            >
              <Text style={styles.inputText}>{profile.fullName}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: textPrimary }]}>Email</Text>
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
                {
                  backgroundColor: surfaceColor,
                  shadowColor: cardShadowColor,
                  borderColor,
                },
              ]}
              placeholder="Enter email"
              placeholderTextColor="#707070"
              selectionColor={accentGreen}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          ) : (
            <View
              style={[
                styles.inputCard,
                {
                  backgroundColor: surfaceColor,
                  shadowColor: cardShadowColor,
                  borderColor,
                },
              ]}
            >
              <Text style={styles.inputText}>{profile.email}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: textPrimary }]}>Phone number</Text>
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
                {
                  backgroundColor: surfaceColor,
                  shadowColor: cardShadowColor,
                  borderColor,
                },
              ]}
              placeholder="Enter phone number"
              placeholderTextColor="#707070"
              selectionColor={accentGreen}
              keyboardType="phone-pad"
            />
          ) : (
            <View
              style={[
                styles.inputCard,
                {
                  backgroundColor: surfaceColor,
                  shadowColor: cardShadowColor,
                  borderColor,
                },
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
                backgroundColor: pressed ? accentGreenPressed : accentGreen,
                shadowColor: cardShadowColor,
                opacity: pressed ? 0.86 : 1,
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
            onPress={() => console.log("Logout")}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: pressed ? accentGreenPressed : accentGreen,
                shadowColor: cardShadowColor,
                opacity: pressed ? 0.86 : 1,
              },
            ]}
          >
            <Feather name="log-out" size={23} color="#FFFFFF" />
            <Text style={[styles.actionText, { color: "#FFFFFF" }]}>Logout</Text>
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
    paddingTop: 14,
    paddingBottom: 18,
    borderBottomWidth: 1,
  },
  backButton: {
    position: "absolute",
    left: 18,
    top: 10,
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 56,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  nameText: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "800",
  },
  contentSection: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 44,
    gap: 24,
  },
  fieldGroup: { gap: 10 },
  label: { fontSize: 14, fontWeight: "800", marginLeft: 8 },
  inputCard: {
    minHeight: 48,
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  inputText: { color: "#2D3E2D", fontSize: 16, fontWeight: "600" },
  inputEditable: {
    color: "#2D3E2D",
    fontSize: 16,
    fontWeight: "600",
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
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  actionText: { fontSize: 16, fontWeight: "500" },
});
