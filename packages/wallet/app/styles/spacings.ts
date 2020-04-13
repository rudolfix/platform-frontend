import { StyleSheet } from "react-native";

export const spacing1 = 4;
export const spacing2 = spacing1 * 2; // 8
export const spacing3 = spacing1 * 3; // 12
export const spacing4 = spacing2 * 2; // 16
export const spacing5 = spacing2 * 3; // 24
export const spacing6 = spacing2 * 4; // 32
export const spacing7 = spacing5 * 2; // 48
export const spacing8 = spacing6 * 2; // 64

export const spacingStyles = StyleSheet.create({
  // TODO: Generate all variants automatically (padding+margin full,horizontal,vertical,each side)
  mv4: {
    marginVertical: spacing4,
  },
  mb1: {
    marginBottom: spacing1,
  },
  mb2: {
    marginBottom: spacing2,
  },
  mt2: {
    marginTop: spacing2,
  },
  mb4: {
    marginBottom: spacing4,
  },
  mb5: {
    marginBottom: spacing5,
  },
  mr3: {
    marginRight: spacing3,
  },
  p4: {
    padding: spacing4,
  },
  p5: {
    padding: spacing5,
  },
  pt1: {
    paddingTop: spacing1,
  },
  pt2: {
    paddingTop: spacing2,
  },
  pt4: {
    paddingTop: spacing4,
  },
  ph2: {
    paddingHorizontal: spacing2,
  },
  ph5: {
    paddingHorizontal: spacing5,
  },
});
