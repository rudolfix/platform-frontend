import { HomeScreen } from "./components/home/HomeScreen";
import { Portfolio } from "./components/Portfolio";
import { Profile } from "./components/Profile";
import { EIconType } from "./components/shared/Icon";
import { Wallet } from "./components/Wallet";

const appRoutes = {
  // unauthorized routes
  createWallet: "CreateWallet",
  importWallet: "ImportWallet",
  unlockWallet: "UnlockWallet",
  switchAccount: "SwitchAccount",

  // authorized routes
  home: "Home",
  portfolio: "Portfolio",
  wallet: "Wallet",
  profile: "Profile",
  qrCode: "QRCode",
};

const tabConfig = [
  {
    name: "Home",
    route: appRoutes.home,
    component: HomeScreen,
    icon: EIconType.HOME,
  },
  {
    name: "Portfolio",
    route: appRoutes.portfolio,
    component: Portfolio,
    icon: EIconType.PORTFOLIO,
  },
  {
    name: "Wallet",
    route: appRoutes.wallet,
    component: Wallet,
    icon: EIconType.WALLET,
  },
  {
    name: "Profile",
    route: appRoutes.profile,
    component: Profile,
    icon: EIconType.PROFILE,
  },
];

export { appRoutes, tabConfig };
