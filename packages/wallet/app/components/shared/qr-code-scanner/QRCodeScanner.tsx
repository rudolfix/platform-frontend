import React from "react";
import { useWindowDimensions } from "react-native";
import RNQRCodeScanner from "react-native-qrcode-scanner";

type TExternalProps = {
  onRead: (uri: string) => void;
};

const QRCodeScanner: React.FunctionComponent<TExternalProps> = ({ onRead }) => {
  const { width, height } = useWindowDimensions();

  return (
    <RNQRCodeScanner
      topViewStyle={{ flex: 0 }}
      bottomViewStyle={{ flex: 0 }}
      cameraStyle={{ width, height }}
      onRead={e => onRead(e.data)}
    />
  );
};

export { QRCodeScanner };
