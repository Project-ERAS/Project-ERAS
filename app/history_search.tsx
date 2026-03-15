import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HistorySearchScreen() {
  const router = useRouter();
  const [location, setLocation] = useState('');

  const handleEnter = () => {
    // Handle the search/enter action
    if (location.trim()) {
      console.log('Searching for location:', location);
      // Add your navigation or search logic here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color="#2D3E2D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.label}>Enter location</Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchIconWrapper}>
              <Ionicons name="search" size={18} color="#7A8A7A" />
            </View>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Search by location..."
              placeholderTextColor="#7A8A7A"
              returnKeyType="search"
              onSubmitEditing={handleEnter}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.enterButton,
              pressed ? styles.enterButtonPressed : null,
            ]}
            onPress={handleEnter}
          >
            <Text style={styles.enterButtonText}>Enter</Text>
          </Pressable>
        </View>

        <View style={styles.animationContainer}>
          <LottieView
            source={require('../assets/animations/history.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEE8',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EEE8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3E2D',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    gap: 0,
  },
  label: {
    fontSize: 14,
    color: '#2D3E2D',
    marginBottom: 10,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8EEE8',
  },
  searchIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3E2D',
    fontWeight: '600',
  },
  enterButton: {
    backgroundColor: '#93cc72',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  enterButtonPressed: {
    backgroundColor: '#4c9c3e',
  },
  enterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  animation: {
    width: 220,
    height: 220,
  },
});
