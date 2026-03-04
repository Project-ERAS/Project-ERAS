import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Main Home Screen Component ---
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Section */}
        <ImageBackground
          source={require("@/assets/images/MenuImage.png")}
          style={styles.heroSection}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleLine}>
                <Text style={styles.titleYellow}>E</Text>
                <Text style={styles.titleWhite}>lephant</Text>
              </Text>
              <Text style={styles.titleLine}>
                <Text style={styles.titleYellow}>R</Text>
                <Text style={styles.titleWhite}>ailway</Text>
              </Text>
              <Text style={styles.titleLine}>
                <Text style={styles.titleYellow}>A</Text>
                <Text style={styles.titleWhite}>lert</Text>
              </Text>
              <Text style={styles.titleLine}>
                <Text style={styles.titleYellow}>S</Text>
                <Text style={styles.titleWhite}>ystem</Text>
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Content Section */}
        <SafeAreaView edges={["bottom"]} style={styles.contentSection}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Navigation Cards */}
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push("/live-alert")}
          >
            <Text style={styles.navIcon}>⚠️</Text>
            <Text style={styles.navText}>Live Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard}>
            <Text style={styles.navIcon}>🕒</Text>
            <Text style={styles.navText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push("/Live-Camera-Feed")}
          >
            <Text style={styles.navIcon}>📹</Text>
            <Text style={styles.navText}>Live camera feed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push("/User-Updates")}
          >
            <Image
              source={require("@/assets/images/mobile.png")}
              style={styles.navIconImage}
            />
            <Text style={styles.navText}>User updates</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <View style={styles.navIconCircle}>
            <Text style={styles.bottomNavIcon}>ℹ️</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/(tabs)/homepage")}
        >
          <View style={styles.navIconCircle}>
            <Text style={styles.bottomNavIcon}>🏠</Text>
          </View>
          <View style={styles.activeIndicator} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/User-Profile")}
        >
          <View style={styles.navIconCircle}>
            <Text style={styles.bottomNavIcon}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c8dbb3",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    width: "100%",
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    paddingLeft: 45,
  },
  titleContainer: {
    marginTop: -10,
  },
  titleLine: {
    flexDirection: "row",
    marginBottom: -10,
  },
  titleYellow: {
    fontSize: 48,
    fontWeight: "900",
    color: "#ffeb3b",
    letterSpacing: -2,
  },
  titleWhite: {
    fontSize: 48,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -2,
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#c8dbb3",
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2d2d2d",
  },
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  navIcon: {
    fontSize: 28,
    marginRight: 20,
  },
  navIconImage: {
    width: 28,
    height: 28,
    marginRight: 20,
    resizeMode: "contain",
  },
  navText: {
    fontSize: 18,
    color: "#5a5a5a",
    fontWeight: "500",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#c8dbb3",
    paddingVertical: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  navButton: {
    alignItems: "center",
    position: "relative",
  },
  navIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavIcon: {
    fontSize: 24,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
    position: "absolute",
    bottom: -12,
  },
});
