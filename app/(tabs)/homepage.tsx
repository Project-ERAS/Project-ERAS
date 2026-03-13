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
          source={require("@/assets/images/elephant-home.jpg")}
          style={styles.heroSection}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <SafeAreaView edges={["top"]}>
              <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>ERAS</Text>
                </View>
                <TouchableOpacity 
                  style={styles.authButton}
                  onPress={() => router.push("/signin")}
                >
                  <Text style={styles.authIcon}>👤</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.welcomeText}>Welcome to <b>E.R.A.S</b></Text>
                <Text style={styles.mainTitle}>Elephant Railway</Text>
                <Text style={styles.mainTitle}>Alert System</Text>
                <Text style={styles.subtitleText}>
                  Real-time monitoring for safer railways
                </Text>
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchIconWrapper}>
              <Image
                source={require("@/assets/icons/search.png")}
                style={styles.searchIconImage}
              />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search features"
              placeholderTextColor="#1e1e1e"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Quick Actions Title */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          {/* Navigation Cards Grid */}
          <View style={styles.cardsGrid}>
            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push("/live-alert")}
            >
              <View style={[styles.iconContainer, { backgroundColor: "#FFE5E5" }]}>
                <Text style={styles.navIcon}>⚠️</Text>
              </View>
              <Text style={styles.navText}>Live Alert</Text>
              <Text style={styles.navSubtext}>Active monitoring</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navCard}>
              <View style={[styles.iconContainer, { backgroundColor: "#E5F0FF" }]}>
                <Text style={styles.navIcon}>🕒</Text>
              </View>
              <Text style={styles.navText}>History</Text>
              <Text style={styles.navSubtext}>Past incidents</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push("/Live-Camera-Feed")}
            >
              <View style={[styles.iconContainer, { backgroundColor: "#F0E5FF" }]}>
                <Text style={styles.navIcon}>📹</Text>
              </View>
              <Text style={styles.navText}>Live Feed</Text>
              <Text style={styles.navSubtext}>Camera streams</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push("/User-Updates")}
            >
              <View style={[styles.iconContainer, { backgroundColor: "#FFF5E5" }]}>
                <Image
                  source={require("@/assets/images/mobile.png")}
                  style={styles.navIconImage}
                />
              </View>
              <Text style={styles.navText}>Updates</Text>
              <Text style={styles.navSubtext}>Latest news</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
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
          onPress={() => router.push("/(tabs)/homepage")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 350,
    width: "100%",
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  authButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  authIcon: {
    fontSize: 20,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 42,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 12,
    fontWeight: "400",
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#F8FAF9",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E8EEE8",
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  searchIconImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2D3E2D",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3E2D",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  navCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F0F4F0",
    minHeight: 160,
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  navIcon: {
    fontSize: 32,
  },
  navIconImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  navText: {
    fontSize: 16,
    color: "#2D3E2D",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  navSubtext: {
    fontSize: 12,
    color: "#7A8A7A",
    fontWeight: "500",
    textAlign: "center",
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
    color: "#4A6A4A",
  },
});
