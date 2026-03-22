import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
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

type RouterPushArg = Parameters<ReturnType<typeof useRouter>["push"]>[0];

type QuickActionBase = {
  title: string;
  subtitle: string;
  route: RouterPushArg;
  iconBackgroundColor: string;
  keywords?: string[];
};

type QuickAction =
  | (QuickActionBase & {
      type: "emoji";
      icon: string;
    })
  | (QuickActionBase & {
      type: "image";
      icon: ImageSourcePropType;
      iconTintColor?: string;
    });

// --- Main Home Screen Component ---
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const quickActions = useMemo<QuickAction[]>(() => {
    return [
      {
        title: "Live Alert",
        subtitle: "Active monitoring",
        route: "/live-alert",
        iconBackgroundColor: "#FFFFFF",
        type: "image",
        icon: require("@/assets/icons/live alert.jpeg"),
        keywords: ["alert", "live", "monitor", "monitoring", "warning", "otp"],
      },
      {
        title: "History",
        subtitle: "Past incidents",
        route: "/history_search",
        iconBackgroundColor: "#FFFFFF",
        type: "image",
        icon: require("@/assets/icons/history.jpeg"),
        keywords: ["history", "past", "incidents", "search"],
      },
      {
        title: "Live Feed",
        subtitle: "Camera streams",
        route: "/Live-Camera-Feed",
        iconBackgroundColor: "#FFFFFF",
        type: "image",
        icon: require("@/assets/icons/livefeed.jpeg"),
        keywords: ["camera", "live", "feed", "stream", "streams"],
      },
      {
        title: "User Updates",
        subtitle: "User-submitted information",
        route: "/User-Updates",
        iconBackgroundColor: "#FFFFFF",
        type: "image",
        icon: require("@/assets/icons/User Updates.jpg"),
        keywords: ["updates", "news", "latest"],
      },
    ];
  }, []);

  const filteredQuickActions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return quickActions;

    const tokens = query.split(/\s+/).filter(Boolean);

    return quickActions.filter((action) => {
      const haystack = [
        action.title,
        action.subtitle,
        ...(action.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return tokens.every((token) => haystack.includes(token));
    });
  }, [quickActions, searchQuery]);

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
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.welcomeText}>
                  Welcome to <Text style={styles.welcomeTextStrong}>E.R.A.S</Text>
                </Text>
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
              placeholder="Search features..."
              placeholderTextColor="#1e1e1e"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Quick Actions Title */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          {/* Navigation Cards Grid */}
          {filteredQuickActions.length === 0 ? (
            <Text style={styles.noResultsText}>No results found</Text>
          ) : (
            <View style={styles.cardsGrid}>
              {filteredQuickActions.map((action) => {
                return (
                  <TouchableOpacity
                    key={action.title}
                    style={styles.navCard}
                    onPress={() => router.push(action.route)}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: action.iconBackgroundColor },
                      ]}
                    >
                      {action.type === "emoji" ? (
                        <Text style={styles.navIcon}>{action.icon}</Text>
                      ) : (
                        <Image
                          source={action.icon}
                          style={[
                            styles.navIconImage,
                            action.title === "User Updates"
                              ? { width: 28, height: 28 }
                              : null,
                            action.iconTintColor
                              ? { tintColor: action.iconTintColor }
                              : null,
                          ]}
                        />
                      )}
                    </View>
                    <Text style={styles.navText}>{action.title}</Text>
                    <Text style={styles.navSubtext}>{action.subtitle}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
          onPress={() => router.push("/(tabs)/User-Profile")}
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
  welcomeTextStrong: {
    fontWeight: "800",
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
  noResultsText: {
    fontSize: 14,
    color: "#7A8A7A",
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 14,
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
