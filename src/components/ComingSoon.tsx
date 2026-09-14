import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { useTheme } from '@/theme';

interface ComingSoonProps {
  title: string;
  description?: string;
}

/**
 * Honest placeholder for screens whose real implementation lands in a later
 * phase (see PROMPT_CLAUDE_CODE_SCHOOLONE.txt phases 2-9). Never wired to
 * fake data or non-functional buttons.
 */
export function ComingSoon({ title, description = 'Cette fonctionnalité arrive dans une prochaine phase.' }: ComingSoonProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState title={title} description={description} />
      </View>
    </SafeAreaView>
  );
}
