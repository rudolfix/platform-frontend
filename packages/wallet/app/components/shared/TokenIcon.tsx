import * as React from "react";
import { StyleSheet, Image } from "react-native";

type TImageProps = React.ComponentProps<typeof Image>;

type TExternalProps = TImageProps;

const TOKEN_ICON_SIZE = 32;

/**
 * A wrapper component which provides access to an externally provided token icons
 */
const TokenIcon: React.FunctionComponent<TExternalProps> = ({ style, ...props }) => {
  return <Image {...props} style={[styles.tokenIcon, style]} />;
};

const styles = StyleSheet.create({
  tokenIcon: {
    width: TOKEN_ICON_SIZE,
    height: TOKEN_ICON_SIZE,
    borderRadius: TOKEN_ICON_SIZE / 2,
    resizeMode: "contain",
  },
});

export { TokenIcon };
