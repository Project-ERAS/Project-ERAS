import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { firebaseConfig } from "@/constants/firebase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

import { ThemedText } from "@/components/themed-text";

const ENABLE_KEY = "liveAlertsEnabled";
const PHONE_KEY = "liveAlertsPhone";
const COUNTRY_CODE = "+94";
const FIXED_OTP = "123456";

export default function LiveAlert() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingOtp, setSendingOtp] = useState<boolean>(false);
  const recaptchaVerifierRef = useRef<FirebaseRecaptchaVerifierModal>(null);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(ENABLE_KEY);
        const p = await AsyncStorage.getItem(PHONE_KEY);
        setEnabled(v === "true");
        setPhone(p ?? "");
      } catch {
        // ignore load errors
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = async (value: boolean) => {
    setEnabled(value);
    try {
      await AsyncStorage.setItem(ENABLE_KEY, value ? "true" : "false");
    } catch {
      // noop
    }
  };

  const validatePhone = (raw: string) => {
    // strip non-digits
    const digits = raw.replace(/\D/g, "");
    // Sri Lanka: typical local number length is 9 (without leading 0)
    return digits.length === 9;
  };

  const router = useRouter();

  const onConfirm = async () => {
    if (!validatePhone(phone)) {
      Alert.alert(
        "Invalid phone",
        "Enter a 9-digit phone number (without the leading 0).",
      );
      return;
    }

    try {
      const digits = phone.replace(/\D/g, "");
      const phoneNumber = `${COUNTRY_CODE}${digits}`;
      await AsyncStorage.setItem(PHONE_KEY, digits);

      setSendingOtp(true);
      if (!recaptchaVerifierRef.current) {
        Alert.alert("Error", "reCAPTCHA verifier is not ready. Please try again.");
        return;
      }

      await recaptchaVerifierRef.current.verify();

      router.push({
        pathname: "/live-alert/otp",
        params: {
          phone: phoneNumber,
          mode: "fixed",
          expectedOtp: FIXED_OTP,
        },
      } as any);
    } catch (e) {
      const msg =
        typeof (e as any)?.message === "string"
          ? (e as any).message
          : "reCAPTCHA verification failed.";
      Alert.alert("Error", msg);
    } finally {
      setSendingOtp(false);
    }
  };

  if (loading) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifierRef}
        firebaseConfig={firebaseConfig as any}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={28} color="#2F6A39" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleBlock}>
          <ThemedText style={styles.title}>Live Alert</ThemedText>
          <ThemedText style={styles.subtitle}>
            Register to get live alerts
          </ThemedText>
        </View>

        <View style={styles.card}>
          <View style={styles.enableRow}>
            <Text style={styles.cardTitle}>Enable alerts</Text>
            <Switch
              value={enabled}
              onValueChange={toggle}
              thumbColor={enabled ? "#ffffff" : "#ffffff"}
              trackColor={{ false: "#D1D5DB", true: "#A7D58A" }}
            />
          </View>

          <Text style={styles.cardLabel}>Phone number</Text>

          <View style={styles.phoneRow}>
            <View style={styles.countryBox}>
              <Text style={styles.countryText}>{COUNTRY_CODE}</Text>
            </View>

            <TextInput
              keyboardType="number-pad"
              value={phone}
              onChangeText={setPhone}
              placeholder="7xxxxxxxx"
              placeholderTextColor="#8A8A8A"
              style={styles.phoneInput}
              maxLength={9}
            />
          </View>

          <TouchableOpacity
            onPress={onConfirm}
            style={styles.confirmButton}
            activeOpacity={0.85}
            disabled={sendingOtp}
          >
            <Text style={styles.confirmText}>
              {sendingOtp ? "Sending..." : "Confirm"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.illustrationCard}>
          <MaterialIcons name="warning-amber" size={72} color="#E07070" />
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F6F7" },
  header: {
    paddingTop: 8,
    paddingHorizontal: 18,
    paddingBottom: 6,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  container: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 190,
  },
  titleBlock: {
    marginBottom: 22,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: "#263526",
    paddingTop: 10,
    paddingBottom: 5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: "#7B857B",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  enableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2F3B2F",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F3B2F",
    marginBottom: 10,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  countryBox: {
    width: 74,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  countryText: { color: "#2F3B2F", fontWeight: "800", fontSize: 16 },
  phoneInput: {
    flex: 1,
    height: 52,
    backgroundColor: "#EDEDED",
    borderRadius: 18,
    paddingHorizontal: 16,
    color: "#111111",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#94AF97",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 3,
  },
  confirmText: { color: "#FFFFFF", fontWeight: "800", fontSize: 18 },
  illustrationCard: {
    marginTop: 24,
    height: 220,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
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
