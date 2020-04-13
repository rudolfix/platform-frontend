import { assertNever } from "@neufund/shared-utils";
import * as React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import Home from "../../assets/home.svg";
import Investments from "../../assets/investments.svg";
import Profile from "../../assets/profile.svg";
import Wallet from "../../assets/wallet.svg";
import Close from "../../assets/close.svg";
import Placeholder from "../../assets/placeholder.svg";
import Yes from "../../assets/yes.svg";

enum EIconType {
  HOME = "home",
  PORTFOLIO = "portf",
  PROFILE = "profile",
  WALLET = "wallet",
  CLOSE = "close",
  PLACEHOLDER = "placeholder",
  YES = "yes",
}

const getIcon = (type: EIconType) => {
  switch (type) {
    case EIconType.HOME:
      return Home;
    case EIconType.PORTFOLIO:
      return Investments;
    case EIconType.PROFILE:
      return Profile;
    case EIconType.WALLET:
      return Wallet;
    case EIconType.CLOSE:
      return Close;
    case EIconType.PLACEHOLDER:
      return Placeholder;
    case EIconType.YES:
      return Yes;
    default:
      assertNever(type, `Invalid icon type ${type}`);
  }
};

type TSvgIconProps = React.ComponentProps<ReturnType<typeof getIcon>>;

type TExternalProps = {
  type: EIconType;
  style: StyleProp<{ color?: string } & ViewStyle>;
} & Omit<TSvgIconProps, "style" | "color">;

/**
 * A wrapper component which provides access to our a predefined list of icons by `type` prop
 */
const Icon: React.FunctionComponent<TExternalProps> = ({ type, style, ...props }) => {
  const Component = getIcon(type);

  // extract color from styles so all styles are consistently provided though styles
  const { color, ...styleWithoutColor } = StyleSheet.flatten(style);

  return <Component {...props} color={color} style={styleWithoutColor} />;
};

export { Icon, EIconType };
