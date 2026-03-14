import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type FormState = {
  identifier: string;
  password: string;
};

const SAMPLE_ACCOUNT = {
  email: 'test@example.com',
  password: 'testing123',
  username: 'testuser',
};

export default function SigninScreen() {
  const [form, setForm] = useState<FormState>({
    identifier: '',
    password: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<keyof FormState | null>(null);
  const [loading, setLoading] = useState(false);

  const webOutlineNone = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null;

  const inputBackground = useThemeColor({}, 'signupInputBackground');
  const socialButtonBackground = useThemeColor({}, 'signupSocialButtonBackground');
  const primaryButton = useThemeColor({}, 'signupPrimaryButton');
  const buttonText = useThemeColor({}, 'signupButtonText');
  const shadowColor = useThemeColor({}, 'signupShadow');
  const mutedText = useThemeColor({}, 'signupMutedText');
  const inputText = useThemeColor({}, 'signupInputText');
  const linkColor = useThemeColor({}, 'signupLink');
  const dividerColor = useThemeColor({}, 'signupDivider');
  const borderColor = useThemeColor({}, 'signupBorder');
  const backdropColor = useThemeColor({}, 'signupBackdrop');

  function inputBorderFor(field: keyof FormState) {
    return focusedField === field ? primaryButton : borderColor;
  }

  const canSubmit = useMemo(() => {
    return form.identifier.trim().length > 0 && form.password.length > 0;
  }, [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit() {
    setSubmitError(null);
    if (!canSubmit) return;
    setLoading(true);

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 250));
      router.replace('/(tabs)/homepage');
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  function fillSample() {
    setForm({ identifier: SAMPLE_ACCOUNT.email, password: SAMPLE_ACCOUNT.password });
  }

  async function handleUseSample() {
    setSubmitError(null);
    setLoading(true);
    fillSample();
    setLoading(false);
  }

  return (
    <ImageBackground
      source={require('@/assets/icons/background.jpg')}
      resizeMode="cover"
      blurRadius={Platform.OS === 'web' ? 0 : 0}
      imageStyle={styles.backgroundImage}
      style={styles.flex}
    >
      <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: backdropColor }]} />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.headerSection}>
                <Image
                  source={require('@/assets/icons/icon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <ThemedText style={[styles.headerTitle, { color: mutedText }]}>Sign in to E.R.A.S</ThemedText>
              </View>

              <View style={styles.socialSection}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => console.log('Google sign in')}
                  style={({ pressed }) => [
                    styles.socialButton,
                    {
                      backgroundColor: socialButtonBackground,
                      borderColor,
                      shadowColor,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <Image
                    source={require('@/assets/images/Google.png')}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <ThemedText style={[styles.socialText, { color: mutedText }]}>Sign in with Google</ThemedText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => console.log('Apple sign in')}
                  style={({ pressed }) => [
                    styles.socialButton,
                    {
                      backgroundColor: socialButtonBackground,
                      borderColor,
                      shadowColor,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                >
                  <Image
                    source={require('@/assets/images/Apple.png')}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <ThemedText style={[styles.socialText, { color: mutedText }]}>Sign in with Apple</ThemedText>
                </Pressable>
              </View>

              <View style={styles.dividerRow}>
                <View style={[styles.divider, { backgroundColor: dividerColor }]} />
                <ThemedText style={[styles.dividerText, { color: mutedText }]}>or</ThemedText>
                <View style={[styles.divider, { backgroundColor: dividerColor }]} />
              </View>

              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: mutedText }]}>Username or email address*</ThemedText>
                <TextInput
                  value={form.identifier}
                  onChangeText={(v) => updateField('identifier', v)}
                  onFocus={() => setFocusedField('identifier')}
                  onBlur={() => setFocusedField((prev) => (prev === 'identifier' ? null : prev))}
                  autoCapitalize="none"
                  placeholder=""
                  placeholderTextColor={mutedText}
                  selectionColor={primaryButton}
                  style={[
                    styles.input,
                    webOutlineNone,
                    {
                      backgroundColor: inputBackground,
                      color: inputText,
                      borderColor: inputBorderFor('identifier'),
                    },
                  ]}
                />
              </View>

              <View style={styles.field}>
                <View style={styles.passwordRow}>
                  <ThemedText style={[styles.label, { color: mutedText }]}>Password*</ThemedText>
                  <Pressable onPress={() => console.log('Forgot password')}>
                    <ThemedText style={[styles.forgotLink, { color: linkColor }]}>Forgot password?</ThemedText>
                  </Pressable>
                </View>
                <TextInput
                  value={form.password}
                  onChangeText={(v) => updateField('password', v)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField((prev) => (prev === 'password' ? null : prev))}
                  autoCapitalize="none"
                  secureTextEntry
                  placeholder=""
                  placeholderTextColor={mutedText}
                  selectionColor={primaryButton}
                  style={[
                    styles.input,
                    webOutlineNone,
                    {
                      backgroundColor: inputBackground,
                      color: inputText,
                      borderColor: inputBorderFor('password'),
                    },
                  ]}
                />
              </View>

              {submitError ? <ThemedText style={{ color: linkColor }}>{submitError}</ThemedText> : null}

              <Pressable
                accessibilityRole="button"
                onPress={onSubmit}
                disabled={!canSubmit || loading}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: primaryButton,
                    shadowColor,
                    opacity: !canSubmit || loading ? 0.55 : pressed ? 0.9 : 1,
                  },
                ]}
              >
                <ThemedText style={[styles.primaryButtonText, { color: buttonText }]}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </ThemedText>
              </Pressable>

              <View style={styles.bottomRow}>
                <ThemedText style={{ color: mutedText }}>New to E.R.A.S? </ThemedText>
                <Pressable onPress={() => router.push('/signup')}>
                  <ThemedText style={[styles.createLink, { color: linkColor }]}>Create an account</ThemedText>
                </Pressable>
              </View>

              <View style={styles.sampleRow}>
                <Pressable onPress={handleUseSample} disabled={loading}>
                  <ThemedText style={[styles.sampleLink, { color: linkColor }]}>Use sample account</ThemedText>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backgroundImage: {
    opacity: 0.75,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 24,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 260,
    height: 200,
    marginBottom: -10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
  },
  socialSection: {
    gap: 12,
    marginTop: 18,
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: '100%',
    maxWidth: 320,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  field: {
    marginBottom: 18,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 25,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  primaryButton: {
    borderRadius: 30,
    width: '100%',
    maxWidth: 360,
    paddingVertical: 16,
    alignItems: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    alignSelf: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  createLink: {
    fontWeight: '600',
  },
  sampleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  sampleLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
