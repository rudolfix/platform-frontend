import * as React from "react";
import { Alert, Col, Row } from "reactstrap";
import { compose } from "redux";

import { tryConnectingWithBrowserWallet } from "../../modules/wallet-selector/browser-wizard/actions";
import { appConnect } from "../../store";
import { withActionWatcher } from "../../utils/withActionWatcher";
import { HiResImage } from "../HiResImage";
import { LoadingIndicator } from "../LoadingIndicator";
import * as styles from "./WalletBrowser.module.scss";

export const BROWSER_WALLET_RECONNECT_INTERVAL = 1000;

interface IWalletBrowserProps {
  errorMessage?: string;
}

export const WalletBrowserComponent: React.SFC<IWalletBrowserProps> = ({ errorMessage }) => (
  <div>
    <p>Currently we support the following wallets:</p>

    <Row className="text-center">
      <Col>
        <HiResImage partialPath="wallet_selector/logo_metamask" altText="Metamask" />
      </Col>
      <Col>
        <HiResImage partialPath="wallet_selector/logo_parity" altText="Parity" />
      </Col>
      <Col>
        <HiResImage partialPath="wallet_selector/logo_mist" altText="Mist" />
      </Col>
    </Row>

    <p>Follow these steps:</p>

    <div className={styles.steps}>
      <ol>
        <li>Turn on your browser plugin.</li>
        <li>Refresh the page.</li>
        <li>Unlock your wallet.</li>
      </ol>
    </div>
    {errorMessage && (
      <Alert color="info">
        <h4>Connection status:</h4>
        <p data-test-id="browser-wallet-error-msg">{errorMessage}</p>
      </Alert>
    )}

    <LoadingIndicator />
  </div>
);

export const WalletBrowser = compose<React.SFC>(
  appConnect<IWalletBrowserProps>({
    stateToProps: state => ({
      errorMessage: state.browserWalletWizardState.errorMsg,
    }),
  }),
  withActionWatcher({
    actionCreator: dispatch => dispatch(tryConnectingWithBrowserWallet),
    interval: BROWSER_WALLET_RECONNECT_INTERVAL,
  }),
)(WalletBrowserComponent);
