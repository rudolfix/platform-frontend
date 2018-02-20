import * as cn from "classnames";
import * as React from "react";
import { Button } from "reactstrap";

import { ILedgerAccount } from "../../modules/wallet-selector/ledger-wizard/reducer";
import * as styles from "./WalletLedgerChooserTableAdvanced.module.scss";

interface IAccountRow {
  ledgerAccount: ILedgerAccount;
  handleAddressChosen: (ledgerAccount: ILedgerAccount) => void;
}

export class AccountRow extends React.Component<IAccountRow> {
  handleClick = () => {
    this.props.handleAddressChosen(this.props.ledgerAccount);
  };

  render(): React.ReactNode {
    return (
      <tr
        data-test-id="account-row"
        className={cn(styles.accountRow, {
          [styles.withEther]: parseInt(this.props.ledgerAccount.balanceETH, 10) > 0,
        })}
      >
        <td data-test-id="account-derivation-path" className={styles.derivationPath}>
          {this.props.ledgerAccount.derivationPath}
        </td>
        <td data-test-id="account-address" className={styles.publicKey}>
          {this.props.ledgerAccount.address}
        </td>
        <td className={styles.balance}>
          <div data-test-id="account-balance-eth" className={styles.eth}>
            {this.props.ledgerAccount.balanceETH} <span>ETH</span>
          </div>
          <div data-test-id="account-balance-neu" className={styles.neu}>
            {this.props.ledgerAccount.balanceNEU} <span>NEU</span>
          </div>
        </td>
        <td className={styles.select}>
          <Button data-test-id="button-select" color="primary" onClick={this.handleClick}>
            Select
          </Button>
        </td>
      </tr>
    );
  }
}

export interface IWalletLedgerChooserTableAdvanced {
  accounts: ILedgerAccount[];
  handleAddressChosen: (ledgerAccount: ILedgerAccount) => void;
  loading: boolean;
  hasPreviousAddress: boolean;
  showPrevAddresses: () => void;
  showNextAddresses: () => void;
}

export const WalletLedgerChooserTableAdvanced: React.SFC<IWalletLedgerChooserTableAdvanced> = ({
  accounts,
  handleAddressChosen,
  hasPreviousAddress,
  showPrevAddresses,
  showNextAddresses,
  loading,
}) => (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Derivation path</th>
        <th>Public wallet ID</th>
        <th colSpan={2}>balance</th>
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
                Previous
              </Button>
            )}
            <Button
              color="primary"
              disabled={loading}
              onClick={showNextAddresses}
              className="float-right"
              data-test-id="btn-next"
            >
              Next
            </Button>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
);
