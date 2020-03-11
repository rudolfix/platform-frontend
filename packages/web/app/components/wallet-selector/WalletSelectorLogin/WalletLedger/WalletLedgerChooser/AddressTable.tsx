import { Button, EButtonLayout, Table, TokenIcon } from "@neufund/design-system";
import { trimAddress } from "@neufund/shared";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ILedgerAccount } from "../../../../../modules/wallet-selector/ledger-wizard/reducer";
import { Money } from "../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../shared/formatters/utils";
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
    balanceETH: (
      <Money
        value={account.balanceETH}
        inputFormat={ENumberInputFormat.ULPS}
        valueType={ECurrency.ETH}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
      />
    ),
    balanceNEU: (
      <Money
        value={account.balanceNEU}
        inputFormat={ENumberInputFormat.ULPS}
        valueType={ECurrency.NEU}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
      />
    ),
    actions: (
      <Button
        layout={EButtonLayout.OUTLINE}
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
