import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { ILedgerAccount } from "../../../../../modules/wallet-selector/ledger-wizard/reducer";
import { LoadingIndicator } from "../../../../shared/loading-indicator/index";
import { WalletLedgerInitHeader } from "../WalletLedgerInit/WalletLedgerInitHeader";
import { WalletLedgerChooserTableAdvanced } from "./WalletLedgerChooserTableAdvanced";
import { WalletLedgerChooserTableSimple } from "./WalletLedgerChooserTableSimple";
import { WalletLedgerDPChooser } from "./WalletLedgerDPChooser";

import * as styles from "./WalletLedgerChooserBase.module.scss";

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
}) => (
  <div className={styles.wrapper}>
    {advanced && (
      <WalletLedgerDPChooser
        onDerivationPathPrefixChange={onDerivationPathPrefixChange}
        onDerivationPathPrefixError={onDerivationPathPrefixError}
      />
    )}
    {loading ? (
      <>
        <WalletLedgerInitHeader />
        <LoadingIndicator />
      </>
    ) : (
      <>
        {accounts.length > 1 && (
          <>
            <h1 className={styles.title}>
              <FormattedMessage id="wallet-selector.ledger.select-address.title" />
            </h1>
            <p className={styles.explanation}>
              <FormattedHTMLMessage
                tagName="span"
                id="wallet-selector.ledger.select-address.description"
              />
            </p>
          </>
        )}

        {accounts.length > 0 &&
          (advanced ? (
            <WalletLedgerChooserTableAdvanced
              accounts={accounts}
              handleAddressChosen={handleAddressChosen}
              hasPreviousAddress={hasPreviousAddress}
              showPrevAddresses={showPrevAddresses}
              showNextAddresses={showNextAddresses}
            />
          ) : (
            <WalletLedgerChooserTableSimple
              accounts={accounts}
              handleAddressChosen={handleAddressChosen}
            />
          ))}

        {!advanced && (
          <button
            className={styles.advanced}
            onClick={handleAdvanced}
            data-test-id="btn-advanced-simple"
          >
            <FormattedMessage id="wallet-selector.ledger.advanced-options" />
            <i className="fa fa-chevron-down ml-2" aria-hidden="true" />
          </button>
        )}
      </>
    )}

    <div className="mt-5 d-flex flex-row justify-content-between align-items-center">
      {advanced && !loading && (
        <button
          className={styles.back}
          onClick={handleAdvanced}
          data-test-id="btn-advanced-advanced"
        >
          <i className={cn("fa fa-chevron-left mr-2", styles.left)} aria-hidden="true" />
          <FormattedMessage id="form.button.back" />
        </button>
      )}
    </div>
  </div>
);
