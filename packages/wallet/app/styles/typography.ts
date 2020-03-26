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
  button: {
    ...fonts.robotoMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  text: {
    ...fonts.robotoRegular,
    fontSize: 14,
    lineHeight: 24,
  },
});

export { typographyStyles };
