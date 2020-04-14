import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import { appRoutes } from "../../appRoutes";
import { initActions } from "../../modules/init/actions";
import { selectInitStatus, selectTest } from "../../modules/init/selectors";
import { walletConnectModuleApi } from "../../modules/wallet-connect/module";
import { appConnect } from "../../store/utils";
import { silverLighter2 } from "../../styles/colors";
import { Button, EButtonLayout } from "../shared/buttons/Button";

type TDispatchProps = {
  init: () => void;
  walletConnectDisconnect: (peerId: string) => void;
};

type TStateProps = {
  initStatus: ReturnType<typeof selectInitStatus>;
  test: ReturnType<typeof selectTest>;
  walletConnectPeer: ReturnType<typeof walletConnectModuleApi.selectors.selectWalletConnectPeer>;
};

const HomeLayout: React.FunctionComponent<TDispatchProps & TStateProps> = ({
  init,
  initStatus,
  test,
  walletConnectPeer,
  walletConnectDisconnect,
}) => {
  const navigation = useNavigation();

  React.useEffect(() => {
    init();
  }, []);

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

      <Text>Home {test && test.name}</Text>

      <Text>Init status: {initStatus}</Text>

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
    </SafeAreaView>
  );
};

const HomeScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    initStatus: selectInitStatus(state),
    walletConnectPeer: walletConnectModuleApi.selectors.selectWalletConnectPeer(state),
    test: selectTest(state),
  }),
  dispatchToProps: dispatch => ({
    init: () => dispatch(initActions.start()),
    walletConnectDisconnect: (peerId: string) =>
      dispatch(walletConnectModuleApi.actions.disconnectFromPeer(peerId)),
  }),
})(HomeLayout);

export { HomeScreen };
