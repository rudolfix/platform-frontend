import * as React from "react";
import { Button } from "reactstrap";

import { ILedgerAccount } from "../../modules/wallet-selector/ledger-wizard/reducer";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import * as styles from "./WalletLedgerChooserComponent.module.scss";
import { WalletLedgerChooserTableAdvanced } from "./WalletLedgerChooserTableAdvanced";
import { WalletLedgerChooserTableSimple } from "./WalletLedgerChooserTableSimple";
import { WalletLedgerDPChooser } from "./WalletLedgerDPChooser";

export interface IWalletLedgerChooserComponent {
  accounts: ILedgerAccount[];
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

export const WalletLedgerChooserComponent: React.SFC<
  IWalletLedgerChooserComponent & IWalletLedgerChooserComponentDispatchProps
> = ({
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
  <>
    <h1 className="text-center">Select your wallet for registration</h1>
    {advanced && (
      <WalletLedgerDPChooser
        onDerivationPathPrefixChange={onDerivationPathPrefixChange}
        onDerivationPathPrefixError={onDerivationPathPrefixError}
      />
    )}
    {loading ? (
      <LoadingIndicator />
    ) : (
      <>
        {accounts.length > 0 &&
          (advanced ? (
            <WalletLedgerChooserTableAdvanced
              accounts={accounts}
              handleAddressChosen={handleAddressChosen}
              hasPreviousAddress={hasPreviousAddress}
              showPrevAddresses={showPrevAddresses}
              showNextAddresses={showNextAddresses}
              loading={loading}
            />
          ) : (
            <WalletLedgerChooserTableSimple
              accounts={accounts}
              handleAddressChosen={handleAddressChosen}
            />
          ))}
        {!advanced && (
          <div className={styles.advanced}>
            <Button outline color="secondary" onClick={handleAdvanced} data-test-id="btn-advanced">
              Advanced selection
            </Button>
          </div>
        )}
      </>
    )}
  </>
);
