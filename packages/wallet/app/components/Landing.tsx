import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { appRoutes } from "../appRoutes";
import { walletConnectModuleApi } from "../modules/wallet-connect/module";
import { Button } from "./shared/buttons/Button";
import { initActions } from "../modules/init/actions";
import { selectInitStatus, selectTest } from "../modules/init/selectors";
import { appConnect } from "../store/utils";

type TDispatchProps = {
  init: () => void;
  walletConnectDisconnect: (peerId: string) => void;
};

type TStateProps = {
  initStatus: ReturnType<typeof selectInitStatus>;
  test: ReturnType<typeof selectTest>;
  walletConnectPeer: ReturnType<typeof walletConnectModuleApi.selectors.selectWalletConnectPeer>;
};

const LandingLayout: React.FunctionComponent<TDispatchProps & TStateProps> = ({
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
    <View>
      <Text>Landing {test && test.name}</Text>

      <Text>Init status: {initStatus}</Text>

      <Text>Wallet connect peer: </Text>
      {walletConnectPeer ? (
        <>
          <Text>{JSON.stringify(walletConnectPeer, undefined, 2)}</Text>
          <Button
            title="Disconnect"
            onPress={() => walletConnectDisconnect(walletConnectPeer.id)}
          />
        </>
      ) : (
        <Text>not connected</Text>
      )}

      <Button
        testID="landing.go-to-import-your-wallet"
        title="Import your wallet"
        onPress={() => navigation.navigate(appRoutes.importWallet)}
      />

      <Button
        testID="landing.go-to-qr-code-scanner"
        title="Scan QR code"
        onPress={() => navigation.navigate(appRoutes.qrCode)}
      />
    </View>
  );
};

const Landing = appConnect<TStateProps, TDispatchProps>({
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
})(LandingLayout);

export { Landing };
