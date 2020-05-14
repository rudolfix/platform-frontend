import { nonNullable } from "@neufund/shared-utils";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import { appRoutes } from "../../appRoutes";
import { authModuleAPI } from "../../modules/auth/module";
import { walletConnectModuleApi } from "../../modules/wallet-connect/module";
import { appConnect } from "../../store/utils";
import { silverLighter2 } from "../../styles/colors";
import { Button, EButtonLayout } from "../shared/buttons/Button";

type TDispatchProps = {
  logout: () => void;
  walletConnectDisconnect: (peerId: string) => void;
};

type TStateProps = {
  user: NonNullable<ReturnType<typeof authModuleAPI.selectors.selectUser>>;
  walletConnectPeer: ReturnType<typeof walletConnectModuleApi.selectors.selectWalletConnectPeer>;
};

const HomeLayout: React.FunctionComponent<TDispatchProps & TStateProps> = ({
  walletConnectPeer,
  walletConnectDisconnect,
  user,
  logout,
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ backgroundColor: silverLighter2, flex: 1 }}>
      <View>
        <Button
          layout={EButtonLayout.PRIMARY}
          testID="landing.go-to-qr-code-scanner"
          onPress={() => navigation.navigate(appRoutes.qrCode)}
        >
          Scan QR code
        </Button>
      </View>

      <Text>Address: {user.userId}</Text>

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
    </SafeAreaView>
  );
};

const HomeScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    walletConnectPeer: walletConnectModuleApi.selectors.selectWalletConnectPeer(state),
    user: nonNullable(authModuleAPI.selectors.selectUser(state)),
  }),
  dispatchToProps: dispatch => ({
    walletConnectDisconnect: (peerId: string) =>
      dispatch(walletConnectModuleApi.actions.disconnectFromPeer(peerId)),
    logout: () => dispatch(authModuleAPI.actions.logout()),
  }),
})(HomeLayout);

export { HomeScreen };
