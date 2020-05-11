import { nonNullable } from "@neufund/shared-utils";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Config from "react-native-config";

import { appRoutes } from "../../appRoutes";
import { authModuleAPI } from "modules/auth/module";
import { walletConnectModuleApi } from "modules/wallet-connect/module";
import { appConnect } from "store/utils";
import { spacingStyles } from "styles/spacings";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { EIconType } from "../shared/Icon";
import { SafeAreaScreen } from "../shared/Screen";
import { AddressShare } from "./AddressShare";
import { Avatar } from "./Avatar";
import { Menu, EMenuItemType } from "../shared/menu/Menu";

type TStateProps = {
  authWallet: NonNullable<ReturnType<typeof authModuleAPI.selectors.selectAuthWallet>>;
  walletConnectPeer: ReturnType<typeof walletConnectModuleApi.selectors.selectWalletConnectPeer>;
};

type TDispatchProps = {
  logout: () => void;
  walletConnectDisconnect: (peerId: string) => void;
};

type TMenuProps = React.ComponentProps<typeof Menu>;

const ProfileLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  authWallet,
  walletConnectPeer,
  walletConnectDisconnect,
  logout,
}) => {
  const navigation = useNavigation();

  const items = React.useMemo(() => {
    const defaultItems: TMenuProps["items"] = [];

    if (Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost") {
      return defaultItems.concat([
        {
          id: "switch-account",
          type: EMenuItemType.BUTTON,
          heading: "Switch account",
          helperText: authWallet.name,
          icon: EIconType.WALLET,
          onPress: () => navigation.navigate(appRoutes.switchAccount),
        },
      ]);
    }

    return defaultItems;
  }, []);

  return (
    <SafeAreaScreen forceTopInset={true}>
      <View style={styles.menuHeader}>
        <Avatar name={authWallet.name} />

        <AddressShare address={authWallet.address} style={styles.addressShare} />
      </View>

      <Menu items={items} />

      <Text>Wallet connect peer: </Text>
      {walletConnectPeer ? (
        <>
          <Text>{JSON.stringify(walletConnectPeer, undefined, 2)}</Text>
          <Button
            layout={EButtonLayout.PRIMARY}
            onPress={() => walletConnectDisconnect(walletConnectPeer.id)}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <Text>not connected</Text>
      )}

      <Button layout={EButtonLayout.TEXT} testID="dashboard.logout" onPress={logout}>
        Logout
      </Button>
    </SafeAreaScreen>
  );
};

const styles = StyleSheet.create({
  menuHeader: {
    ...spacingStyles.mh4,
    ...spacingStyles.mv5,
  },
  addressShare: {
    ...spacingStyles.mt5,
  },
});

const ProfileScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authWallet: nonNullable(authModuleAPI.selectors.selectAuthWallet(state)),
    walletConnectPeer: walletConnectModuleApi.selectors.selectWalletConnectPeer(state),
  }),
  dispatchToProps: dispatch => ({
    walletConnectDisconnect: (peerId: string) =>
      dispatch(walletConnectModuleApi.actions.disconnectFromPeer(peerId)),
    logout: () => dispatch(authModuleAPI.actions.logout()),
  }),
})(ProfileLayout);

export { ProfileScreen };
