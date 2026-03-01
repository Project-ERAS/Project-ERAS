import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const animationRef = useRef<LottieView>(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../assets/animations/logo animation.json')}
        style={styles.animation}
        autoPlay
        loop={false}
      />
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/signin')}
      >
        <Text style={styles.linkText}>go to</Text>
      </TouchableOpacity>
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
  linkButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    padding: 10,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});