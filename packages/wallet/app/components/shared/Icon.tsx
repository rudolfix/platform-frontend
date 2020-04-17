import { assertNever } from "@neufund/shared-utils";
import * as React from "react";

import Home from "../../assets/home.svg";
import Investments from "../../assets/investments.svg";
import Profile from "../../assets/profile.svg";
import Wallet from "../../assets/wallet.svg";
import Close from "../../assets/close.svg";

enum EIconType {
  HOME = "home",
  PORTFOLIO = "portf",
  PROFILE = "profile",
  WALLET = "wallet",
  CLOSE = "close",
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
    default:
      assertNever(type, `Invalid icon type ${type}`);
  }
};

type TExternalProps = {
  type: EIconType;
} & React.ComponentProps<ReturnType<typeof getIcon>>;

/**
 * A wrapper component which provides access to our a predefined list of icons by `type` prop
 */
const Icon: React.FunctionComponent<TExternalProps> = ({ type, ...props }) => {
  const Component = getIcon(type);

  return <Component {...props} />;
};

export { Icon, EIconType };
