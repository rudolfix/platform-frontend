import * as cn from "classnames";
import * as React from "react";

import { ILedgerAccount } from "../../modules/wallet-selector/ledger-wizard/reducer";
import { Button } from "../shared/Buttons";
import { NavigationButton } from "../shared/Navigation";
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
      <tr data-test-id="account-row" className={styles.accountRow}>
        <td data-test-id="account-derivation-path" className={styles.derivationPath}>
          {this.props.ledgerAccount.derivationPath}
        </td>
        <td
          data-test-id="account-address"
          className={cn(styles.publicKey, styles.pseudoBorderLeft)}
        >
          {this.props.ledgerAccount.address}
        </td>
        <td className={cn(styles.balance, styles.pseudoBorderLeft)}>
          <div data-test-id="account-balance-eth" className={styles.eth}>
            {this.props.ledgerAccount.balanceETH} ETH
          </div>
          <div data-test-id="account-balance-neu" className={styles.neu}>
            {this.props.ledgerAccount.balanceNEU} NEU
          </div>
        </td>
        <td className={styles.select}>
          <Button layout="secondary" data-test-id="button-select" onClick={this.handleClick}>
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
}) => (
  <table className={cn(styles.table, "mt-3")}>
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
          <NavigationButton
            text="Previous"
            disabled={!hasPreviousAddress}
            forward={false}
            onClick={showPrevAddresses}
            data-test-id="btn-previous"
          />

          <NavigationButton
            text="Next"
            forward
            onClick={showNextAddresses}
            className="float-right"
            data-test-id="btn-next"
          />
        </td>
      </tr>
    </tfoot>
  </table>
);
