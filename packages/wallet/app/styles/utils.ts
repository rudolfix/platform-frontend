import { FlexStyle } from "react-native";

/**
 * Calculates top padding for the given style object
 */
export const getTopPadding = (styles: Partial<FlexStyle>) =>
  Number(styles.paddingTop || styles.padding || 0);
