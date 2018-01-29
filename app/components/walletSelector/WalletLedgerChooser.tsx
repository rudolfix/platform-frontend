import * as React from "react";

import { compose } from "redux";
import {
  finishSettingUpLedgerConnectorAction,
  goToNextPageAndLoadDataAction,
  goToPreviousPageAndLoadDataAction,
  loadLedgerAccountsAction,
  verifyIfLedgerStillConnected,
} from "../../modules/wallet-selector/ledger-wizard/actions";
import {
  ILedgerAccount,
  selectHasPreviousPage,
} from "../../modules/wallet-selector/ledger-wizard/reducer";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withActionWatcher } from "../../utils/withActionWatcher";
import {
  IWalletLedgerChooserComponent,
  IWalletLedgerChooserComponentDispatchProps,
  WalletLedgerChooserComponent,
} from "./WalletLedgerChooserComponent";

export const WalletLedgerChooser = compose<React.SFC>(
  appConnect<IWalletLedgerChooserComponent, IWalletLedgerChooserComponentDispatchProps>({
    stateToProps: state => ({
      loading: state.ledgerWizardState.isLoadingAddresses,
      accounts: state.ledgerWizardState.accounts,
      derivationPath: state.ledgerWizardState.derivationPathPrefix,
      hasPreviousAddress: selectHasPreviousPage(state.ledgerWizardState),
      invalidDerivationPath: false,
      onDerivationPathChange: () => null,
    }),
    dispatchToProps: dispatch => ({
      handleAddressChosen: (account: ILedgerAccount) => {
        dispatch(finishSettingUpLedgerConnectorAction(account.derivationPath));
      },
      showNextAddresses: () => dispatch(goToNextPageAndLoadDataAction),
      showPrevAddresses: () => dispatch(goToPreviousPageAndLoadDataAction),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(loadLedgerAccountsAction),
  }),
  withActionWatcher({
    actionCreator: dispatch => dispatch(verifyIfLedgerStillConnected),
    interval: 1000,
  }),
)(WalletLedgerChooserComponent);
