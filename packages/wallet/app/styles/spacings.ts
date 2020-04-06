import { StyleSheet } from "react-native";

export const spacing1 = 4;
export const spacing2 = spacing1 * 2;
export const spacing3 = spacing2 * 2;
export const spacing4 = spacing2 * 3;
export const spacing5 = spacing2 * 4;

export const spacingStyles = StyleSheet.create({
  mb1: {
    marginBottom: spacing1,
  },
  mb2: {
    marginBottom: spacing2,
  },
  mb3: {
    marginBottom: spacing3,
  },
  pt1: {
    paddingTop: spacing1,
  },
  p4: {
    padding: spacing4,
  },
  ph4: {
    paddingHorizontal: spacing4,
  },
});
