import * as React from "react";
import { Col, Row } from "reactstrap";
import { ButtonSecondary } from "../../shared/Buttons";
import { Date } from "../../shared/Date";
import { InlineIcon } from "../../shared/InlineIcon";
import { Money, MoneyTransfer } from "../../shared/Money";
import { TableBody } from "../../shared/table/TableBody";
import { TableCell } from "../../shared/table/TableCell";
import { TableHeader } from "../../shared/table/TableHeader";
import { TableRow } from "../../shared/table/TableRow";
import * as styles from "./TransactionList.module.scss";

import * as LinkOutIcon from "../../../assets/img/inline_icons/link_out.svg";
import * as AddIcon from "../../../assets/img/inline_icons/plus.svg";

export enum TransactionType {
  Withdraw = "withdraw",
  Deposit = "deposit",
  Investment = "investment",
}

export interface ITransaction {
  timestamp: number;
  type: TransactionType;
  amount: string;
  fromTo: string;
  transfer: MoneyTransfer;
  id: any;
}

interface ICategory {
  title: string;
  isSelected: boolean;
  onFilter: () => void;
}

interface ITransactionList {
  transactions: ITransaction[];
  categories: ICategory[];
}

export const TransactionList: React.SFC<ITransactionList> = ({ transactions, categories }) => (
  <Col className={styles.transactionList}>
    <Row>
      <Col>
        <div className={styles.categories}>
          {categories.map(({ title, onFilter, isSelected }) => (
            <div
              onClick={onFilter}
              className={`${styles.category} ${isSelected ? "is-selected" : ""}`}
              key={`category-${title}`}
            >
              {title}
            </div>
          ))}
        </div>
      </Col>
    </Row>
    <Row>
      <Col />
    </Row>
    <Row>
      <TableHeader>
        <TableCell>Date</TableCell>
        <TableCell>Transaction type</TableCell>
        <TableCell>Amount</TableCell>
        <TableCell>From/To</TableCell>
        <TableCell center>TXN</TableCell>
        <TableCell center />
      </TableHeader>
    </Row>
    <Row>
      <Col>
        <TableBody>
          {transactions.map(({ id, timestamp, type, amount, fromTo, transfer }) => (
            <TableRow key={id}>
              <TableCell>
                <Date timestamp={timestamp} />
              </TableCell>
              <TableCell>{type}</TableCell>
              <TableCell>
                <Money currency="eur_token" value={amount} transfer={transfer} />
              </TableCell>
              <TableCell>{fromTo}</TableCell>
              <TableCell center>
                <ButtonSecondary>
                  <InlineIcon svgIcon={LinkOutIcon} />
                </ButtonSecondary>
              </TableCell>
              <TableCell center>
                <ButtonSecondary>
                  <InlineIcon svgIcon={AddIcon} />
                </ButtonSecondary>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Col>
    </Row>
  </Col>
);
