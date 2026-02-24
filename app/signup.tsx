import React, { useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type FormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupScreen() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'icon');

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.password.length > 0 &&
      form.confirmPassword.length > 0
    );
  }, [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit() {
    setSubmitError(null);

    if (form.password !== form.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    // Frontend-only: wire this up to your auth backend later.
    console.log('Signup submit:', {
      fullName: form.fullName,
      email: form.email,
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={[styles.container, { backgroundColor }]}>
          <View style={styles.header}>
            <ThemedText type="title">Create account</ThemedText>
            <ThemedText>
              Sign up to get started.
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <ThemedText type="defaultSemiBold">Full name</ThemedText>
              <TextInput
                value={form.fullName}
                onChangeText={(v) => updateField('fullName', v)}
                autoCapitalize="words"
                placeholder="Jane Doe"
                placeholderTextColor={borderColor}
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor,
                    backgroundColor,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <ThemedText type="defaultSemiBold">Email</ThemedText>
              <TextInput
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="name@example.com"
                placeholderTextColor={borderColor}
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor,
                    backgroundColor,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <ThemedText type="defaultSemiBold">Password</ThemedText>
              <TextInput
                value={form.password}
                onChangeText={(v) => updateField('password', v)}
                autoCapitalize="none"
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={borderColor}
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor,
                    backgroundColor,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <ThemedText type="defaultSemiBold">Confirm password</ThemedText>
              <TextInput
                value={form.confirmPassword}
                onChangeText={(v) => updateField('confirmPassword', v)}
                autoCapitalize="none"
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={borderColor}
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor,
                    backgroundColor,
                  },
                ]}
              />
            </View>

            {submitError ? (
              <ThemedText style={{ color: tintColor }}>{submitError}</ThemedText>
            ) : null}

            <ThemedText style={styles.terms}>
              By creating an account, you agree to the terms of service.
            </ThemedText>

            <Pressable
              accessibilityRole="button"
              onPress={onSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: tintColor,
                  opacity: !canSubmit ? 0.5 : pressed ? 0.85 : 1,
                },
              ]}
            >
              <ThemedText style={[styles.buttonText, { color: backgroundColor }]}>
                Sign up
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    gap: 18,
  },
  header: {
    gap: 6,
  },
  form: {
    gap: 12,
  },
  field: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  terms: {
    marginTop: 4,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
