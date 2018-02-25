import * as React from "react";
import { Button } from "reactstrap";

import { ILedgerAccount } from "../../modules/wallet-selector/ledger-wizard/reducer";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import * as styles from "./WalletLedgerChooserComponent.module.scss";
import { WalletLedgerChooserTableAdvanced } from "./WalletLedgerChooserTableAdvanced";
import { WalletLedgerChooserTableSimple } from "./WalletLedgerChooserTableSimple";
import { WalletLedgerDPChooser } from "./WalletLedgerDPChooser";
import * as cn from "classnames";

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
            <span onClick={handleAdvanced} data-test-id="btn-advanced-simple">
              Advanced options
              <i className="fa fa-chevron-down ml-2" aria-hidden="true" />
            </span>
          </div>
        )}
      </>
    )}
    <div className="mt-5 d-flex flex-row justify-content-between align-items-center">
      <div>
        {advanced &&
          !loading && (
            <Button
              outline
              color="secondary"
              onClick={handleAdvanced}
              data-test-id="btn-advanced-advanced"
            >
              Back
            </Button>
          )}
      </div>
      <div>
        Have some issues with your NeuKey? <a href="#">Contact for help</a>
      </div>
    </div>
  </>
);
