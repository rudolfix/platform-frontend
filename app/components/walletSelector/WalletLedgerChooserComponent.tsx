import * as cn from "classnames";
import * as React from "react";
import { Button } from "reactstrap";

import { ILedgerAccount } from "../../modules/wallet-selector/ledger-wizard/reducer";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import * as styles from "./WalletLedgerChooserComponent.module.scss";
import { WalletLedgerDPChooser } from "./WalletLedgerDPChooser";

interface IAccountRow {
  ledgerAccount: ILedgerAccount;
  handleAddressChosen: (ledgerAccount: ILedgerAccount) => void;
}

export class AccountRow extends React.Component<IAccountRow> {
  public constructor(props: IAccountRow) {
    super(props);
  }

  handleClick = () => {
    this.props.handleAddressChosen(this.props.ledgerAccount);
  };

  render(): React.ReactNode {
    return (
      <tr
        data-test-id="account-row"
        onClick={this.handleClick}
        className={cn(styles.accountRow, {
          [styles.withEther]: parseInt(this.props.ledgerAccount.balanceETH, 10) > 0,
        })}
      >
        <td data-test-id="account-derivation-path">{this.props.ledgerAccount.derivationPath}</td>
        <td data-test-id="account-address" className={styles.address}>
          {this.props.ledgerAccount.address}
        </td>
        <td data-test-id="account-balance">{this.props.ledgerAccount.balanceETH}</td>
        <td>
          <i className="fa fa-chevron-right" aria-hidden="true" />
        </td>
      </tr>
    );
  }
}

export interface IWalletLedgerChooserComponent {
  accounts: ILedgerAccount[];
  hasPreviousAddress: boolean;
  loading: boolean;
  advanced: boolean;
}

export interface IWalletLedgerChooserComponentDispatchProps {
  onDerivationPathPrefixChange: (derivationPathprefix: string) => void;
  onDerivationPathError: () => void;
  handleAddressChosen: (account: ILedgerAccount) => void;
  showPrevAddresses: () => any;
  showNextAddresses: () => any;
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
  onDerivationPathError,
  handleAdvanced,
}) => (
  <div>
    {advanced && (
      <WalletLedgerDPChooser
        onChange={onDerivationPathPrefixChange}
        onDerivationPathError={onDerivationPathError}
      />
    )}
    {loading ? (
      <LoadingIndicator />
    ) : (
      accounts.length > 0 && (
        <>
          <table className={styles.chooserTable}>
            <thead>
              <tr>
                <th>Derivation path</th>
                <th className={styles.address}>Address</th>
                <th>ETH balance</th>
                <th className={styles.useColumn}>Use this address</th>
              </tr>
            </thead>
            <tbody data-test-id="wallet-ledger-accounts-table-body">
              {accounts.map(a => (
                <AccountRow
                  key={a.derivationPath}
                  ledgerAccount={a}
                  handleAddressChosen={handleAddressChosen}
                />
              ))}
            </tbody>
            {advanced && (
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <div>
                      {hasPreviousAddress && (
                        <Button
                          color="primary"
                          disabled={loading}
                          onClick={showPrevAddresses}
                          data-test-id="btn-previous"
                        >
                          Show previous addresses
                        </Button>
                      )}
                      <Button
                        color="primary"
                        disabled={loading}
                        onClick={showNextAddresses}
                        className="float-right"
                        data-test-id="btn-next"
                      >
                        Load more addresses
                      </Button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
          <Button onClick={handleAdvanced} data-test-id="btn-advanced">
            {advanced ? "Show simple" : "Show advanced"}
          </Button>
        </>
      )
    )}
  </div>
);
