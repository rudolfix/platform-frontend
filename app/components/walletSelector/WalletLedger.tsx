import * as React from "react";
import { Alert } from "reactstrap";

import { HiResImage } from "../HiResImage";
import { LoadingIndicator } from "../LoadingIndicator";
import * as styles from "./WalletLedger.module.scss";

interface IWalletLedgerComponent {
  errorMessage?: string;
}

export const WalletLedgerComponent: React.SFC<IWalletLedgerComponent> = ({ errorMessage }) => (
  <div className={styles.ledgerInit}>
    <p>Plug in your Ledger Nano and follow these steps:</p>
    <p>1. Ensure that Chrome app is not open during committing funds on our web</p>
    <p>2. Unlock your Ledger Nano by inserting the PIN</p>
    <div className={styles.imageWrapper}>
      <HiResImage partialPath="wallet_selector/ledger_unlock" className="img-responsive" />
    </div>
    <p>3. Open the Ethereum application</p>
    <div className={styles.imageWrapper}>
      <HiResImage partialPath="wallet_selector/ledger_ethereum" className="img-responsive" />
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
    {errorMessage &&
    <Alert color="info">
      <h4>Connection status:</h4>
      <p>
        {errorMessage}
      </p>
    </Alert>}
    <LoadingIndicator />
  </div>);

export const WalletLedger = () => <WalletLedgerComponent />;
