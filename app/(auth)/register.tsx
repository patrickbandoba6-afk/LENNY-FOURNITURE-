import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme';

export default function Register() {
  const { colors, spacing, typography } = useTheme();
  const { signUp, isSubmitting, error, clearError } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = () => {
    clearError();
    setLocalError(null);
    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas.');
      return;
    }
    signUp(email.trim(), password, fullName.trim());
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, flexGrow: 1, justifyContent: 'center' }}>
          <Text style={[typography.h1, { color: colors.text }]}>Créer un compte</Text>

          <Input label="Nom complet" value={fullName} onChangeText={setFullName} />
          <Input
            label="Adresse e-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input label="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
          <Input
            label="Confirmer le mot de passe"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {(localError || error) ? <Text style={{ color: colors.danger }}>{localError ?? error}</Text> : null}

          <Button label="S'inscrire" loading={isSubmitting} onPress={handleSubmit} />

          <Link href="/(auth)/login">
            <Text style={{ color: colors.primary, textAlign: 'center' }}>Déjà un compte ? Se connecter</Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
