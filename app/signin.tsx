import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  OAuthProvider,
  reload,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { auth, db } from "@/constants/firebase";
import { validateEmail } from "@/constants/utils/validation";
import { useThemeColor } from "@/hooks/use-theme-color";

WebBrowser.maybeCompleteAuthSession();

type FormState = {
  identifier: string;
  password: string;
};

export default function SigninScreen() {
  const SOCIAL_AUTH_TIMEOUT_MS = 15000;

  const [form, setForm] = useState<FormState>({
    identifier: "",
    password: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<keyof FormState | null>(
    null,
  );
  const [emailLoading, setEmailLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const webOutlineNone =
    Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null;

  const inputBackground = useThemeColor({}, "signupInputBackground");
  const socialButtonGrey = "#E5E7EB";
  const socialButtonPressedGrey = "#D1D5DB";
  const primaryButton = useThemeColor({}, "signupPrimaryButton");
  const primaryButtonPressed = "#0B5ED7";
  const buttonText = useThemeColor({}, "signupButtonText");
  const shadowColor = useThemeColor({}, "signupShadow");
  const mutedText = useThemeColor({}, "signupMutedText");
  const inputText = useThemeColor({}, "signupInputText");
  const dividerColor = useThemeColor({}, "signupDivider");
  const borderColor = useThemeColor({}, "signupBorder");

  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const googleAndroidClientId =
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const googleClientIdForPlatform =
    Platform.OS === "web"
      ? googleWebClientId
      : Platform.OS === "ios"
        ? googleIosClientId
        : googleAndroidClientId;
  const hasGoogleClientId = Boolean(googleClientIdForPlatform);

  const [googleRequest, , promptGoogleSignIn] = Google.useAuthRequest({
    // Prevent runtime crash when env vars are missing; click handler blocks sign-in until configured.
    webClientId: googleWebClientId ?? "missing-web-client-id",
    iosClientId: googleIosClientId ?? "missing-ios-client-id",
    androidClientId: googleAndroidClientId ?? "missing-android-client-id",
    scopes: ["profile", "email"],
  });

  function inputBorderFor(field: keyof FormState) {
    return focusedField === field ? primaryButton : borderColor;
  }

  const canSubmit = useMemo(() => {
    const identifier = form.identifier.trim();
    if (identifier.length === 0) return false;
    if (identifier.includes("@")) {
      return validateEmail(identifier).ok && form.password.length > 0;
    }
    return form.password.length > 0;
  }, [form.identifier, form.password]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function isUsingEmulators() {
    return (
      typeof __DEV__ !== "undefined" &&
      __DEV__ &&
      typeof process !== "undefined" &&
      typeof process.env !== "undefined" &&
      (process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS ?? "0") === "1"
    );
  }

  async function resolveEmailFromIdentifier(identifier: string) {
    const trimmed = identifier.trim();
    if (trimmed.length === 0) {
      return {
        ok: false as const,
        error: "Enter your email or username first.",
      };
    }

    if (trimmed.includes("@")) {
      const emailResult = validateEmail(trimmed);
      if (!emailResult.ok) {
        return {
          ok: false as const,
          error: "Please enter a valid email address.",
        };
      }
      return { ok: true as const, email: trimmed };
    }

    try {
      const snapshot = await getDocs(
        query(collection(db, "users"), where("username", "==", trimmed)),
      );
      if (snapshot.empty) {
        return {
          ok: false as const,
          error: "No account found with this username.",
        };
      }
      const docData = snapshot.docs[0]?.data() as any;
      const email =
        typeof docData?.email === "string" ? docData.email.trim() : "";
      if (!email) {
        return {
          ok: false as const,
          error: "No account found with this username.",
        };
      }
      return { ok: true as const, email };
    } catch (err: any) {
      const code = typeof err?.code === "string" ? err.code : null;
      if (code === "permission-denied") {
        return {
          ok: false as const,
          error: "Unable to look up username. Please use your email.",
        };
      }
      return {
        ok: false as const,
        error: "Unable to look up username. Please try again.",
      };
    }
  }

  async function onSubmit() {
    setSubmitError(null);
    if (!canSubmit) return;
    setEmailLoading(true);

    try {
      const password = form.password;
      const resolved = await resolveEmailFromIdentifier(form.identifier);
      if (!resolved.ok) {
        setSubmitError(resolved.error);
        return;
      }
      const email = resolved.email;

      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await reload(credential.user);

      if (!credential.user.emailVerified) {
        await signOut(auth);
        setSubmitError("Your email is not verified. Please check your inbox.");
        return;
      }

      router.replace("/(tabs)/homepage");
    } catch (err: any) {
      const code = typeof err?.code === "string" ? err.code : null;
      if (
        code === "auth/invalid-credential" ||
        code === "auth/invalid-login-credentials" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
      ) {
        setSubmitError(
          isUsingEmulators()
            ? "Sign-in failed. You are connected to Firebase emulators, so production accounts won’t work. Create the account again in emulator mode, or restart without emulators."
            : "Incorrect email/username or password.",
        );
      } else if (code === "auth/too-many-requests") {
        setSubmitError("Too many attempts. Please try again later.");
      } else if (code === "auth/network-request-failed") {
        setSubmitError(
          "Network request failed. Check your internet connection.",
        );
      } else {
        setSubmitError(err?.message || "Failed to sign in");
      }
    } finally {
      setEmailLoading(false);
    }
  }

  async function onForgotPassword() {
    const resolved = await resolveEmailFromIdentifier(form.identifier);
    if (!resolved.ok) {
      Alert.alert(resolved.error);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resolved.email);
      Alert.alert(
        isUsingEmulators()
          ? "Reset link generated. In emulator mode, emails are not delivered. Open the Emulator UI (Auth → Out of band emails) to copy the reset link."
          : "Reset link sent! Please check your inbox.",
      );
    } catch (err: any) {
      const code = typeof err?.code === "string" ? err.code : null;
      if (code === "auth/invalid-email" || code === "auth/missing-email") {
        Alert.alert("Please enter a valid email address.");
      } else if (
        code === "auth/user-not-found" ||
        code === "auth/invalid-credential" ||
        code === "auth/invalid-login-credentials"
      ) {
        Alert.alert(
          isUsingEmulators()
            ? "No account found in emulator mode. Create the account again in emulator mode, or restart without emulators."
            : "No account found with this email.",
        );
      } else if (code === "auth/network-request-failed") {
        Alert.alert("Network request failed. Check your internet connection.");
      } else {
        Alert.alert(err?.message || "Failed to send reset link.");
      }
    }
  }

  async function onGoogleSignIn() {
    setSubmitError(null);

    if (Platform.OS === "web") {
      setSocialLoading(true);
      const unlockTimer = setTimeout(
        () => setSocialLoading(false),
        SOCIAL_AUTH_TIMEOUT_MS,
      );
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(auth, provider);
        router.replace("/(tabs)/homepage");
      } catch (err: any) {
        const code = typeof err?.code === "string" ? err.code : null;
        if (
          code === "auth/popup-closed-by-user" ||
          code === "auth/cancelled-popup-request"
        ) {
          return;
        }
        if (code === "auth/account-exists-with-different-credential") {
          setSubmitError(
            "This email is already linked to another sign-in method.",
          );
        } else if (code === "auth/network-request-failed") {
          setSubmitError(
            "Network request failed. Check your internet connection.",
          );
        } else {
          setSubmitError(err?.message || "Failed to sign in with Google.");
        }
      } finally {
        clearTimeout(unlockTimer);
        setSocialLoading(false);
      }
      return;
    }

    if (!hasGoogleClientId) {
      Alert.alert(
        "Google sign-in is not configured yet.",
        "Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, and EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID in your environment.",
      );
      return;
    }

    if (!googleRequest) {
      setSubmitError("Google sign-in is initializing. Please try again.");
      return;
    }

    setSocialLoading(true);
    const unlockTimer = setTimeout(
      () => setSocialLoading(false),
      SOCIAL_AUTH_TIMEOUT_MS,
    );
    try {
      const result = await promptGoogleSignIn();
      if (result.type !== "success") return;

      const tokenFromAuth = (result as any)?.authentication?.idToken;
      const tokenFromParams = (result as any)?.params?.id_token;
      const idToken =
        typeof tokenFromAuth === "string"
          ? tokenFromAuth
          : typeof tokenFromParams === "string"
            ? tokenFromParams
            : null;

      if (!idToken) {
        setSubmitError("Google sign-in failed. Missing ID token.");
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      router.replace("/(tabs)/homepage");
    } catch (err: any) {
      const code = typeof err?.code === "string" ? err.code : null;
      if (code === "auth/account-exists-with-different-credential") {
        setSubmitError(
          "This email is already linked to another sign-in method.",
        );
      } else if (code === "auth/network-request-failed") {
        setSubmitError("Network request failed. Check your internet connection.");
      } else {
        setSubmitError(err?.message || "Failed to sign in with Google.");
      }
    } finally {
      clearTimeout(unlockTimer);
      setSocialLoading(false);
    }
  }

  async function onAppleSignIn() {
    setSubmitError(null);

    if (Platform.OS === "web") {
      setSocialLoading(true);
      const unlockTimer = setTimeout(
        () => setSocialLoading(false),
        SOCIAL_AUTH_TIMEOUT_MS,
      );
      try {
        const provider = new OAuthProvider("apple.com");
        provider.addScope("email");
        provider.addScope("name");
        provider.setCustomParameters({ locale: "en" });
        await signInWithPopup(auth, provider);
        router.replace("/(tabs)/homepage");
      } catch (err: any) {
        const code = typeof err?.code === "string" ? err.code : null;
        if (code === "auth/popup-closed-by-user") {
          return;
        }
        if (code === "auth/popup-blocked") {
          Alert.alert(
            "Popup blocked",
            "Allow popups for this site and try Apple sign-in again.",
          );
          return;
        }
        if (code === "auth/operation-not-allowed") {
          setSubmitError("Enable Apple provider in Firebase Authentication.");
          return;
        }
        if (code === "auth/unauthorized-domain") {
          setSubmitError(
            "Current domain is not authorized in Firebase Auth settings.",
          );
          return;
        }
        if (code === "auth/account-exists-with-different-credential") {
          setSubmitError(
            "This email is already linked to another sign-in method.",
          );
        } else if (code === "auth/network-request-failed") {
          setSubmitError(
            "Network request failed. Check your internet connection.",
          );
        } else {
          setSubmitError(err?.message || "Failed to sign in with Apple.");
        }
      } finally {
        clearTimeout(unlockTimer);
        setSocialLoading(false);
      }
      return;
    }

    if (Platform.OS !== "ios") {
      Alert.alert("Apple sign-in is available only on iOS devices.");
      return;
    }

    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Apple sign-in is not available on this device.");
      return;
    }

    setSocialLoading(true);
    const unlockTimer = setTimeout(
      () => setSocialLoading(false),
      SOCIAL_AUTH_TIMEOUT_MS,
    );
    try {
      const rawNonce = `${Date.now()}-${Math.random()}`;
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce,
      );

      const appleAuth = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!appleAuth.identityToken) {
        setSubmitError("Apple sign-in failed. Missing identity token.");
        return;
      }

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: appleAuth.identityToken,
        rawNonce,
      });

      await signInWithCredential(auth, credential);
      router.replace("/(tabs)/homepage");
    } catch (err: any) {
      const code = typeof err?.code === "string" ? err.code : null;
      if (code === "ERR_REQUEST_CANCELED") {
        return;
      }
      if (code === "auth/account-exists-with-different-credential") {
        setSubmitError(
          "This email is already linked to another sign-in method.",
        );
      } else if (code === "auth/network-request-failed") {
        setSubmitError("Network request failed. Check your internet connection.");
      } else {
        setSubmitError(err?.message || "Failed to sign in with Apple.");
      }
    } finally {
      clearTimeout(unlockTimer);
      setSocialLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.headerSection}>
                <Image
                  source={require("@/assets/icons/icon.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <ThemedText style={[styles.headerTitle, { color: mutedText }]}>
                  Sign in to E.R.A.S
                </ThemedText>
              </View>

              <View style={styles.socialSection}>
                <Pressable
                  accessibilityRole="button"
                  onPress={onGoogleSignIn}
                  disabled={emailLoading || socialLoading}
                  style={({ pressed }) => [
                    styles.socialButton,
                    {
                      backgroundColor: pressed
                        ? socialButtonPressedGrey
                        : socialButtonGrey,
                      borderColor,
                      shadowColor,
                      opacity: 1,
                    },
                  ]}
                >
                  <Image
                    source={require("@/assets/images/Google.png")}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <ThemedText style={[styles.socialText, { color: mutedText }]}>
                    Sign in with Google
                  </ThemedText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={onAppleSignIn}
                  disabled={emailLoading || socialLoading}
                  style={({ pressed }) => [
                    styles.socialButton,
                    {
                      backgroundColor: pressed
                        ? socialButtonPressedGrey
                        : socialButtonGrey,
                      borderColor,
                      shadowColor,
                      opacity: 1,
                    },
                  ]}
                >
                  <Image
                    source={require("@/assets/images/Apple.png")}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <ThemedText style={[styles.socialText, { color: mutedText }]}>
                    Sign in with Apple
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.dividerRow}>
                <View
                  style={[styles.divider, { backgroundColor: dividerColor }]}
                />
                <ThemedText style={[styles.dividerText, { color: mutedText }]}>
                  or
                </ThemedText>
                <View
                  style={[styles.divider, { backgroundColor: dividerColor }]}
                />
              </View>

              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: mutedText }]}>
                  Username or email address*
                </ThemedText>
                <TextInput
                  value={form.identifier}
                  onChangeText={(v) => updateField("identifier", v)}
                  onFocus={() => setFocusedField("identifier")}
                  onBlur={() =>
                    setFocusedField((prev) =>
                      prev === "identifier" ? null : prev,
                    )
                  }
                  autoCapitalize="none"
                  placeholder=""
                  placeholderTextColor={mutedText}
                  selectionColor={primaryButton}
                  style={[
                    styles.input,
                    webOutlineNone,
                    {
                      backgroundColor: inputBackground,
                      color: inputText,
                      borderColor: inputBorderFor("identifier"),
                    },
                  ]}
                />
              </View>

              <View style={styles.field}>
                <View style={styles.passwordRow}>
                  <ThemedText style={[styles.label, { color: mutedText }]}>
                    Password*
                  </ThemedText>
                  <Pressable onPress={onForgotPassword}>
                    <ThemedText style={styles.forgotLink}>
                      Forgot password?
                    </ThemedText>
                  </Pressable>
                </View>
                <TextInput
                  value={form.password}
                  onChangeText={(v) => updateField("password", v)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() =>
                    setFocusedField((prev) =>
                      prev === "password" ? null : prev,
                    )
                  }
                  autoCapitalize="none"
                  secureTextEntry
                  placeholder=""
                  placeholderTextColor={mutedText}
                  selectionColor={primaryButton}
                  style={[
                    styles.input,
                    webOutlineNone,
                    {
                      backgroundColor: inputBackground,
                      color: inputText,
                      borderColor: inputBorderFor("password"),
                    },
                  ]}
                />
              </View>

              {submitError ? (
                <ThemedText
                  style={styles.submitError}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {submitError}
                </ThemedText>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={onSubmit}
                disabled={!canSubmit || emailLoading}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor:
                      pressed && canSubmit && !emailLoading
                        ? primaryButtonPressed
                        : primaryButton,
                    shadowColor,
                    opacity: !canSubmit || emailLoading ? 0.55 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={[styles.primaryButtonText, { color: buttonText }]}
                >
                  {emailLoading ? "Signing in..." : "Sign in"}
                </ThemedText>
              </Pressable>

              <View style={styles.bottomRow}>
                <ThemedText style={{ color: mutedText }}>
                  New to E.R.A.S?{" "}
                </ThemedText>
                <Pressable onPress={() => router.push("/signup")}>
                  <ThemedText style={styles.createLink}>
                    Create an account
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 28,
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#101828",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 230,
    height: 170,
    marginBottom: -4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  socialSection: {
    gap: 10,
    marginTop: 12,
    alignItems: "center",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    width: "100%",
    maxWidth: 420,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  field: {
    marginBottom: 14,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
  },
  primaryButton: {
    borderRadius: 14,
    width: "100%",
    maxWidth: 460,
    paddingVertical: 15,
    alignItems: "center",
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 8,
    alignSelf: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    flexWrap: "wrap",
  },
  createLink: {
    fontWeight: "600",
    color: "#000000",
  },
  submitError: {
    color: "#FF3B30",
  },
});
