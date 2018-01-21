import * as React from "react";

import { connect } from "react-redux";
import { IAppState } from "../../store";
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

export const WalletLedger = connect<IWalletLedgerStateProps, undefined, undefined, IAppState>(
  state => ({
    isConnectionEstablished: state.ledgerWizardState.isConnectionEstablished,
    errorMsg: state.ledgerWizardState.errorMsg,
  }),
)(WalletLedgerComponent);
