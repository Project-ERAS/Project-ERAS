import { router, useLocalSearchParams } from "expo-router";
import { ImageBackground, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === "string" ? params.email : "";

  const primaryButton = useThemeColor({}, "signupPrimaryButton");
  const buttonText = useThemeColor({}, "signupButtonText");
  const shadowColor = useThemeColor({}, "signupShadow");
  const mutedText = useThemeColor({}, "signupMutedText");
  const backdropColor = useThemeColor({}, "signupBackdrop");

  return (
    <ImageBackground
      source={require("@/assets/icons/background.jpg")}
      resizeMode="cover"
      blurRadius={Platform.OS === "web" ? 0 : 0}
      imageStyle={styles.backgroundImage}
      style={styles.flex}
    >
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: backdropColor }]}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <ThemedText style={[styles.title, { color: mutedText }]}>
            Verify your email
          </ThemedText>
          <ThemedText style={[styles.message, { color: mutedText }]}>
            A verification link has been sent to {email}. Please verify your email to
            continue.
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/signin")}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: primaryButton,
                shadowColor,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <ThemedText style={[styles.primaryButtonText, { color: buttonText }]}>
              Go to Sign in
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backgroundImage: { opacity: 0.75 },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 24,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
