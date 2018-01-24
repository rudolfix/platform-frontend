import * as React from "react";

import { appConnect } from "../../store";
import { WalletLedgerChooser } from "./WalletLedgerChooser";
import { WalletLedgerInit } from "./WalletLedgerInitComponent";

interface IWalletLedgerStateProps {
  isConnectionEstablished: boolean;
  errorMsg?: string;
}

export const WalletLedgerComponent: React.SFC<IWalletLedgerStateProps> = ({
  isConnectionEstablished,
  errorMsg,
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
    errorMsg: state.ledgerWizardState.errorMsg,
  }),
})(WalletLedgerComponent);
