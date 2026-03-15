import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const animationRef = useRef<LottieView>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(tabs)/homepage');
    }, 5500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../assets/animations/logo animation.json')}
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
    width: 400,
    height: 400,
  },
});