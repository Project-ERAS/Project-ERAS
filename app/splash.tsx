import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const animationRef = useRef<LottieView>(null);
  const router = useRouter();

  useEffect(() => {
    // Auto-play animation
    animationRef.current?.play();

    // Navigate to main screen after animation completes (adjust timeout as needed)
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000); // 3 seconds - adjust based on your animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../assets/logo-animation.json')}
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 300,
    height: 300,
  },
});
