import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme';

export default function Login() {
  const { colors, spacing, typography } = useTheme();
  const { signIn, isSubmitting, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, flexGrow: 1, justifyContent: 'center' }}>
          <Text style={[typography.h1, { color: colors.text }]}>SCHOOLONE</Text>
          <Text style={[typography.body, { color: colors.textMuted, marginBottom: spacing.lg }]}>
            Tout pour l'enfant, en un seul endroit.
          </Text>

          <Input
            label="Adresse e-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input label="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />

          {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}

          <Button
            label="Se connecter"
            loading={isSubmitting}
            onPress={() => {
              clearError();
              signIn(email.trim(), password);
            }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
            <Link href="/(auth)/forgot-password">
              <Text style={{ color: colors.primary }}>Mot de passe oublié ?</Text>
            </Link>
            <Link href="/(auth)/register">
              <Text style={{ color: colors.primary }}>S'inscrire</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
