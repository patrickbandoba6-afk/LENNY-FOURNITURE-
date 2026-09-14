import { Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GlowBadgeProps {
  icon: string;
  colors: [string, string];
  size?: number;
}

export function GlowBadge({ icon, colors, size = 52 }: GlowBadgeProps) {
  return (
    <View
      style={[
        styles.wrapper,
        { shadowColor: colors[1], width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: size / 2 }]}
      >
        <Text style={{ fontSize: size * 0.44 }}>{icon}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
