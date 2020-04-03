import { StyleSheet } from "react-native";

export const spacing1 = 4;
export const spacing2 = spacing1 * 2; // 8
export const spacing3 = spacing2 * 2; // 16
export const spacing4 = spacing2 * 3; // 24
export const spacing5 = spacing2 * 4; // 32

export const spacingStyles = StyleSheet.create({
  mb1: {
    marginBottom: spacing1,
  },
  mb2: {
    marginBottom: spacing2,
  },
  mt2: {
    marginTop: spacing2,
  },
  mb3: {
    marginBottom: spacing3,
  },
  mb4: {
    marginBottom: spacing4,
  },
  pt1: {
    paddingTop: spacing1,
  },
  p3: {
    padding: spacing3,
  },
  p4: {
    padding: spacing4,
  },
  ph4: {
    paddingHorizontal: spacing4,
  },
});
