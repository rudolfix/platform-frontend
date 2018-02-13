import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { tryConnectingWithBrowserWallet } from "../../modules/wallet-selector/browser-wizard/actions";
import { appConnect } from "../../store";
import { withActionWatcher } from "../../utils/withActionWatcher";
import { HiResImage } from "../HiResImage";
import { WarningAlert } from "../WarningAlert";
import * as styles from "./WalletBrowser.module.scss";

export const BROWSER_WALLET_RECONNECT_INTERVAL = 1000;

interface IWalletBrowserProps {
  errorMessage?: string;
}

import * as browserIcon from "../../assets/img/wallet_selector/browser_icon.svg";
import * as lockIcon from "../../assets/img/wallet_selector/lock_icon.svg";
import * as walletIcon from "../../assets/img/wallet_selector/wallet_icon.svg";
import { HorizontalLine } from "../HorizontalLine";

interface IStepCardProps {
  img: string;
  text: string;
}
export const StepCard: React.SFC<IStepCardProps> = ({ img, text }) => (
  <Col sm={4} xs={12} className="mb-4">
    <Row>
      <Col>
        <img src={img} className="mb-3" />
      </Col>
    </Row>
    <Row>
      <Col>{text}</Col>
    </Row>
  </Col>
);

export const WalletBrowserComponent: React.SFC<IWalletBrowserProps> = ({ errorMessage }) => (
  <div>
    <h1 className="text-center mb-3">Register your existing Wallet on Neufund</h1>

    <Row className="justify-content-center mb-5">
      <WarningAlert>
        <span data-test-id="browser-wallet-error-msg">{errorMessage}</span>
      </WarningAlert>
    </Row>

    <Row className="mb-4 text-center">
      <StepCard img={walletIcon} text={"1. Choose existing wallet"} />
      <StepCard img={browserIcon} text={"2. Turn on your browser plugin"} />
      <StepCard img={lockIcon} text={"3. Unlock your wallet to register"} />
    </Row>

    <HorizontalLine className="mb-5" />

    <Row className="text-center mb-4">
      <Col>
        <span className="font-weight-bold">NEUFUND supports</span>
      </Col>
    </Row>
    <Row className={cn("justify-content-center text-center", styles.walletLogos)}>
      <Col sm="auto">
        <HiResImage partialPath="wallet_selector/logo_parity" altText="Parity" />
      </Col>
      <Col sm="auto">
        <HiResImage partialPath="wallet_selector/logo_metamask" altText="Metamask" />
      </Col>
      <Col sm="auto">
        <HiResImage partialPath="wallet_selector/logo_mist" altText="Mist" />
      </Col>
    </Row>
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
