import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import LottieView from 'lottie-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

const ENABLE_KEY = 'liveAlertsEnabled';
const PHONE_KEY = 'liveAlertsPhone';
const COUNTRY_CODE = '+94';

export default function LiveAlert() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(ENABLE_KEY);
        const p = await AsyncStorage.getItem(PHONE_KEY);
        setEnabled(v === 'true');
        setPhone(p ?? '');
      } catch {
        // ignore load errors
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = async (value: boolean) => {
    setEnabled(value);
    try {
      await AsyncStorage.setItem(ENABLE_KEY, value ? 'true' : 'false');
    } catch {
      // noop
    }
  };

  const validatePhone = (raw: string) => {
    // strip non-digits
    const digits = raw.replace(/\D/g, '');
    // Sri Lanka: typical local number length is 9 (without leading 0)
    return digits.length === 9;
  };

  const router = useRouter();

  const onConfirm = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('Invalid phone', 'Enter a 9-digit phone number (without the leading 0).');
      return;
    }

    try {
      await AsyncStorage.setItem(PHONE_KEY, phone);
      // after saving navigate to the OTP entry screen
      router.push('/live-alert/otp');
    } catch {
      Alert.alert('Error', 'Failed to save phone number.');
    }
  };

  if (loading) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.heroInner}>
            <ThemedText style={styles.heroTitle}>Live Alert</ThemedText>
            <ThemedText style={styles.heroSubtitle}>Register to get live alerts</ThemedText>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardTopText}>
              <ThemedText style={styles.cardTitle}>Enable alerts</ThemedText>
            </View>

            <Switch
              value={enabled}
              onValueChange={toggle}
              thumbColor={enabled ? '#fff' : '#ddd'}
              trackColor={{ false: '#E8EEE8', true: '#2f6a39' }}
            />
          </View>

          <ThemedText style={styles.label}>Phone number</ThemedText>

          <View style={styles.inputRow}>
            <ThemedView style={styles.countryBox}>
              <ThemedText style={styles.countryText}>{COUNTRY_CODE}</ThemedText>
            </ThemedView>

            <TextInput
              keyboardType="number-pad"
              value={phone}
              onChangeText={setPhone}
              placeholder="7xxxxxxxx"
              placeholderTextColor="#7A8A7A"
              style={styles.input}
              maxLength={9}
            />
          </View>

          <Pressable onPress={onConfirm} style={({ pressed }) => [styles.confirmButton, pressed && styles.confirmButtonPressed]}>
            <ThemedText style={styles.confirmText}>Confirm</ThemedText>
          </Pressable>

          <View style={styles.attentionWrap} pointerEvents="none">
            <LottieView
              source={require('@/assets/animations/Attention.json')}
              autoPlay
              loop
              style={styles.attentionAnim}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAF9' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 28 },

  hero: {
    height: 170,
    backgroundColor: '#F8FAF9',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEE8',
  },
  heroInner: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3E2D',
    lineHeight: 32,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#7A8A7A',
  },

  card: {
    marginTop: -8,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardTopText: { flex: 1, paddingRight: 12 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3E2D',
  },

  label: { color: '#2D3E2D', marginBottom: 8, fontWeight: '700' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  countryBox: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEE8',
  },
  countryText: { color: '#2D3E2D', fontWeight: '800' },
  input: {
    flex: 1,
    backgroundColor: Colors.light.signupInputBackground,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#2D3E2D',
    borderWidth: 1,
    borderColor: '#E8EEE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  confirmButton: {
    alignSelf: 'stretch',
    backgroundColor: '#93cc72',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  confirmButtonPressed: {
    backgroundColor: '#4c9c3e',
  },
  confirmText: { color: '#fff', fontWeight: '800' },

  attentionWrap: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionAnim: {
    width: 180,
    height: 180,
  },
});
