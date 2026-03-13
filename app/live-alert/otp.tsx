import { useRef, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function OtpScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const onChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 3) {
      inputs[index + 1].current?.focus();
    }
  };

  const onSubmit = () => {
    const joined = code.join('');
    if (joined.length === 4) {
      // TODO: verify OTP with server
      router.push('/');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ThemedView lightColor={Colors.light.signupBackground} style={styles.header} />
      <View style={styles.container}>
        <ThemedText style={styles.prompt}>Enter the 4 digit code sent to your phone</ThemedText>
        <View style={styles.otpRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={inputs[i]}
              value={digit}
              onChangeText={(t) => onChange(t, i)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpBox}
            />
          ))}
        </View>
        <TouchableOpacity onPress={onSubmit} style={styles.confirmButton} activeOpacity={0.8}>
          <ThemedText style={styles.confirmText}>Enter</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.signupBackground },
  header: { height: 120, backgroundColor: '#2f6a39' },
  container: { flex: 1, padding: 20, paddingTop: 24, alignItems: 'center' },
  prompt: { color: '#2f6a39', marginBottom: 20, textAlign: 'center' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 },
  otpBox: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
  },
  confirmButton: {
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
