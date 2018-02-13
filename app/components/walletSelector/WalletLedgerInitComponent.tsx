import * as cn from "classnames";
import * as React from "react";
import { Alert, Col, Row } from "reactstrap";
import { compose } from "redux";

import { tryEstablishingConnectionWithLedger } from "../../modules/wallet-selector/ledger-wizard/actions";
import { appConnect } from "../../store";
import { withActionWatcher } from "../../utils/withActionWatcher";
import { WarningAlert } from "../WarningAlert";

import * as imgStep1 from "../../assets/img/wallet_selector/ledger_login_step_1.svg";
import * as imgStep2 from "../../assets/img/wallet_selector/ledger_login_step_2.svg";
import * as imgStep3 from "../../assets/img/wallet_selector/ledger_login_step_3.svg";
import * as styles from "./WalletLedgerInitComponent.module.scss";

export const LEDGER_RECONNECT_INTERVAL = 2000;

interface IInitStep {
  header: string;
  img: string;
  desc: string;
}

const InitStep: React.SFC<IInitStep> = ({ header, img, desc }) => (
  <Col xs="12" md="4" className={cn("mb-4 mb-md-0 px-4", styles.step)}>
    <h4 className={styles.header}>{header}</h4>
    <img className="my-2 my-md-4" src={img} />
    <p>{desc}</p>
  </Col>
);

interface IWalletLedgerInitComponentProps {
  errorMessage?: string;
}

export const WalletLedgerInitComponent: React.SFC<IWalletLedgerInitComponentProps> = ({
  errorMessage,
}) => (
  <>
    <Row>
      <Col>
        <h1 className="text-center">Logging in with Nano Ledger</h1>
      </Col>
    </Row>
    {errorMessage && (
      <WarningAlert className="my-4">
        Connection status: <span data-test-id="ledger-wallet-error-msg">{errorMessage}</span>
      </WarningAlert>
    )}
    <Row>
      <InitStep
        header="1. Connect to USB"
        img={imgStep1}
        desc="Connect your Ledger Nano into USB and prepare your PIN Code for the device"
      />
      <InitStep
        header="2. Enter Pin Code"
        img={imgStep2}
        desc="Use left and right key to enter numbers and press 2 keys at the same time to confirm the code"
      />
      <InitStep
        header="3. Pick Ethereum"
        img={imgStep3}
        desc="Click on arrows to scroll  apps and pick Ethereum icon. Press 2 keys at the same time to confirm"
      />
    </Row>
    <Row className="mt-5">
      <Col className={cn("text-center text-md-right", styles.contact)}>
        Have some issues with your NeuKey? <a href="#">Contact for help</a>
      </Col>
    </Row>
  </>
);

// @todo: type inference doesnt work correctly here. Probably because of withActionWatcher signature
export const WalletLedgerInit = compose<React.SFC>(
  withActionWatcher({
    actionCreator: dispatch => dispatch(tryEstablishingConnectionWithLedger),
    interval: LEDGER_RECONNECT_INTERVAL,
  }),
  appConnect<IWalletLedgerInitComponentProps>({
    stateToProps: state => ({
      errorMessage: state.ledgerWizardState.errorMsg,
    }),
  }),
)(WalletLedgerInitComponent);
