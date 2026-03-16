import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
            <Image
              source={require('@/assets/icons/icon.png')}
              style={styles.elephantImage}
              resizeMode="contain"
            />
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
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/about-us')}>
            <View style={[styles.navIconCircle, styles.activeNavIcon]}>
              <Image
                source={require('@/assets/icons/about.png')}
                style={styles.bottomNavIconImage}
              />
            </View>
            <Text style={[styles.navLabel, styles.activeNavLabel]}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/homepage')}>
            <View style={styles.navIconCircle}>
              <Image
                source={require('@/assets/icons/homeicon.png')}
                style={styles.bottomNavIconImage}
              />
            </View>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/User-Profile')}>
            <View style={styles.navIconCircle}>
              <Image
                source={require('@/assets/icons/profile.png')}
                style={styles.profileNavIconImage}
              />
            </View>
            <Text style={styles.navLabel}>Profile</Text>
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
  elephantImage: {
    width: 140,
    height: 140,
    marginBottom: 20,
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
    paddingBottom: 140,
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
    bottom: -6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeNavIcon: {
    backgroundColor: '#FFFFFF',
  },
  bottomNavIcon: {
    fontSize: 24,
  },
  bottomNavIconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  profileNavIconImage: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  navLabel: {
    fontSize: 12,
    color: '#7A8A7A',
    fontWeight: '600',
  },
  activeNavLabel: {
    color: '#4A6A4A',
  },
});
