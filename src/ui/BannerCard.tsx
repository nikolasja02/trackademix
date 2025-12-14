import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

type Props = {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function BannerCard({ title, children, style }: Props) {
  return (
    <View style={[styles.banner, style]}>
      <Text style={styles.bannerTitle}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#eef6ff",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
  },
  bannerTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  body: {
    gap: 4,
  },
});
