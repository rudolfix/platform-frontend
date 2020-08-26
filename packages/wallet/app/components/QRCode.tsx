import { UnknownObject } from "@neufund/shared-utils";
import { RouteProp } from "@react-navigation/native";
import React from "react";
import { compose } from "recompose";

import { QRCodeScanner } from "components/shared/qr-code-scanner/QRCodeScanner";

import { EQRCodeType, qrCodeScannerModuleApi } from "modules/qr-code-scanner/module";

import { EAppRoutes } from "router/appRoutes";
import { RootStackParamList } from "router/routeUtils";

import { appConnect } from "store/utils";

type TStateProps = {
  route: RouteProp<RootStackParamList, EAppRoutes.qrCode>;
};

type TDispatchProps = {
  onScan: (data: string, requiredQRCodeType: EQRCodeType | undefined) => void;
};

const QRCodeLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({ onScan, route }) => (
  <QRCodeScanner onRead={data => onScan(data, route.params?.requiredQRCodeType)} />
);

const QRCode = compose<TStateProps & TDispatchProps, UnknownObject>(
  appConnect<TStateProps, TDispatchProps>({
    dispatchToProps: dispatch => ({
      onScan: (data, requiredQRCodeType) =>
        dispatch(qrCodeScannerModuleApi.actions.onScan(data, requiredQRCodeType)),
    }),
  }),
)(QRCodeLayout);

export { QRCode };
