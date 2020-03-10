import * as React from "react";
import { compose } from "recompose";
import { actions } from "../../../../modules/actions";
import { isSupportingLedger } from "../../../../modules/user-agent/reducer";
import {
  selectLedgerConnectionEstablished,
  selectLedgerErrorMessage,
} from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { LedgerInit } from "./LedgerInit/WalletLedgerInitComponent";
import { WalletLedgerChooser } from "./WalletLedgerChooser/WalletLedgerChooser";
import { WalletLedgerNotSupported } from "./WalletLedgerNotSupported/WalletLedgerNotSupportedComponent";

interface IWalletLedgerStateProps {
  isConnectionEstablished: boolean;
  isLedgerSupported: boolean;
}

export const WalletLedgerComponent: React.FunctionComponent<IWalletLedgerStateProps> = ({
  isConnectionEstablished,
  isLedgerSupported,
  resetWallet,
  tryEstablishingConnectionWithLedger,
  error,
}) => {
  React.useEffect(() => {
    if (!isConnectionEstablished && !error) {
      resetWallet();
      tryEstablishingConnectionWithLedger();
    }
  }, []);

  if (!isLedgerSupported) {
    return <WalletLedgerNotSupported />;
  } else if (isConnectionEstablished) {
    return <WalletLedgerChooser />;
  }

  return <LedgerInit />;
};

export const WalletLedger = compose<IWalletLedgerStateProps, {}>(
  appConnect<IWalletLedgerStateProps>({
    stateToProps: state => ({
      isConnectionEstablished: selectLedgerConnectionEstablished(state),
      isLedgerSupported: isSupportingLedger(state),
      error: selectLedgerErrorMessage(state),
    }),
    dispatchToProps: dispatch => ({
      resetWallet: () => dispatch(actions.walletSelector.reset()),
      tryEstablishingConnectionWithLedger: () =>
        dispatch(actions.walletSelector.ledgerTryEstablishingConnectionWithLedger()),
    }),
  }),
)(WalletLedgerComponent);
