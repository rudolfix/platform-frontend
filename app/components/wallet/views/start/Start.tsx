import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { actions } from "../../../../modules/actions";
import {
  selectICBMLockedEtherBalance,
  selectICBMLockedEtherBalanceEuroAmount,
  selectICBMLockedEuroTokenBalance,
  selectICBMLockedEuroTotalAmount,
  selectICBMLockedWalletHasFunds,
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLiquidEuroTokenBalance,
  selectLiquidEuroTotalAmount,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedEuroTokenBalance,
  selectLockedEuroTotalAmount,
  selectLockedWalletHasFunds,
} from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { ClaimedDividends } from "../../claimed-dividends/ClaimedDividends";
import { TransactionList } from "../../transaction-list/TransactionList";
import { IWalletValues, WalletBalance } from "../../wallet-balance/WalletBalance";

const transactions: any[] = [];
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

interface IStateProps {
  isLoading: boolean;
  error?: string;
  liquidWalletData?: IWalletValues;
  lockedWalletData?: IWalletValues & { hasFunds: boolean };
  icbmWalletData?: IWalletValues & { hasFunds: boolean };
}

interface IDispatchProps {
  goToDepositEuroToken: () => void;
  goToDepositEth: () => void;
}

type TProps = IStateProps & IDispatchProps;

const WalletStartComponent: React.SFC<TProps> = props => (
  <Row className="row-gutter-top">
    <Col lg={6} xs={12}>
      <WalletBalance
        isLocked={false}
        className="h-100"
        headerText="Your wallet balance"
        depositEuroTokenFunds={props.goToDepositEuroToken}
        depositEthFunds={props.goToDepositEth}
        isLoading={props.isLoading}
        data={props.liquidWalletData}
      />
    </Col>

    {!props.isLoading &&
      props.lockedWalletData!.hasFunds && (
        <Col lg={6} xs={12}>
          <WalletBalance
            isLocked={true}
            className="h-100"
            headerText="ICBM Wallet"
            depositEuroTokenFunds={props.goToDepositEuroToken}
            depositEthFunds={props.goToDepositEth}
            isLoading={props.isLoading}
            data={props.lockedWalletData}
          />
        </Col>
      )}

    {!props.isLoading &&
      props.icbmWalletData!.hasFunds && (
        <Col lg={6} xs={12}>
          <WalletBalance
            isLocked={true}
            className="h-100"
            headerText="ICBM Wallet"
            depositEuroTokenFunds={props.goToDepositEuroToken}
            depositEthFunds={props.goToDepositEth}
            isLoading={props.isLoading}
            data={props.icbmWalletData}
          />
        </Col>
      )}

    <Col
      xs={12}
      lg={
        !props.isLoading && !props.icbmWalletData!.hasFunds && !props.lockedWalletData!.hasFunds
          ? 6
          : 12
      }
    >
      <ClaimedDividends className="h-100" totalEurValue="0" recentPayouts={transactions} />
    </Col>

    <Col xs={12}>
      <TransactionList transactions={transactions} categories={categories} tabs={tabs} />
    </Col>
  </Row>
);

export const WalletStart = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.wallet.startLoadingWalletData()),
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => {
      const isLoading = s.wallet.loading;
      const error = s.wallet.error;

      if (!isLoading && !error) {
        const walletData = s.wallet.data!;
        return {
          isLoading,
          error,
          liquidWalletData: {
            euroTokenEuroAmount: selectLiquidEuroTokenBalance(walletData),
            euroTokenAmount: selectLiquidEuroTokenBalance(walletData),
            ethAmount: selectLiquidEtherBalance(walletData),
            ethEuroAmount: selectLiquidEtherBalanceEuroAmount(walletData),
            totalEuroAmount: selectLiquidEuroTotalAmount(walletData),
          },
          lockedWalletData: {
            hasFunds: selectLockedWalletHasFunds(walletData),
            euroTokenEuroAmount: selectLockedEuroTokenBalance(walletData),
            euroTokenAmount: selectLockedEuroTokenBalance(walletData),
            ethAmount: selectLockedEtherBalance(walletData),
            ethEuroAmount: selectLockedEtherBalanceEuroAmount(walletData),
            totalEuroAmount: selectLockedEuroTotalAmount(walletData),
          },
          icbmWalletData: {
            hasFunds: selectICBMLockedWalletHasFunds(walletData),
            euroTokenEuroAmount: selectICBMLockedEuroTokenBalance(walletData),
            euroTokenAmount: selectICBMLockedEuroTokenBalance(walletData),
            ethAmount: selectICBMLockedEtherBalance(walletData),
            ethEuroAmount: selectICBMLockedEtherBalanceEuroAmount(walletData),
            totalEuroAmount: selectICBMLockedEuroTotalAmount(walletData),
          },
        };
      } else {
        return {
          isLoading,
          error,
        };
      }
    },
    dispatchToProps: dispatch => ({
      goToDepositEuroToken: () => dispatch(actions.routing.goToDepositEuroToken()),
      goToDepositEth: () => dispatch(actions.routing.goToDepositEth()),
    }),
  }),
)(WalletStartComponent);
