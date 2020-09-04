import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import RNQRCodeScanner from "react-native-qrcode-scanner";

type TExternalProps = {
  onRead: (uri: string) => void;
  reactivate: boolean;
};

// so that scanner doesn't immediately start scanning new codes
// and instead gives time for saga to execute
const REACTIVATE_TIMEOUT = 2000;

const QRCodeScanner: React.FunctionComponent<TExternalProps> = ({ onRead, reactivate }) => {
  const { width, height } = useWindowDimensions();

  return (
    <RNQRCodeScanner
      topViewStyle={styles.topAndBottom}
      bottomViewStyle={styles.topAndBottom}
      cameraStyle={{ width, height }}
      reactivate={reactivate}
      reactivateTimeout={REACTIVATE_TIMEOUT}
      cameraProps={{
        androidCameraPermissionOptions: null,
      }}
      onRead={e => {
        onRead(e.data);
      }}
    />
  );
};

const styles = StyleSheet.create({
  topAndBottom: {
    flex: 0,
  },
});

export { QRCodeScanner };
