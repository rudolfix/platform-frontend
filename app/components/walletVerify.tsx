import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { appConnect } from "../store";
import { LoadingIndicator } from "./shared/LoadingIndicator";

interface IWalletVerifyProps {
}

export const WalletVerifyComponent: React.SFC<IWalletVerifyProps> = () => (
  <div>
    <LoadingIndicator />
  </div>
);

export const WalletVerify = compose<React.SFC>(
  appConnect<IWalletVerifyProps>({
    stateToProps: state => ({
    }),
  }),
)(WalletVerifyComponent);
