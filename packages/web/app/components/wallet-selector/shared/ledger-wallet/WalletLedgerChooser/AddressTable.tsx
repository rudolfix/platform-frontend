import { Button, EButtonLayout, Eth, Neu, Table, TokenIcon } from "@neufund/design-system";
import { trimAddress } from "@neufund/shared-utils";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ILedgerAccount } from "../../../../../modules/wallet-selector/ledger-wizard/reducer";
import { Tooltip } from "../../../../shared/tooltips/Tooltip";
import { ECustomTooltipTextPosition } from "../../../../shared/tooltips/TooltipBase";

import ethIcon from "../../../../../assets/img/eth_icon.svg";
import neuIcon from "../../../../../assets/img/neu_icon.svg";
import * as styles from "./AddressTable.module.scss";

export interface IAddressTableProps {
  accounts: ReadonlyArray<ILedgerAccount>;
  handleAddressChosen: (ledgerAccount: ILedgerAccount) => void;
}

const columns = [
  {
    Header: (
      <FormattedMessage id="wallet-selector.ledger.derivation-path-selector.list.header.derivation-path" />
    ),
    accessor: "derivationPath",
  },
  {
    Header: (
      <FormattedMessage id="wallet-selector.ledger.derivation-path-selector.list.header.address" />
    ),
    accessor: "address",
  },
  {
    Header: (
      <span>
        <TokenIcon srcSet={{ "1x": ethIcon }} alt="" className={cn("mr-2", styles.token)} />
        <FormattedMessage id="wallet-selector.ledger.derivation-path-selector.list.header.eth" />
      </span>
    ),
    accessor: "balanceETH",
  },
  {
    Header: (
      <span>
        <TokenIcon srcSet={{ "1x": neuIcon }} alt="" className={cn("mr-2", styles.token)} />
        <FormattedMessage id="wallet-selector.ledger.derivation-path-selector.list.header.neu" />
      </span>
    ),
    accessor: "balanceNEU",
  },
  { Header: "", accessor: "actions" },
];

const prepareRows = (
  accounts: ReadonlyArray<ILedgerAccount>,
  handleAddressChosen: (account: ILedgerAccount) => void,
) =>
  accounts.map((account: ILedgerAccount) => ({
    key: account.derivationPath,
    address: (
      <Tooltip
        content={account.address}
        textPosition={ECustomTooltipTextPosition.CENTER}
        className="mt-1"
      >
        {trimAddress(account.address)}
      </Tooltip>
    ),
    derivationPath: account.derivationPath,
    balanceETH: <Eth value={account.balanceETH} />,
    balanceNEU: <Neu value={account.balanceNEU} />,
    actions: (
      <Button
        layout={EButtonLayout.SECONDARY}
        data-test-id="button-select"
        onClick={() => handleAddressChosen(account)}
      >
        <FormattedMessage id="wallet-selector.ledger.derivation-path-selector.list.row.select-button" />
      </Button>
    ),
  }));

export const AddressTable: React.FunctionComponent<IAddressTableProps> = ({
  accounts,
  handleAddressChosen,
}) => <Table data={prepareRows(accounts, handleAddressChosen)} columns={columns} />;
