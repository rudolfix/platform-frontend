import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../store";
import { withActionWatcher } from "../../../utils/withActionWatcher";
import { WarningAlert } from "../../shared/WarningAlert";

import * as imgStep1 from "../../../assets/img/wallet_selector/ledger_login_step_1.svg";
import * as imgStep2 from "../../../assets/img/wallet_selector/ledger_login_step_2.svg";
import * as imgStep3 from "../../../assets/img/wallet_selector/ledger_login_step_3.svg";
import { ledgerWizardFlows } from "../../../modules/wallet-selector/ledger-wizard/flows";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { LedgerHeader } from "./LedgerHeader";
import * as styles from "./WalletLedgerInitComponent.module.scss";

export const LEDGER_RECONNECT_INTERVAL = 2000;

interface IInitStep {
  header: string;
  img: string;
  desc: string;
}

const InitStep: React.SFC<IInitStep> = ({ header, img, desc }) => (
  <Col xs="12" md="4" className={cn("mb-4 mb-md-0 px-4", styles.step)}>
    <div className={styles.header}>{header}</div>
    <img className="my-2 my-md-5" src={img} />
    <p>{desc}</p>
  </Col>
);

interface IWalletLedgerInitComponentProps {
  isInitialConnectionInProgress: boolean;
  errorMessage?: string;
}

export const WalletLedgerInitComponent: React.SFC<IWalletLedgerInitComponentProps & IIntlProps> = ({
  errorMessage,
  isInitialConnectionInProgress,
  intl: { formatIntlMessage },
}) => {
  if (isInitialConnectionInProgress) {
    return <LoadingIndicator />;
  }
  return (
    <>
      <Row>
        <Col>
          <LedgerHeader />
        </Col>
      </Row>
      {errorMessage && (
        <Row className="justify-content-center">
          <WarningAlert className="my-4">
            <FormattedMessage id="wallet-selector.ledger.start.connection-status" />{" "}
            <span data-test-id="ledger-wallet-error-msg">{errorMessage}</span>
          </WarningAlert>
        </Row>
      )}
      <Row>
        <InitStep
          header={formatIntlMessage("wallet-selector.ledger.start.step1.header")}
          img={imgStep1}
          desc={formatIntlMessage("wallet-selector.ledger.start.step1.description")}
        />
        <InitStep
          header={formatIntlMessage("wallet-selector.ledger.start.step2.header")}
          img={imgStep2}
          desc={formatIntlMessage("wallet-selector.ledger.start.step2.description")}
        />
        <InitStep
          header={formatIntlMessage("wallet-selector.ledger.start.step3.header")}
          img={imgStep3}
          desc={formatIntlMessage("wallet-selector.ledger.start.step3.description")}
        />
      </Row>
    </>
  );
};

export const WalletLedgerInit = compose<React.SFC>(
  withActionWatcher({
    actionCreator: dispatch => dispatch(ledgerWizardFlows.tryEstablishingConnectionWithLedger),
    interval: LEDGER_RECONNECT_INTERVAL,
  }),
  appConnect<IWalletLedgerInitComponentProps>({
    stateToProps: state => ({
      isInitialConnectionInProgress: state.ledgerWizardState.isInitialConnectionInProgress,
      errorMessage: state.ledgerWizardState.errorMsg,
    }),
  }),
  injectIntlHelpers,
)(WalletLedgerInitComponent);
