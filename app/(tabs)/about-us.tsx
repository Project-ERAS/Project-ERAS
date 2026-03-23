import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";

export default function AboutUsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Image
            source={require("@/assets/icons/icon.png")}
            style={styles.elephantImage}
            resizeMode="contain"
          />
          <ThemedText style={styles.title}>About E.R.A.S</ThemedText>
        </View>

        <View style={styles.missionCard}>
          <ThemedText style={styles.missionHeading}>Our Mission</ThemedText>
          <ThemedText style={styles.missionText}>
            E.R.A.S is dedicated to protecting elephants and reducing
            human-wildlife conflicts through innovative technology and community
            engagement. By providing real-time tracking data and early warning
            systems, we empower conservation efforts and promote coexistence
            between humans and elephants.
          </ThemedText>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/about-us")}
        >
          <View style={[styles.navIconCircle, styles.activeNavIcon]}>
            <Image
              source={require("@/assets/icons/about.png")}
              style={[styles.bottomNavIconImage, styles.navIconActive]}
            />
          </View>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/homepage")}
        >
          <View style={styles.navIconCircle}>
            <Image
              source={require("@/assets/icons/homeicon.png")}
              style={[styles.bottomNavIconImage, styles.navIconInactive]}
            />
          </View>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/User-Profile")}
        >
          <View style={styles.navIconCircle}>
            <Image
              source={require("@/assets/icons/profile.png")}
              style={[styles.profileNavIconImage, styles.navIconInactive]}
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
    backgroundColor: "#FFF",
  },
  container: { flex: 1, backgroundColor: "#FFF" },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 170,
  },
  topSection: {
    backgroundColor: "#EAF6EA",
    borderRadius: 22,
    minHeight: 80,
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 18,
  },
  elephantImage: {
    width: 210,
    height: 210,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2F6A39",
    letterSpacing: 0.2,
  },
  missionHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2F6A39",
    marginBottom: 12,
  },
  missionText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#374151",
    fontWeight: "500",
  },
  missionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  spacer: {
    height: 40,
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
  bottomNavIcon: {
    fontSize: 24,
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
    color: "#000000",
  },
  navIconActive: {
    tintColor: "#000000",
  },
  navIconInactive: {
    tintColor: "#7A8A7A",
  },
});
