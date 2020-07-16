import React from "react";
import { Platform, View } from "react-native";

import { st } from "components/utils";

import { shadowStyles } from "styles/common";

const Shadow2: React.FunctionComponent<React.ComponentProps<typeof View>> = ({
  style,
  children,
  ...props
}) => {
  // `opacity` is not supported when `elevation` is set
  const opacitySupported = Platform.OS !== "android";

  return (
    <View style={st(shadowStyles.s2, style, [!opacitySupported, { opacity: 1 }])} {...props}>
      {children}
    </View>
  );
};

export { Shadow2 };
