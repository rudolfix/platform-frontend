import * as cn from "classnames";
import { TextField } from "material-ui";
import * as React from "react";
import { Button } from "reactstrap";

import { ILedgerAccount } from "../../../typings/typings";
import { LoadingIndicator } from "../LoadingIndicator";
import * as styles from "./WalletLedgerChooserComponent.module.scss";

export interface IWalletLedgerChooserComponent {
  accounts: ILedgerAccount[];
  hasPreviousAddress: boolean;
  loading: boolean;
  derivationPath: string;
  onDerivationPathChange: any;
  invalidDerivationPath: boolean;
}

export interface IWalletLedgerChooserComponentDispatchProps {
  handleAddressChosen: (account: ILedgerAccount) => void;
  showPrevAddresses: () => any;
  showNextAddresses: () => any;
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
        <tbody data-test-id="wallet-ledger-accounts-table-body">
          {accounts.map(a => (
            <tr
              key={a.derivationPath}
              onClick={
                // tslint:disable-next-line
                () => handleAddressChosen(a)
              }
              className={cn(styles.useColumn, { [styles.withEther]: parseInt(a.balance, 10) > 0 })}
            >
              <td>{a.derivationPath}</td>
              <td className={styles.address}>{a.address}</td>
              <td>{a.balance}</td>
              <td>
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </td>
            </tr>
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
