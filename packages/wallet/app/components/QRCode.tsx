import { UnknownObject } from "@neufund/shared-utils";
import React from "react";
import { compose } from "recompose";

import { QRCodeScanner } from "components/shared/qr-code-scanner/QRCodeScanner";

import { walletConnectActions } from "modules/wallet-connect/actions";

import { appConnect } from "store/utils";

type TDispatchProps = {
  processURI: (uri: string) => void;
};

const QRCodeLayout: React.FunctionComponent<TDispatchProps> = ({ processURI }) => (
  <QRCodeScanner onRead={processURI} />
);

const QRCode = compose<TDispatchProps, UnknownObject>(
  appConnect<UnknownObject, TDispatchProps>({
    dispatchToProps: dispatch => ({
      processURI: uri => dispatch(walletConnectActions.connectToPeer(uri)),
    }),
  }),
)(QRCodeLayout);

export { QRCode };
