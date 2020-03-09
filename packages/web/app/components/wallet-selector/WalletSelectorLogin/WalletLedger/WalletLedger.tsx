import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { isSupportingLedger } from "../../../../modules/user-agent/reducer";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/react-connected-components/OnEnterAction";
import { resetWalletOnEnter } from "../../shared/reset-wallet";
import { WalletLedgerChooser } from "./WalletLedgerChooser/WalletLedgerChooser";
import { LedgerInit } from "./LedgerInit/WalletLedgerInitComponent";
import { WalletLedgerNotSupported } from "./WalletLedgerNotSupported/WalletLedgerNotSupportedComponent";

interface IWalletLedgerStateProps {
  isConnectionEstablished: boolean;
  isLedgerSupported: boolean;
}

export const WalletLedgerComponent: React.FunctionComponent<IWalletLedgerStateProps> = ({
  isConnectionEstablished,
  isLedgerSupported,
}) => {
  if (!isLedgerSupported) {
    return <WalletLedgerNotSupported />;
  } else if (isConnectionEstablished) {
    return <WalletLedgerChooser />;
  }

  return <LedgerInit />;
};

export const WalletLedger = compose<IWalletLedgerStateProps, {}>(
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.walletSelector.ledgerTryEstablishingConnectionWithLedger());
    },
  }),
  resetWalletOnEnter(),
  appConnect<IWalletLedgerStateProps>({
    stateToProps: state => ({
      isConnectionEstablished: state.ledgerWizardState.isConnectionEstablished,
      isLedgerSupported: isSupportingLedger(state),
    }),
  }),
)(WalletLedgerComponent);
