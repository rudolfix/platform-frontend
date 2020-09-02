/* eslint-disable @typescript-eslint/no-magic-numbers */
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
  m4: {
    margin: spacing4,
  },
  m5: {
    margin: spacing5,
  },
  mh4: {
    marginHorizontal: spacing4,
  },
  mv3: {
    marginVertical: spacing3,
  },
  mv4: {
    marginVertical: spacing4,
  },

  mv5: {
    marginVertical: spacing5,
  },
  mb1: {
    marginBottom: spacing1,
  },
  mb2: {
    marginBottom: spacing2,
  },
  mt1: {
    marginTop: spacing1,
  },
  mt2: {
    marginTop: spacing2,
  },
  mt3: {
    marginTop: spacing3,
  },
  mt4: {
    marginTop: spacing4,
  },
  mt5: {
    marginTop: spacing5,
  },
  mt7: {
    marginTop: spacing7,
  },
  mb3: {
    marginBottom: spacing3,
  },
  mb4: {
    marginBottom: spacing4,
  },
  mb5: {
    marginBottom: spacing5,
  },
  mb6: {
    marginBottom: spacing6,
  },
  ml2: {
    marginLeft: spacing2,
  },
  ml3: {
    marginLeft: spacing3,
  },
  ml4: {
    marginLeft: spacing4,
  },
  ml5: {
    marginLeft: spacing5,
  },
  mr1: {
    marginRight: spacing1,
  },
  mr2: {
    marginRight: spacing2,
  },
  mr3: {
    marginRight: spacing3,
  },
  mr4: {
    marginRight: spacing4,
  },
  p1: {
    padding: spacing1,
  },
  p2: {
    padding: spacing2,
  },
  p3: {
    padding: spacing3,
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
  ph3: {
    paddingHorizontal: spacing3,
  },
  ph4: {
    paddingHorizontal: spacing4,
  },
  pv2: {
    paddingVertical: spacing2,
  },
  pv4: {
    paddingVertical: spacing4,
  },
  pv5: {
    paddingVertical: spacing5,
  },
  ph5: {
    paddingHorizontal: spacing5,
  },
  pl4: {
    paddingLeft: spacing4,
  },
  pr2: {
    paddingRight: spacing2,
  },
  pr4: {
    paddingRight: spacing4,
  },
});
