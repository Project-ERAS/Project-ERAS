import { useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
} from "firebase/auth";

import { ThemedText } from "@/components/themed-text";
import { auth } from "@/constants/firebase";

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = typeof params.mode === "string" ? params.mode : "firebase";
  const expectedOtp =
    typeof params.expectedOtp === "string" ? params.expectedOtp : "123456";
  const verificationId =
    typeof params.verificationId === "string" ? params.verificationId : "";
  const phoneNumber = typeof params.phone === "string" ? params.phone : "";
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const onChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const joined = code.join("");
    if (joined.length !== 6) {
      Alert.alert("Invalid code", "Enter the 6-digit code sent to your phone.");
      return;
    }

    if (mode === "fixed") {
      if (joined !== expectedOtp) {
        Alert.alert("Invalid code", "Please enter the correct OTP.");
        return;
      }

      Alert.alert("Verified", "Phone number verified.");
      router.replace("/live-alert");
      return;
    }

    if (!verificationId) {
      Alert.alert("Missing verification", "Please request a new OTP.");
      return;
    }

    setVerifying(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, joined);
      const user = auth.currentUser;
      if (user) {
        await linkWithCredential(user, credential);
      } else {
        await signInWithCredential(auth, credential);
      }

      Alert.alert("Verified", "Phone number verified.");
      router.replace("/live-alert");
    } catch (err: any) {
      Alert.alert(err?.message || "Failed to verify code.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={28} color="#2F6A39" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ThemedText style={styles.prompt}>
          Enter the 6 digit code sent to {phoneNumber || "your phone"}
        </ThemedText>
        <View style={styles.otpRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                inputRefs.current[i] = r;
              }}
              value={digit}
              onChangeText={(t) => onChange(t, i)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpBox}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={onSubmit}
          style={styles.confirmButton}
          activeOpacity={0.8}
          disabled={verifying}
        >
          <ThemedText style={styles.confirmText}>
            {verifying ? "Verifying..." : "Verify"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F7F5" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 18,
    paddingBottom: 10,
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
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 34,
    alignItems: "center",
  },
  prompt: {
    color: "#2F6A39",
    opacity: 0.85,
    marginBottom: 22,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    maxWidth: 320,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 22,
    paddingHorizontal: 10,
  },
  otpBox: {
    width: 44,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    color: "#111827",
    fontWeight: "800",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 2,
  },
  confirmButton: {
    backgroundColor: "#95D57D",
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 3,
  },
  confirmText: { color: "#FFFFFF", fontWeight: "800", fontSize: 18 },
});
