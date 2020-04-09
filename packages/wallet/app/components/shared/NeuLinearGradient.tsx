import React from "react";
import LinearGradient from "react-native-linear-gradient";

import { useTheme } from "../../themes/ThemeProvider";

type TExternalProps = Omit<React.ComponentProps<typeof LinearGradient>, "colors">;

/**
 * A neufund style linear gradient used across components
 */
const NeuLinearGradient: React.FunctionComponent<TExternalProps> = ({ ...props }) => {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={[colors.accent.blueGrayDarker, colors.accent.blueGrayDarker2]}
      {...props}
    />
  );
};

export { NeuLinearGradient };
