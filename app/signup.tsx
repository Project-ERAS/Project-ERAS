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
  email: string;
  password: string;
  username: string;
};

export default function SignupScreen() {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    username: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<keyof FormState | null>(null);

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
    return (
      form.email.trim().length > 0 &&
      form.password.length > 0 &&
      form.username.trim().length > 0
    );
  }, [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit() {
    setSubmitError(null);

    // Frontend-only: wire this up to your auth backend later.
    console.log('Signup submit:', {
      email: form.email,
      username: form.username,
    });
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
                <ThemedText style={[styles.headerTitle, { color: mutedText }]}>
                  Sign up for E.R.A.S
                </ThemedText>
              </View>

            <View style={styles.socialSection}>
              <Pressable
                accessibilityRole="button"
                onPress={() => console.log('Google signup')}
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
                <ThemedText style={[styles.socialText, { color: mutedText }]}>Sign up with Google</ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => console.log('Apple signup')}
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
                <ThemedText style={[styles.socialText, { color: mutedText }]}>Sign up with Apple</ThemedText>
              </Pressable>
            </View>

            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: dividerColor }]} />
              <ThemedText style={[styles.dividerText, { color: mutedText }]}>or</ThemedText>
              <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            </View>

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: mutedText }]}>Email*</ThemedText>
              <TextInput
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField((prev) => (prev === 'email' ? null : prev))}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder=""
                placeholderTextColor={mutedText}
                selectionColor={primaryButton}
                style={[
                  styles.input,
                  webOutlineNone,
                  {
                    backgroundColor: inputBackground,
                    color: inputText,
                    borderColor: inputBorderFor('email'),
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: mutedText }]}>Password*</ThemedText>
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

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: mutedText }]}>Username*</ThemedText>
              <TextInput
                value={form.username}
                onChangeText={(v) => updateField('username', v)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField((prev) => (prev === 'username' ? null : prev))}
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
                    borderColor: inputBorderFor('username'),
                  },
                ]}
              />
            </View>

            {submitError ? (
              <ThemedText style={{ color: linkColor }}>{submitError}</ThemedText>
            ) : null}

            <ThemedText style={[styles.terms, { color: mutedText }]}>
              By creating an account, you agree to the terms of service. For more information about E.R.A.S
              information, see the project info page. We’ll occasionally send you updates through email.
            </ThemedText>

            <Pressable
              accessibilityRole="button"
              onPress={onSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: primaryButton,
                  shadowColor,
                  opacity: !canSubmit ? 0.55 : pressed ? 0.9 : 1,
                },
              ]}
            >
              <ThemedText style={[styles.primaryButtonText, { color: buttonText }]}>
                Create Account {'>'}
              </ThemedText>
            </Pressable>

            <View style={styles.signInRow}>
              <ThemedText style={{ color: mutedText }}>Already have an account? </ThemedText>
              <Pressable onPress={() => console.log('Sign in')}>
                <ThemedText style={[styles.signInLink, { color: linkColor }]}>Sign in</ThemedText>
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
  input: {
    borderWidth: 1,
    borderRadius: 25,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  terms: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 20,
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
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  signInLink: {
    fontWeight: '600',
  },
});
