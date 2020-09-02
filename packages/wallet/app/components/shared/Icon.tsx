import identity from "lodash/fp/identity";
import pickBy from "lodash/fp/pickBy";
import * as React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import Backup from "assets/backup.svg";
import Checklist from "assets/checklist.svg";
import Close from "assets/close.svg";
import Device from "assets/device.svg";
import Home from "assets/home.svg";
import OfflineMode from "assets/illustration_offline_mode.svg";
import Investments from "assets/investments.svg";
import Lock from "assets/lock.svg";
import Logout from "assets/logout.svg";
import Pending from "assets/pending.svg";
import Placeholder from "assets/placeholder.svg";
import Profile from "assets/profile.svg";
import QrCode from "assets/qr-code.svg";
import RightArrow from "assets/right-arrow.svg";
import Share from "assets/share.svg";
import Eth from "assets/tokens/eth.svg";
import Icbm from "assets/tokens/icbm.svg";
import NEur from "assets/tokens/n-eur.svg";
import Neu from "assets/tokens/neu.svg";
import Wallet from "assets/wallet.svg";
import Yes from "assets/yes.svg";

enum EIconType {
  BACKUP = "backup",
  CHECKLIST = "Checklist",
  CLOSE = "close",
  DEVICE = "device",
  ETH = "eth",
  HOME = "home",
  ICBM = "icbm",
  LOCK = "lock",
  LOGOUT = "logout",
  NEU = "neu",
  N_EUR = "n-eur",
  OFFLINE_MODE = "offline-mode",
  PENDING = "pending",
  PLACEHOLDER = "placeholder",
  PORTFOLIO = "portf",
  PROFILE = "profile",
  QR_CODE = "qr-code",
  RIGHT_ARROW = "right-arrow",
  SHARE = "share",
  WALLET = "wallet",
  YES = "yes",
}

const pickByIdentity = pickBy(identity);

const icons: Record<EIconType, typeof Close> = {
  [EIconType.BACKUP]: Backup,
  [EIconType.CHECKLIST]: Checklist,
  [EIconType.CLOSE]: Close,
  [EIconType.DEVICE]: Device,
  [EIconType.ETH]: Eth,
  [EIconType.HOME]: Home,
  [EIconType.ICBM]: Icbm,
  [EIconType.LOCK]: Lock,
  [EIconType.LOGOUT]: Logout,
  [EIconType.NEU]: Neu,
  [EIconType.N_EUR]: NEur,
  [EIconType.OFFLINE_MODE]: OfflineMode,
  [EIconType.PENDING]: Pending,
  [EIconType.PLACEHOLDER]: Placeholder,
  [EIconType.PORTFOLIO]: Investments,
  [EIconType.PROFILE]: Profile,
  [EIconType.QR_CODE]: QrCode,
  [EIconType.RIGHT_ARROW]: RightArrow,
  [EIconType.SHARE]: Share,
  [EIconType.WALLET]: Wallet,
  [EIconType.YES]: Yes,
};

type TSvgIconProps = React.ComponentProps<typeof Close>;

type TExternalProps = {
  type: EIconType;
  style?: StyleProp<{ color?: string } & ViewStyle>;
} & Omit<TSvgIconProps, "style" | "color" | "width" | "height">;

/**
 * A wrapper component which provides access to our a predefined list of icons by `type` prop
 */
const Icon: React.FunctionComponent<TExternalProps> = ({ type, style, ...props }) => {
  const Component = icons[type];

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
