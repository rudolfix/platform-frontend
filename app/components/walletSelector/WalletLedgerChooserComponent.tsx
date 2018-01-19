import * as cn from "classnames";
import { TextField } from "material-ui";
import * as React from "react";
import { Button } from "reactstrap";

import { ILedgerAccount } from "../../../typings/typings";
import { LoadingIndicator } from "../LoadingIndicator";
import * as styles from "./WalletLedgerChooserComponent.module.scss";

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
        onClick={this.handleClick}
        className={cn(styles.useColumn, {
          [styles.withEther]: parseInt(this.props.ledgerAccount.balance, 10) > 0,
        })}
      >
        <td>{this.props.ledgerAccount.derivationPath}</td>
        <td className={styles.address}>{this.props.ledgerAccount.address}</td>
        <td>{this.props.ledgerAccount.balance}</td>
        <td>
          <i className="fa fa-chevron-right" aria-hidden="true" />
        </td>
      </tr>
    );
  }
}

interface IWalletLedgerChooserComponent {
  accounts: ILedgerAccount[];
  handleAddressChosen: (ledgerAccount: ILedgerAccount) => void;
  hasPreviousAddress: boolean;
  showPrevAddresses: () => any;
  showNextAddresses: () => any;
  loading: boolean;
  derivationPath: string;
  onDerivationPathChange: any;
  invalidDerivationPath: boolean;
}

export const WalletLedgerChooserComponent: React.SFC<IWalletLedgerChooserComponent> = ({
  accounts,
  handleAddressChosen,
  hasPreviousAddress,
  showPrevAddresses,
  showNextAddresses,
  loading,
  derivationPath,
  onDerivationPathChange,
  invalidDerivationPath,
}) => (
  <div>
    <div>
      <TextField
        name="derivationPathField"
        value={derivationPath}
        onChange={onDerivationPathChange}
        errorText={invalidDerivationPath && "Invalid derivation path"}
      />
      - Change your derivation path, if necessary.
    </div>
    {loading ? (
      <LoadingIndicator />
    ) : (
      <table className={styles.chooserTable}>
        <thead>
          <tr>
            <th>Derivation path</th>
            <th className={styles.address}>Address</th>
            <th>ETH balance</th>
            <th className={styles.useColumn}>Use this address</th>
          </tr>
        </thead>
        <tbody>
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
                  <Button color="primary" disabled={loading} onClick={showPrevAddresses}>
                    Show previous addresses
                  </Button>
                )}
                <Button
                  color="primary"
                  disabled={loading}
                  onClick={showNextAddresses}
                  className="float-right"
                >
                  Load more addresses
                </Button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    )}
  </div>
);
