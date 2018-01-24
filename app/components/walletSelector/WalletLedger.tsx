import * as React from "react";

import { appConnect } from "../../store";
import { WalletLedgerChooser } from "./WalletLedgerChooser";
import { WalletLedgerInit } from "./WalletLedgerInitComponent";

interface IWalletLedgerStateProps {
  isConnectionEstablished: boolean;
}

export const WalletLedgerComponent: React.SFC<IWalletLedgerStateProps> = ({
  isConnectionEstablished,
}) => {
  if (isConnectionEstablished) {
    return <WalletLedgerChooser />;
  } else {
    return <WalletLedgerInit />;
  }
};

export const WalletLedger = appConnect<IWalletLedgerStateProps>({
  stateToProps: state => ({
    isConnectionEstablished: state.ledgerWizardState.isConnectionEstablished,
  }),
})(WalletLedgerComponent);
