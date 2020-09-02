import { nonNullable } from "@neufund/shared-utils";
import { StyleSheet } from "react-native";

import { EPlatform, Platform } from "utils/Platform";

const customFonts = {
  robotoRegular: {
    fontFamily: "Roboto-Regular",
  },
  robotoMedium: {
    fontFamily: "Roboto-Medium",
  },
  montserratSemiBold: {
    fontFamily: "Montserrat-SemiBold",
  },
};

const fonts = nonNullable(
  Platform.select({
    [EPlatform.IOS]: {
      ...customFonts,
      systemDefaultMonospace: {
        fontFamily: "Menlo",
      },
    },
    [EPlatform.Android]: {
      ...customFonts,
      systemDefaultMonospace: {
        fontFamily: "monospace",
      },
    },
  }),
);

/**
 * Typography styles should match the design system typography.
 *
 * @note If there is not typography provided by the design-system then it should not be here
 *
 * @note `fontFamily`, `fontSize`, `lineHeight` and `letterSpacing` should never appear on the component level styles. A proper typography should be imported from `typographyStyles` instead.
 */
const typographyStyles = StyleSheet.create({
  headline1: {
    ...fonts.montserratSemiBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.3,
  },
  headline2: {
    ...fonts.montserratSemiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  headline3: {
    ...fonts.montserratSemiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  headline4: {
    ...fonts.montserratSemiBold,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.18,
  },
  headline5: {
    ...fonts.montserratSemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.16,
  },
  bodyBold: {
    ...fonts.robotoMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    ...fonts.robotoRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  textBold: {
    ...fonts.robotoMedium,
    fontSize: 14,
    lineHeight: 24,
  },
  text: {
    ...fonts.robotoRegular,
    fontSize: 14,
    lineHeight: 24,
  },
  helperText: {
    ...fonts.robotoRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  menuLabel: {
    ...fonts.robotoRegular,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  menuLabelBold: {
    ...fonts.robotoMedium,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  code: {
    ...fonts.systemDefaultMonospace,
    fontSize: 14,
    lineHeight: 24,
  },
});

export { typographyStyles };
