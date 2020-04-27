import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, Text } from "react-native";
import { appRoutes } from "../../appRoutes";

import { walletConnectModuleApi } from "../../modules/wallet-connect/module";
import { appConnect } from "../../store/utils";
import { baseRed, grayLighter2 } from "../../styles/colors";
import { spacingStyles } from "../../styles/spacings";
import { Link } from "../shared/Link";
import { SafeAreaScreen } from "../shared/Screen";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { BodyText } from "../shared/typography/BodyText";

type TStateProps = {
  walletConnectPeer: ReturnType<typeof walletConnectModuleApi.selectors.selectWalletConnectPeer>;
};

type TDispatchProps = {
  walletConnectDisconnect: (peerId: string) => void;
};

const WalletConnectLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  walletConnectPeer,
  walletConnectDisconnect,
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaScreen contentContainerStyle={styles.content}>
      {walletConnectPeer ? (
        <>
          {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */}
          <Text>{JSON.stringify(walletConnectPeer, undefined, 2)}</Text>
          <Button
            contentStyle={styles.disconnectButton}
            layout={EButtonLayout.SECONDARY}
            onPress={() => walletConnectDisconnect(walletConnectPeer.id)}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <>
          <BodyText style={styles.noSessionTex}>
            Browse to{" "}
            <Link url="https://platform.neufund.org/connect">platform.neufund.org/connect</Link> on
            your desktop or tablet and scan the QR code to use Neufund Web with your account.
          </BodyText>

          <Button
            layout={EButtonLayout.PRIMARY}
            testID="wallet-connect-session-screen.scan-qr"
            onPress={() => navigation.navigate(appRoutes.qrCode)}
          >
            Scan QR code
          </Button>
        </>
      )}
    </SafeAreaScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    ...spacingStyles.p4,
  },
  noSessionTex: {
    ...spacingStyles.mb5,
    color: grayLighter2,
  },
  disconnectButton: {
    color: baseRed,
  },
});

const WalletConnectSessionScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    walletConnectPeer: walletConnectModuleApi.selectors.selectWalletConnectPeer(state),
  }),
  dispatchToProps: dispatch => ({
    walletConnectDisconnect: (peerId: string) =>
      dispatch(walletConnectModuleApi.actions.disconnectFromPeer(peerId)),
  }),
})(WalletConnectLayout);

export { WalletConnectSessionScreen };
