import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme';

export function SearchBar({ style, ...rest }: TextInputProps) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.full,
          paddingHorizontal: spacing.lg,
        },
      ]}
    >
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[typography.body, { color: colors.text, flex: 1, paddingVertical: spacing.sm + 4 }, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
