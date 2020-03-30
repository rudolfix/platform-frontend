import { Platform, StyleSheet } from "react-native";

const fonts = Platform.select({
  default: {
    robotoRegular: {
      fontFamily: "Roboto-Regular",
    },
    robotoMedium: {
      fontFamily: "Roboto-Medium",
    },
  },
});

const typographyStyles = StyleSheet.create({
  label: {
    ...fonts.robotoMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  textInput: {
    ...fonts.robotoRegular,
    fontSize: 16,
    lineHeight: 20,
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
});

export { typographyStyles };
