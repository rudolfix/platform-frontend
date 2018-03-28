import * as React from "react";
import { Col, Row } from "reactstrap";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MoneyTransfer } from "../shared/Money";
import { ClaimedDividends } from "./claimed-dividends/ClaimedDividends";
import * as styles from "./ManageWallet.module.scss";
import { TransactionList, TransactionType } from "./transaction-list/TransactionList";
import { WalletBalance } from "./wallet-balance/WalletBalance";

const timestamp = Date.now();
const amount = "1234" + "0".repeat(18);
const fromTo = "from/to string";
const transactions = [
  { timestamp, amount, type: TransactionType.Deposit, fromTo, id: 1, transfer: MoneyTransfer.in },
  { timestamp, amount, type: TransactionType.Deposit, fromTo, id: 2, transfer: MoneyTransfer.out },
  { timestamp, amount, type: TransactionType.Deposit, fromTo, id: 3, transfer: MoneyTransfer.in },
];
const categories = [
  {
    isSelected: false,
    title: "smaple category",
    onFilter: () => alert("sample category 1"),
  },
  {
    isSelected: true,
    title: "category 2",
    onFilter: () => alert("sample category 2"),
  },
  {
    isSelected: false,
    title: "smaple 3",
    onFilter: () => alert("sample category 3"),
  },
];
const tabs = [
  {
    isSelected: false,
    title: "neur transactions",
    onFilter: () => alert("nEUR"),
  },
  {
    isSelected: true,
    title: "eth transactions",
    onFilter: () => alert("eth"),
  },
];
const chartDoughnutData = {
  labels: ["ETH", "nEUR"],
  datasets: [
    {
      data: [100, 50],
      backgroundColor: ["#e3eaf5", "#394651"],
    },
  ],
};

export const ManageWallet = () => (
  <LayoutAuthorized>
    <Row className="row-gutter-top">
      <Col className={styles.card} lg={6} xs={12}>
        <WalletBalance
          moneyValueOne={66482000000000000000000}
          moneyValueTwo={36490000000000000000000}
          chartData={chartDoughnutData}
          headerText="Your wallet balance"
          totalEurValue={"1234567" + "0".repeat(18)}
        />
      </Col>
      <Col className={styles.dividends} lg={6} xs={12}>
        <ClaimedDividends totalEurValue={"1234" + "0".repeat(18)} recentPayouts={transactions} />
      </Col>
      <Col className={styles.transactionList} xs={12}>
        <TransactionList transactions={transactions} categories={categories} tabs={tabs} />
      </Col>
    </Row>
  </LayoutAuthorized>
);
