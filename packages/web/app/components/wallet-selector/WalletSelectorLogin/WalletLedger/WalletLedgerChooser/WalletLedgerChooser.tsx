import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { actions } from "../../../../../modules/actions";
import {
  ILedgerAccount,
  selectHasPreviousPage,
} from "../../../../../modules/wallet-selector/ledger-wizard/reducer";
import { appConnect } from "../../../../../store";
import { onEnterAction } from "../../../../../utils/react-connected-components/OnEnterAction";
import { withHeaderButton } from "../../../../../utils/react-connected-components/withHeaderButton";
import {
  IWalletLedgerChooserComponent,
  IWalletLedgerChooserComponentDispatchProps,
  WalletLedgerChooserComponent,
} from "./WalletLedgerChooserComponent";

export const WalletLedgerChooser = compose<React.FunctionComponent>(
  appConnect<IWalletLedgerChooserComponent, IWalletLedgerChooserComponentDispatchProps>({
    stateToProps: state => ({
      loading: state.ledgerWizardState.isLoadingAddresses,
      accounts: state.ledgerWizardState.accounts,
      derivationPath: state.ledgerWizardState.derivationPathPrefix,
      hasPreviousAddress: selectHasPreviousPage(state.ledgerWizardState),
      advanced: state.ledgerWizardState.advanced,
    }),
    dispatchToProps: dispatch => ({
      onDerivationPathPrefixError: () =>
        dispatch(actions.walletSelector.ledgerWizardDerivationPathPrefixError()),
      onDerivationPathPrefixChange: (derivationPathPrefix: string) => {
        dispatch(actions.walletSelector.ledgerSetDerivationPathPrefix(derivationPathPrefix));
      },
      handleAddressChosen: (account: ILedgerAccount) => {
        dispatch(
          actions.walletSelector.ledgerFinishSettingUpLedgerConnector(account.derivationPath),
        );
      },
      showNextAddresses: () => dispatch(actions.walletSelector.ledgerGoToNextPageAndLoadData()),
      showPrevAddresses: () => dispatch(actions.walletSelector.ledgerGoToPreviousPageAndLoadData()),
      handleAdvanced: () => {
        dispatch(actions.walletSelector.toggleLedgerAccountsAdvanced());
        dispatch(actions.walletSelector.ledgerLoadAccounts());
      },
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.walletSelector.ledgerLoadAccounts()),
  }),
  withHeaderButton<{ closeAccountChooser: () => void }>(props => ({
    buttonText: <FormattedMessage id="account-recovery.step.cancel" />,
    buttonAction: props.closeAccountChooser,
  })),
)(WalletLedgerChooserComponent);
