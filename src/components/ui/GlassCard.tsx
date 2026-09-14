import { StyleSheet, View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { futuristic, radius } from "@/constants/theme";

export function GlassCard({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.wrapper, style]} {...rest}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: futuristic.glassBorder,
  },
  overlay: {
    backgroundColor: futuristic.glass,
    padding: 16,
  },
});
