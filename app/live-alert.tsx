import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
      <ThemedView lightColor={Colors.light.signupBackground} style={styles.header} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.rowTop}>
          <ThemedText style={styles.registerText}>Register to get live alerts</ThemedText>
          <View style={styles.switchRow}>
            <Switch value={enabled} onValueChange={toggle} thumbColor={enabled ? '#fff' : '#ddd'} />
            
          </View>
        </View>

        <ThemedText style={styles.label}>Enter your phone number</ThemedText>

        <View style={styles.inputRow}>
          <ThemedView style={styles.countryBox} lightColor="#ffffff50">
            <ThemedText style={styles.countryText}>{COUNTRY_CODE}</ThemedText>
          </ThemedView>

          <TextInput
            keyboardType="number-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="7xxxxxxxx"
            placeholderTextColor="#666"
            style={styles.input}
            maxLength={9}
          />
        </View>

        <TouchableOpacity onPress={onConfirm} style={styles.confirmButton} activeOpacity={0.8}>
          <ThemedText style={styles.confirmText}>Confirm</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.background },
  header: { height: 120, backgroundColor: '#2f6a39' },
  container: { padding: 20, paddingTop: 24 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  registerText: { fontSize: 16, color: '#2b4b33' },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { marginLeft: 8, color: '#333' },
  label: { color: '#2f6a39', marginBottom: 8, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  countryBox: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginRight: 8, backgroundColor: '#fff' },
  countryText: { color: '#2f6a39', fontWeight: '600' },
  input: {
    flex: 1,
    backgroundColor: Colors.light.signupInputBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#000',
    borderWidth: 1,
    borderColor: Colors.light.signupBorder,
    shadowColor: Colors.light.signupShadow,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  confirmButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2f6a39',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  confirmText: { color: '#fff', fontWeight: '600' },
});
