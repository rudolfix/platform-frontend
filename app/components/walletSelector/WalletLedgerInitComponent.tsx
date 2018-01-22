import * as React from "react";
import { Alert } from "reactstrap";
import { compose } from "redux";

import { tryEstablishingConnectionWithLedger } from "../../modules/wallet-selector/ledger-wizard/actions";
import { appConnect } from "../../store";
import { withActionWatcher } from "../../utils/WatchAction";
import { HiResImage } from "../HiResImage";
import { LoadingIndicator } from "../LoadingIndicator";
import * as styles from "./WalletLedgerInitComponent.module.scss";

export const LEDGER_RECONNECT_INTERVAL = 2000;

interface IWalletLedgerInitComponentProps {
  errorMessage?: string;
}

export const WalletLedgerInitComponent: React.SFC<IWalletLedgerInitComponentProps> = ({
  errorMessage,
}) => (
  <div className={styles.ledgerInit}>
    <p>Plug in your Ledger Nano and follow these steps:</p>
    <p>1. Ensure that Chrome app is not open during committing funds on our web</p>
    <p>2. Unlock your Ledger Nano by inserting the PIN</p>
    <div className={styles.imageWrapper}>
      <HiResImage partialPath="wallet_selector/ledger_unlock" />
    </div>
    <p>3. Open the Ethereum application</p>
    <div className={styles.imageWrapper}>
      <HiResImage partialPath="wallet_selector/ledger_ethereum" />
    </div>

    <div className={styles.steps}>
      4. Go to settings and set:
      <ul>
        <li>
          Contract Data: <strong>Yes</strong>
        </li>
        <li>
          Browser Support: <strong>Yes</strong>
        </li>
      </ul>
    </div>
    {errorMessage && (
      <Alert color="info">
        <h4>Connection status:</h4>
        <p data-test-id="ledger-wallet-error-msg">{errorMessage}</p>
      </Alert>
    )}
    <LoadingIndicator />
  </div>
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
