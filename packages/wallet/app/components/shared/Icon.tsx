import { assertNever } from "@neufund/shared-utils";
import Close from "assets/close.svg";
import Home from "assets/home.svg";
import Investments from "assets/investments.svg";
import Placeholder from "assets/placeholder.svg";
import Profile from "assets/profile.svg";
import QrCode from "assets/qr-code.svg";
import RightArrow from "assets/right-arrow.svg";
import Share from "assets/share.svg";

import Eth from "assets/tokens/eth.svg";
import NEur from "assets/tokens/n-eur.svg";
import Wallet from "assets/wallet.svg";
import Yes from "assets/yes.svg";
import identity from "lodash/fp/identity";
import pickBy from "lodash/fp/pickBy";
import * as React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

enum EIconType {
  HOME = "home",
  PORTFOLIO = "portf",
  PROFILE = "profile",
  SHARE = "share",
  WALLET = "wallet",
  CLOSE = "close",
  PLACEHOLDER = "placeholder",
  RIGHT_ARROW = "right-arrow",
  YES = "yes",
  N_EUR = "n-eur",
  ETH = "eth",
  QR_CODE = "qr-code",
}

const pickByIdentity = pickBy(identity);

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
    case EIconType.SHARE:
      return Share;
    case EIconType.RIGHT_ARROW:
      return RightArrow;
    case EIconType.YES:
      return Yes;
    case EIconType.ETH:
      return Eth;
    case EIconType.N_EUR:
      return NEur;
    case EIconType.QR_CODE:
      return QrCode;
    default:
      assertNever(type, `Invalid icon type ${type}`);
  }
};

type TSvgIconProps = React.ComponentProps<ReturnType<typeof getIcon>>;

type TExternalProps = {
  type: EIconType;
  style?: StyleProp<{ color?: string } & ViewStyle>;
} & Omit<TSvgIconProps, "style" | "color" | "width" | "height">;

/**
 * A wrapper component which provides access to our a predefined list of icons by `type` prop
 */
const Icon: React.FunctionComponent<TExternalProps> = ({ type, style, ...props }) => {
  const Component = getIcon(type);

  // extract color from styles so all styles are consistently provided though styles
  const { color, width, height, ...styleWithoutColor } = StyleSheet.flatten(style);

  const customProps = pickByIdentity({
    width,
    height,
    color,
  });

  return <Component {...props} {...customProps} style={styleWithoutColor} />;
};

export { Icon, EIconType };
