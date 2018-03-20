import * as React from "react";
import { ButtonSecondary } from "../../shared/Buttons";
import { Date } from "../../shared/Date";
import { InlineIcon } from "../../shared/InlineIcon";
import { Money, MoneyTransfer } from "../../shared/Money";
import { PanelDark } from "../../shared/PanelDark";
import { TableBody } from "../../shared/table/TableBody";
import { TableCell } from "../../shared/table/TableCell";
import { TableRow } from "../../shared/table/TableRow";
import { TotalEuro } from "../TotalEuro";
import * as styles from "./ClaimedDividends.module.scss";

import * as LinkOutIcon from "../../../assets/img/inline_icons/link_out.svg";
import * as neuIcon from "../../../assets/img/neu_icon.svg";

export interface IDividendPayout {
  timestamp: number;
  amount: string;
  id: any;
}

interface IClaimedDividendsProps {
  totalEurValue: string;
  recentPayouts: IDividendPayout[];
}

export const ClaimedDividends: React.SFC<IClaimedDividendsProps> = ({
  totalEurValue,
  recentPayouts,
}) => (
  <div className={styles.claimedDividends}>
    <PanelDark
      icon={neuIcon}
      headerText="Dividends claimed from neu"
      rightComponent={<TotalEuro totalEurValue={totalEurValue} />}
    >
      <h3 className={styles.title}>Most rescent</h3>
      <TableBody>
        {recentPayouts.map(({ timestamp, amount, id }) => (
          <TableRow key={`table-row-claimed-dividends-${id}`}>
            <TableCell narrow>
              <Date timestamp={timestamp} />
            </TableCell>
            <TableCell narrow>
              <Money currency="eur_token" value={amount} transfer={MoneyTransfer.in} />
            </TableCell>
            <TableCell narrow>
              <ButtonSecondary>
                <span>TXN</span>
                <InlineIcon svgIcon={LinkOutIcon} />
              </ButtonSecondary>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PanelDark>
  </div>
);
