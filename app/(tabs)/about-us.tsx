import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function AboutUsScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <View style={styles.elephantIcon}>
              <Image
                source={require('@/assets/icons/icon.png')}
                style={styles.elephantImage}
                resizeMode="contain"
              />
            </View>
            <ThemedText style={styles.title}>About E.R.A.S</ThemedText>
          </View>
        </View>

        {/* Content Section */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={styles.missionHeading}>Our mission</ThemedText>
          
          <ThemedText style={styles.missionText}>
            E.R.A.S is dedicated to protecting elephants and reducing human-wildlife conflicts through innovative technology and community engagement. By providing real-time tracking data and early warning systems, we empower conservation efforts and promote coexistence between humans and elephants.
          </ThemedText>

          {/* Additional spacing for scroll */}
          <View style={styles.spacer} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/(tabs)/about-us')}
          >
            <Ionicons name="information-circle" size={28} color="#8FA888" />
            <View style={styles.activeIndicator} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/(tabs)/homepage')}
          >
            <Ionicons name="home-outline" size={28} color="#8FA888" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/(tabs)/User-Profile')}
          >
            <Ionicons name="person-outline" size={28} color="#8FA888" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8FA888',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: '#8FA888',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  elephantIcon: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  elephantImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: '#C8DBB3',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 100,
  },
  missionHeading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  missionText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#5A6B5A',
    textAlign: 'center',
    fontWeight: '500',
  },
  spacer: {
    height: 40,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#C8DBB3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    position: 'relative',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginTop: 4,
  },
});
