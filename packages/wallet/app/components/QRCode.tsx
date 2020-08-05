import { UnknownObject } from "@neufund/shared-utils";
import React from "react";
import { compose } from "recompose";

import { QRCodeScanner } from "components/shared/qr-code-scanner/QRCodeScanner";

import { qrCodeScannerModuleApi } from "modules/qr-code-scanner/module";


import { appConnect } from "store/utils";

type TDispatchProps = {
  onScan: (data: string) => void;
};

const QRCodeLayout: React.FunctionComponent<TDispatchProps> = ({ onScan }) => (
  <QRCodeScanner onRead={onScan} />
);

const QRCode = compose<TDispatchProps, UnknownObject>(
  appConnect<UnknownObject, TDispatchProps>({
    dispatchToProps: dispatch => ({
      onScan: data => dispatch(qrCodeScannerModuleApi.actions.onScan(data)),
    }),
  }),
)(QRCodeLayout);

export { QRCode };
