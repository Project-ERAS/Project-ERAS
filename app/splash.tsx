import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { auth } from "@/constants/firebase";

export default function SplashScreen() {
  const animationRef = useRef<LottieView>(null);
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(Boolean(user));
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    const timer = setTimeout(() => {
      router.replace(isSignedIn ? "/(tabs)/homepage" : "/signin");
    }, 5500);

    return () => clearTimeout(timer);
  }, [authChecked, isSignedIn, router]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../assets/animations/logo animation.json")}
        style={styles.animation}
        autoPlay
        loop={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 400,
    height: 400,
  },
});
