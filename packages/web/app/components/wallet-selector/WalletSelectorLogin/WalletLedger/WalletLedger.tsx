import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { isSupportingLedger } from "../../../../modules/user-agent/reducer";
import {
  selectLedgerConnectionEstablished,
  selectLedgerErrorMessage,
} from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { TMessage } from "../../../translatedMessages/utils";
import { WalletLedgerChooser } from "./WalletLedgerChooser/WalletLedgerChooser";
import { WalletLedgerInit } from "./WalletLedgerInit/WalletLedgerInit";
import { WalletLedgerNotSupported } from "./WalletLedgerNotSupported/WalletLedgerNotSupported";

interface IWalletLedgerStateProps {
  isConnectionEstablished: boolean;
  isLedgerSupported: boolean;
  error: TMessage | undefined;
}

interface IWalletLedgerDispatchProps {
  tryEstablishingConnectionWithLedger: () => void;
  resetWallet: () => void;
}

export const WalletLedgerComponent: React.FunctionComponent<IWalletLedgerStateProps &
  IWalletLedgerDispatchProps> = ({
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

  return <WalletLedgerInit />;
};

export const WalletLedger = compose<IWalletLedgerStateProps & IWalletLedgerDispatchProps, {}>(
  appConnect<IWalletLedgerStateProps, IWalletLedgerDispatchProps>({
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
