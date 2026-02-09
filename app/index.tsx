import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreateAccount = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    console.log("Sign up attempted with:", { email, password, username });
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.backgroundContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/images/elephant1.png")}
                  style={styles.mainLogo}
                />
              </View>
              <Text style={styles.welcomeText}>Sign up for E.R.A.S</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Google Button */}
              <TouchableOpacity style={styles.socialButtonWhite}>
                <Image
                  source={require("../assets/images/Google.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonTextDark}>
                  Sign up with Google
                </Text>
              </TouchableOpacity>

              {/* Apple Button */}
              <TouchableOpacity style={styles.socialButtonWhite}>
                <Image
                  source={require("../assets/images/Apple.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonTextDark}>
                  Sign up with Apple
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              {/* Input Fields */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email*</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password*</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Username*</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.termsText}>
                By creating an account, you agree to the terms of service.
              </Text>

              {/* Create Account Button */}
              <AnimatedTouchable
                onPress={handleCreateAccount}
                activeOpacity={0.8}
                style={[
                  styles.createButton,
                  { transform: [{ scale: buttonScale }] },
                ]}
              >
                <Text style={styles.createButtonText}>Create Account &gt;</Text>
              </AnimatedTouchable>

              <View style={styles.signinContainer}>
                <Text style={styles.signinText}>Already have an account? </Text>
                <TouchableOpacity>
                  <Text style={styles.signinLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundContainer: { flex: 1, backgroundColor: "#c8dbb3" },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 30,
    paddingTop: 0,
  },
  content: { paddingHorizontal: 30 },

  // Header adjustments for tighter spacing
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 0,
  },
  logoContainer: {
    marginBottom: 0,
  },

  // --- UPDATED LOGO SIZE (Gap Fix) ---
  mainLogo: {
    width: 260,
    height: 200, // Reduced from 200 to remove empty vertical space
    resizeMode: "contain",
  },

  // --- UPDATED TEXT MARGIN (Gap Fix) ---
  welcomeText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#4a4a4a",
    marginTop: -60, // Negative margin pulls text closer to image
  },

  formSection: { width: "100%" },

  // --- UPDATED BUTTON SIZE (Slimmer) ---
  socialButtonWhite: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 8, // Increased slightly from 8 for better touch target, but less than 16
    marginBottom: 14,
    // Shadow properties
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },

  // --- UPDATED ICON SIZE (Slimmer) ---
  socialIcon: {
    width: 20, // Reduced from 24
    height: 20, // Reduced from 24
    resizeMode: "contain",
    marginRight: 10,
  },

  // --- UPDATED FONT SIZE (Slimmer) ---
  socialButtonTextDark: {
    fontSize: 15, // Reduced from 17
    color: "#2d2d2d",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: "rgba(0,0,0,0.15)" },
  dividerText: { marginHorizontal: 16, color: "#6b6b6b" },

  inputWrapper: { marginBottom: 18 },
  inputLabel: { fontSize: 14, marginBottom: 8 },
  input: {
    backgroundColor: "#e5e5e5",
    borderRadius: 25,
    padding: 16,
  },

  termsText: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 20,
  },

  createButton: {
    backgroundColor: "#3f7047",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontSize: 18 },

  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signinText: { color: "#3d3d3d" },
  signinLink: { color: "#5aaccc", fontWeight: "600" },
});

export default SignupScreen;
