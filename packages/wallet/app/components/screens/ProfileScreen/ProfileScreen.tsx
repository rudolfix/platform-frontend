import { kycApi } from "@neufund/shared-modules";
import { nonNullable } from "@neufund/shared-utils";
import React from "react";
import Config from "react-native-config";

import { EIconType } from "components/shared/Icon";
import { EStatusBarStyle, SafeAreaScreen } from "components/shared/Screen";
import { Menu, EMenuItemType } from "components/shared/menu/Menu";

import { authModuleAPI } from "modules/auth/module";
import { walletConnectModuleApi } from "modules/wallet-connect/module";

import { EAppRoutes } from "router/appRoutes";
import { useNavigationTyped } from "router/routeUtils";

import { appConnect } from "store/utils";

import { baseRed } from "styles/colors";

import { Header } from "./Header/Header";

type TStateProps = {
  clientName: ReturnType<typeof kycApi.selectors.selectClientName>;
  isUserVerified: ReturnType<typeof kycApi.selectors.selectIsUserVerifiedOnBlockchain>;
  authWallet: NonNullable<ReturnType<typeof authModuleAPI.selectors.selectAuthWallet>>;
  walletConnectPeer: ReturnType<typeof walletConnectModuleApi.selectors.selectWalletConnectPeer>;
};

type TDispatchProps = {
  logout: () => void;
};

type TMenuProps = React.ComponentProps<typeof Menu>;

const ProfileLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  authWallet,
  walletConnectPeer,
  logout,
  isUserVerified,
  clientName,
}) => {
  const navigation = useNavigationTyped();

  const items = React.useMemo(() => {
    const defaultItems: TMenuProps["items"] = [
      {
        id: "account-verification",
        type: EMenuItemType.INFORMATIVE,
        heading: "Account verification",
        helperText: isUserVerified ? "Verified" : "Not verified",
        icon: EIconType.CHECKLIST,
      },
      {
        id: "account-backup",
        type: EMenuItemType.NAVIGATION,
        heading: "Account backup",
        icon: EIconType.LOCK,
        onPress: () => navigation.navigate(EAppRoutes.accountBackup),
      },
      {
        id: "wallet-connect-session",
        type: EMenuItemType.NAVIGATION,
        heading: "Neufund Web",
        helperText: walletConnectPeer ? "Connected" : "Not connected",
        icon: EIconType.DEVICE,
        onPress: () => navigation.navigate(EAppRoutes.walletConnectSession),
      },
    ];

    // Switch account and logout are only useful with localhost artifacts
    if (Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost") {
      defaultItems.push(
        {
          id: "switch-account",
          type: EMenuItemType.NAVIGATION,
          heading: "Switch account",
          helperText: authWallet.name,
          icon: EIconType.WALLET,
          onPress: () => navigation.navigate(EAppRoutes.switchToFixture),
        },
        {
          id: "logout-account",
          type: EMenuItemType.BUTTON,
          heading: "Logout",
          icon: EIconType.LOGOUT,
          onPress: logout,
          color: baseRed,
        },
      );
    }

    return defaultItems;
  }, [authWallet, navigation, walletConnectPeer, logout, isUserVerified]);

  return (
    <SafeAreaScreen topInset statusBarStyle={EStatusBarStyle.WHITE}>
      <Header name={clientName ?? authWallet.name} address={authWallet.address} />

      <Menu items={items} />
    </SafeAreaScreen>
  );
};

const ProfileScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    clientName: kycApi.selectors.selectClientName(state),
    isUserVerified: kycApi.selectors.selectIsUserVerifiedOnBlockchain(state),
    authWallet: nonNullable(authModuleAPI.selectors.selectAuthWallet(state)),
    walletConnectPeer: walletConnectModuleApi.selectors.selectWalletConnectPeer(state),
  }),
  dispatchToProps: dispatch => ({
    logout: () => dispatch(authModuleAPI.actions.logout()),
  }),
})(ProfileLayout);

export { ProfileScreen };
