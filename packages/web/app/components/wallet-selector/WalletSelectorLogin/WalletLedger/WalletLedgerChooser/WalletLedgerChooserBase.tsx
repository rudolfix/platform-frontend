import { Button, EButtonLayout } from "@neufund/design-system";
import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import {
  DEFAULT_DERIVATION_PATH_PREFIX,
  ILedgerAccount,
} from "../../../../../modules/wallet-selector/ledger-wizard/reducer";
import { LoadingIndicator } from "../../../../shared/loading-indicator/index";
import { PanelRounded } from "../../../../shared/Panel";
import {
  EWarningAlertLayout,
  EWarningAlertSize,
  WarningAlert,
} from "../../../../shared/WarningAlert";

import * as styles from "./WalletLedgerChooserBase.module.scss";
import { WalletLedgerChooserTableAdvanced } from "./WalletLedgerChooserTableAdvanced";
import { WalletLedgerChooserTableSimple } from "./WalletLedgerChooserTableSimple";
import { TableControls } from "./TableControls";

export interface IWalletLedgerChooserComponent {
  accounts: ReadonlyArray<ILedgerAccount>;
  hasPreviousAddress: boolean;
  loading: boolean;
  advanced: boolean;
}

export interface IWalletLedgerChooserComponentDispatchProps {
  onDerivationPathPrefixChange: (derivationPathprefix: string) => void;
  onDerivationPathPrefixError: () => void;
  handleAddressChosen: (account: ILedgerAccount) => void;
  showPrevAddresses: () => void;
  showNextAddresses: () => void;
  handleAdvanced: () => void;
}

export const WalletLedgerChooserBase: React.FunctionComponent<IWalletLedgerChooserComponent &
  IWalletLedgerChooserComponentDispatchProps> = ({
  accounts,
  handleAddressChosen,
  hasPreviousAddress,
  showPrevAddresses,
  showNextAddresses,
  loading,
  advanced,
  onDerivationPathPrefixChange,
  onDerivationPathPrefixError,
  handleAdvanced,
}) => {
  const [derivationPathPrefix, setDerivationPathPrefix] = React.useState(
    DEFAULT_DERIVATION_PATH_PREFIX,
  );
  const [errorMessage, setErrorMessage] = React.useState(null);

  let content;

  if (loading) {
    content = <LoadingIndicator />;
  } else if (errorMessage) {
    content = (
      <WarningAlert
        className={styles.errorMessage}
        size={EWarningAlertSize.BIG}
        layout={EWarningAlertLayout.INLINE}
        data-test-id="wallet-selector-session-timeout-notification"
      >
        {errorMessage}
      </WarningAlert>
    );
  } else if (accounts.length > 0) {
    content = (
      <WalletLedgerChooserTableSimple
        accounts={accounts}
        handleAddressChosen={handleAddressChosen}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        <FormattedMessage id="wallet-selector.ledger.select-address.title" />
      </h1>

      <p className={styles.explanation}>
        {accounts.length > 1 ? (
          <FormattedHTMLMessage
            tagName="span"
            id="wallet-selector.ledger.select-address.description"
          />
        ) : (
          <FormattedHTMLMessage
            tagName="span"
            id="wallet-selector.ledger.select-address.description.single"
          />
        )}
      </p>

      <PanelRounded>
        <div>
          <TableControls
            derivationPathPrefix={derivationPathPrefix}
            setDerivationPathPrefix={setDerivationPathPrefix}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            onDerivationPathPrefixChange={onDerivationPathPrefixChange}
            onDerivationPathPrefixError={onDerivationPathPrefixError}
            hasPreviousAddress={hasPreviousAddress}
            showPrevAddresses={showPrevAddresses}
            showNextAddresses={showNextAddresses}
          />

          {content}
        </div>
      </PanelRounded>

      {!advanced && !loading && (
        <Button
          className={styles.advanced}
          onClick={handleAdvanced}
          data-test-id="btn-advanced-simple"
          layout={EButtonLayout.PRIMARY}
        >
          <FormattedMessage id="wallet-selector.ledger.show-more" />
        </Button>
      )}
    </div>
  );
};
