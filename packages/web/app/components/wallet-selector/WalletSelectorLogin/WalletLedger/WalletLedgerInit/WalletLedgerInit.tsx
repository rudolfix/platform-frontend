import { Button } from "@neufund/design-system";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { externalRoutes } from "../../../../../config/externalRoutes";
import { minimumLedgerVersion } from "../../../../../lib/web3/ledger-wallet/ledgerUtils";
import { actions } from "../../../../../modules/actions";
import {
  selectLedgerErrorMessage,
  selectLedgerIsInitialConnectionInProgress,
} from "../../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../../store";
import { ExternalLink } from "../../../../shared/links/index";
import { LoadingIndicator } from "../../../../shared/loading-indicator/LoadingIndicator";
import { WarningAlert } from "../../../../shared/WarningAlert";
import { getMessageTranslation, LedgerErrorMessage } from "../../../../translatedMessages/messages";
import { TMessage } from "../../../../translatedMessages/utils";
import { WalletLedgerInitHeader } from "./WalletLedgerInitHeader";

import * as styles from "./WalletLedgerInit.module.scss";

interface IStateProps {
  isInitialConnectionInProgress: boolean;
  errorMessage?: TMessage;
}

interface IDispatchProps {
  tryToEstablishConnectionWithLedger: () => void;
}

type TLedgerErrorProps = {
  errorMessage: TMessage;
  tryToEstablishConnectionWithLedger: () => void;
};

const WalletLedgerInitErrorBase: React.FunctionComponent<TLedgerErrorProps> = ({
  errorMessage,
  tryToEstablishConnectionWithLedger,
}) => (
  <section className="text-center my-5">
    <WarningAlert className="mb-4">
      <FormattedMessage id="wallet-selector.ledger.start.connection-status" />
      <span data-test-id="ledger-wallet-error-msg">{getMessageTranslation(errorMessage)}</span>
    </WarningAlert>

    <Button
      onClick={tryToEstablishConnectionWithLedger}
      data-test-id="ledger-wallet-init.try-again"
    >
      <FormattedMessage id="common.try-again" />
    </Button>
  </section>
);

const LedgerNotSupported = () => (
  <div className={cn(styles.step, "mx-md-5")}>
    <p>
      <FormattedMessage
        values={{ minimumVersion: minimumLedgerVersion }}
        id="wallet-selector.ledger.please-upgrade"
      />
    </p>
    <p>
      <FormattedMessage
        values={{
          ledgerUpgradeLink: (
            <ExternalLink href={externalRoutes.ledgerSupport}>
              <FormattedMessage id="wallet-selector.ledger.update-link" />
            </ExternalLink>
          ),
        }}
        id="wallet-selector.ledger.update-instructions"
      />
    </p>
  </div>
);

export const LedgerInitBase: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  errorMessage,
  isInitialConnectionInProgress,
  tryToEstablishConnectionWithLedger,
}) => (
  <>
    <WalletLedgerInitHeader />

    {isInitialConnectionInProgress && <LoadingIndicator />}

    {errorMessage && (
      <WalletLedgerInitErrorBase
        errorMessage={errorMessage}
        tryToEstablishConnectionWithLedger={tryToEstablishConnectionWithLedger}
      />
    )}

    {/* If there is a need for more visual cases then we will need to implement a full solution */}
    {errorMessage && errorMessage.messageType === LedgerErrorMessage.NOT_SUPPORTED && (
      <LedgerNotSupported />
    )}
  </>
);

export const WalletLedgerInit = compose<IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      isInitialConnectionInProgress: selectLedgerIsInitialConnectionInProgress(state),
      errorMessage: selectLedgerErrorMessage(state),
    }),
    dispatchToProps: dispatch => ({
      tryToEstablishConnectionWithLedger: () =>
        dispatch(actions.walletSelector.ledgerTryEstablishingConnectionWithLedger()),
    }),
  }),
)(LedgerInitBase);

export const WalletLedgerInitError = compose<TLedgerErrorProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    dispatchToProps: dispatch => ({
      tryToEstablishConnectionWithLedger: () => dispatch(actions.walletSelector.ledgerReconnect()),
    }),
  }),
)(WalletLedgerInitErrorBase);
