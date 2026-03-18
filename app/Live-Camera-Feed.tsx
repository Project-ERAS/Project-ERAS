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
  } catch {
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

  const backgroundColor = '#F8FAF9';
  const surfaceColor = '#FFFFFF';
  const borderColor = '#E8EEE8';
  const textPrimary = '#2D3E2D';
  const textSecondary = '#7A8A7A';
  const accentGreen = '#93cc72';
  const accentGreenPressed = '#4c9c3e';
  const cardShadowColor = '#000';

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
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: surfaceColor, borderBottomColor: borderColor }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: surfaceColor, borderColor, shadowColor: cardShadowColor }]}
            activeOpacity={0.75}
          >
            <MaterialIcons name="arrow-back" size={24} color={textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Live camera feed</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Input Section */}
        <View style={[styles.cardContainer, { backgroundColor: surfaceColor, borderColor, shadowColor: cardShadowColor }]}>
          {/* Location Input */}
          <Text style={[styles.label, { color: textPrimary }]}>Enter location</Text>
          <TextInput
            style={[styles.input, { color: textPrimary, backgroundColor: surfaceColor, borderColor, shadowColor: cardShadowColor }]}
            placeholder="e.g., Anuradhapura"
            placeholderTextColor={textSecondary}
            value={location}
            onChangeText={setLocation}
          />

          {/* Camera Number Input */}
          <Text style={[styles.label, { marginTop: 16, color: textPrimary }]}>Enter camera no.</Text>
          <TextInput
            style={[styles.input, { color: textPrimary, backgroundColor: surfaceColor, borderColor, shadowColor: cardShadowColor }]}
            placeholder="e.g., 1, 2, 3"
            placeholderTextColor={textSecondary}
            value={cameraNo}
            onChangeText={setCameraNo}
            keyboardType="numeric"
          />

          {/* Button Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.enterButton, { backgroundColor: accentGreen }]}
              onPress={handleEnter}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Enter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton, { backgroundColor: surfaceColor, borderColor }]}
              onPress={handleReset}
              activeOpacity={0.85}
            >
              <Text style={[styles.resetButtonText, { color: textPrimary }]}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Section */}
        {Platform.OS !== 'web' && MapView ? (
          <View style={[styles.mapContainer, { backgroundColor: surfaceColor, borderColor, shadowColor: cardShadowColor }]}>
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
          <ScrollView style={[styles.mapContainer, { backgroundColor: surfaceColor, borderColor, shadowColor: cardShadowColor }]}>
            <View style={styles.webMapFallback}>
              <MaterialIcons name="location-on" size={48} color={accentGreenPressed} />
              <Text style={[styles.webMapTitle, { color: textPrimary }]}>Camera Locations</Text>
              {markers.length > 0 ? (
                markers.map((camera) => (
                  <View
                    key={camera.id}
                    style={[
                      styles.cameraItem,
                      { backgroundColor: surfaceColor, borderColor, borderLeftColor: accentGreenPressed },
                    ]}
                  >
                    <View style={styles.cameraItemHeader}>
                      <MaterialIcons name="videocam" size={20} color={accentGreenPressed} />
                      <Text style={[styles.cameraItemName, { color: textPrimary }]}>{camera.name}</Text>
                    </View>
                    <Text style={[styles.cameraItemLocation, { color: textSecondary }]}>{camera.location}</Text>
                    <Text style={[styles.cameraItemCoords, { color: textSecondary }]}>
                      {camera.latitude.toFixed(4)}, {camera.longitude.toFixed(4)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.noResultsText, { color: textSecondary }]}>No cameras found</Text>
              )}
            </View>
          </ScrollView>
        )}

        {/* Camera Count */}
        {markers.length > 0 && (
          <View style={styles.cameraCount}>
            <Text style={[styles.cameraCountText, { color: textSecondary }]}>
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
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  cardContainer: {
    marginHorizontal: 22,
    marginTop: 18,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
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
    borderRadius: 14,
    minWidth: 90,
    alignItems: 'center',
  },
  enterButton: {},
  resetButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 22,
    marginTop: 0,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
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
    fontWeight: '600',
  },
  webMapFallback: {
    padding: 16,
    alignItems: 'center',
  },
  webMapTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 16,
  },
  cameraItem: {
    width: '100%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
  },
  cameraItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraItemName: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  cameraItemLocation: {
    fontSize: 12,
    marginBottom: 4,
  },
  cameraItemCoords: {
    fontSize: 11,
  },
  noResultsText: {
    fontSize: 14,
    marginTop: 16,
  },
});
