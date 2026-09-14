import { useState } from 'react';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme';

export default function ForgotPassword() {
  const { colors, spacing, typography } = useTheme();
  const { requestPasswordReset, isSubmitting, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, flexGrow: 1, justifyContent: 'center' }}>
        <Text style={[typography.h1, { color: colors.text }]}>Mot de passe oublié</Text>
        <Text style={[typography.body, { color: colors.textMuted }]}>
          Saisissez votre e-mail pour recevoir un lien de réinitialisation.
        </Text>

        <Input
          label="Adresse e-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
        {sent ? <Text style={{ color: colors.success }}>Lien envoyé si ce compte existe.</Text> : null}

        <Button
          label="Envoyer le lien"
          loading={isSubmitting}
          onPress={async () => {
            clearError();
            await requestPasswordReset(email.trim());
            setSent(true);
          }}
        />

        <Link href="/(auth)/login">
          <Text style={{ color: colors.primary, textAlign: 'center' }}>Retour à la connexion</Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
