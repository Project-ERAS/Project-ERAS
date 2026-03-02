import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

let MapView: any;
let Marker: any;

// Only import MapView on native platforms (iOS/Android)
if (Platform.OS !== 'web') {
  try {
    const req = eval('require');
    const mapsModule = req('react-native-maps');
    MapView = mapsModule.default;
    Marker = mapsModule.Marker;
  } catch (e) {
    // Fallback if import fails
  }
}

// Sample camera locations data
const CAMERA_LOCATIONS = [
  {
    id: 1,
    name: 'Camera 1',
    latitude: 6.9271,
    longitude: 80.7743,
    location: 'Colombo',
  },
  {
    id: 2,
    name: 'Camera 2',
    latitude: 7.2906,
    longitude: 80.6337,
    location: 'Kandy',
  },
  {
    id: 3,
    name: 'Camera 3',
    latitude: 6.0535,
    longitude: 80.2158,
    location: 'Galle',
  },
  {
    id: 4,
    name: 'Camera 4',
    latitude: 9.6615,
    longitude: 80.7851,
    location: 'Jaffna',
  },
  {
    id: 5,
    name: 'Camera 5',
    latitude: 7.2064,
    longitude: 79.8581,
    location: 'Negombo',
  },
];

const INITIAL_REGION = {
  latitude: 7.5,
  longitude: 80.5,
  latitudeDelta: 3,
  longitudeDelta: 2,
};

export default function LiveCameraFeedScreen() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [cameraNo, setCameraNo] = useState('');
  const [markers, setMarkers] = useState(CAMERA_LOCATIONS);
  const colorScheme = 'light';
  const colors = Colors[colorScheme];

  const handleEnter = () => {
    // Filter cameras based on location and camera number
    let filtered = CAMERA_LOCATIONS;

    if (location.trim()) {
      filtered = filtered.filter((cam) =>
        cam.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (cameraNo.trim()) {
      filtered = filtered.filter((cam) =>
        cam.id.toString().includes(cameraNo.trim())
      );
    }

    setMarkers(filtered);
  };

  const handleReset = () => {
    setLocation('');
    setCameraNo('');
    setMarkers(CAMERA_LOCATIONS);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.signupBackground }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live camera feed</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Input Section */}
        <View style={styles.cardContainer}>
          {/* Location Input */}
          <Text style={styles.label}>Enter location</Text>
          <TextInput
            style={[styles.input, { color: colors.signupInputText }]}
            placeholder="e.g., Anuradhapura"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />

          {/* Camera Number Input */}
          <Text style={[styles.label, { marginTop: 16 }]}>Enter camera no.</Text>
          <TextInput
            style={[styles.input, { color: colors.signupInputText }]}
            placeholder="e.g., 1, 2, 3"
            placeholderTextColor="#999"
            value={cameraNo}
            onChangeText={setCameraNo}
            keyboardType="numeric"
          />

          {/* Button Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.enterButton]}
              onPress={handleEnter}
            >
              <Text style={styles.buttonText}>Enter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Section */}
        {Platform.OS !== 'web' && MapView ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={INITIAL_REGION}
              provider="google"
              zoomEnabled={true}
              scrollEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
            >
              {markers.map((camera) => (
                <Marker
                  key={camera.id}
                  coordinate={{
                    latitude: camera.latitude,
                    longitude: camera.longitude,
                  }}
                  title={camera.name}
                  description={camera.location}
                />
              ))}
            </MapView>
          </View>
        ) : (
          <ScrollView style={styles.mapContainer}>
            <View style={styles.webMapFallback}>
              <MaterialIcons name="location-on" size={48} color="#2d5016" />
              <Text style={styles.webMapTitle}>Camera Locations</Text>
              {markers.length > 0 ? (
                markers.map((camera) => (
                  <View key={camera.id} style={styles.cameraItem}>
                    <View style={styles.cameraItemHeader}>
                      <MaterialIcons name="videocam" size={20} color="#2d5016" />
                      <Text style={styles.cameraItemName}>{camera.name}</Text>
                    </View>
                    <Text style={styles.cameraItemLocation}>{camera.location}</Text>
                    <Text style={styles.cameraItemCoords}>
                      {camera.latitude.toFixed(4)}, {camera.longitude.toFixed(4)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noResultsText}>No cameras found</Text>
              )}
            </View>
          </ScrollView>
        )}

        {/* Camera Count */}
        {markers.length > 0 && (
          <View style={styles.cameraCount}>
            <Text style={styles.cameraCountText}>
              Found {markers.length} camera{markers.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2d5016',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  cardContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#c8dbb3',
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 90,
    alignItems: 'center',
  },
  enterButton: {
    backgroundColor: '#3f7047',
  },
  resetButton: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#11181C',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
  cameraCount: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  cameraCountText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  webMapFallback: {
    padding: 16,
    alignItems: 'center',
  },
  webMapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
    marginTop: 12,
    marginBottom: 16,
  },
  cameraItem: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2d5016',
  },
  cameraItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5016',
    marginLeft: 8,
  },
  cameraItemLocation: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  cameraItemCoords: {
    fontSize: 11,
    color: '#999999',
  },
  noResultsText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 16,
  },
});
