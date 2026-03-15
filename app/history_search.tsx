import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.label}>Enter location</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color="#666" 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder=""
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={handleEnter}
          />
        </View>

        <TouchableOpacity 
          style={styles.enterButton}
          onPress={handleEnter}
        >
          <Text style={styles.enterButtonText}>Enter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#507852',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: 47, // To center the title with back button present
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  label: {
    fontSize: 16,
    color: '#4a5e4a',
    marginBottom: 12,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  enterButton: {
    backgroundColor: '#507852',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  enterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
