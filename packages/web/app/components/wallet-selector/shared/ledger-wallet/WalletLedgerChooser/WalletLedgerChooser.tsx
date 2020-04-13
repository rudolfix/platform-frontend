import { withContainer } from "@neufund/shared";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { branch, compose, renderComponent, withProps } from "recompose";

import { actions } from "../../../../../modules/actions";
import {
  ILedgerAccount,
  selectHasPreviousPage,
} from "../../../../../modules/wallet-selector/ledger-wizard/reducer";
import { appConnect } from "../../../../../store";
import { EContentWidth } from "../../../../layouts/Content";
import { FullscreenProgressLayout } from "../../../../layouts/FullscreenProgressLayout";
import { TContentExternalProps } from "../../../../layouts/Layout";
import { LoadingIndicator } from "../../../../shared/loading-indicator";
import {
  IWalletLedgerChooserComponent,
  IWalletLedgerChooserComponentDispatchProps,
  WalletLedgerChooserBase,
} from "./WalletLedgerChooserBase";

export const WalletLedgerChooser = compose<
  IWalletLedgerChooserComponent & IWalletLedgerChooserComponentDispatchProps,
  IWalletLedgerChooserComponent & IWalletLedgerChooserComponentDispatchProps
>(
  appConnect<IWalletLedgerChooserComponent, IWalletLedgerChooserComponentDispatchProps>({
    stateToProps: state => ({
      loading: state.ledgerWizardState.isLoading,
      accounts: state.ledgerWizardState.accounts,
      derivationPath: state.ledgerWizardState.derivationPathPrefix,
      hasPreviousAddress: selectHasPreviousPage(state.ledgerWizardState),
      advanced: state.ledgerWizardState.advanced,
    }),
    dispatchToProps: dispatch => ({
      closeAccountChooser: () => {
        dispatch(actions.walletSelector.ledgerCloseAccountChooser());
      },
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

  withContainer(
    withProps<TContentExternalProps, { closeAccountChooser: () => void }>(
      ({ closeAccountChooser }) => ({
        width: EContentWidth.FULL,
        buttonProps: {
          buttonText: <FormattedMessage id="account-recovery.step.cancel" />,
          buttonAction: closeAccountChooser,
        },
      }),
    )(FullscreenProgressLayout),
  ),
  branch<IWalletLedgerChooserComponent>(
    ({ loading }) => !!loading,
    renderComponent(LoadingIndicator),
  ),
)(WalletLedgerChooserBase);
