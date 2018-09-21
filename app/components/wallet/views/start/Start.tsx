import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
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
import { selectIsLoading, selectWalletError } from "../../../../modules/wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { LoadingIndicator } from "../../../shared/LoadingIndicator";
import { ClaimedDividends } from "../../claimed-dividends/ClaimedDividends";
import {
  IcbmWallet,
  IWalletValues,
  LockedWallet,
  UnlockedWallet,
} from "../../wallet-balance/WalletBalance";

const transactions: any[] = [];

interface IStateProps {
  error?: string;
  liquidWalletData: IWalletValues;
  lockedWalletData: IWalletValues & { hasFunds: boolean };
  icbmWalletData: IWalletValues & { hasFunds: boolean };
  userAddress: string;
  isLoading: boolean;
}

interface IDispatchProps {
  depositEthUnlockedWallet: () => void;
  withdrawEthUnlockedWallet: () => void;
}

type TProps = IStateProps & IDispatchProps;

export const WalletStartComponent: React.SFC<TProps> = ({
  userAddress,
  liquidWalletData,
  lockedWalletData,
  icbmWalletData,
  isLoading,
  depositEthUnlockedWallet,
  withdrawEthUnlockedWallet,
}) => {
  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      <Row className="row-gutter-top">
        <Col lg={6} xs={12}>
          <UnlockedWallet
            className="h-100"
            headerText={<FormattedMessage id="components.wallet.start.my-wallet" />}
            data={liquidWalletData}
            depositEth={depositEthUnlockedWallet}
            withdrawEth={withdrawEthUnlockedWallet}
            address={userAddress}
          />
        </Col>

        {lockedWalletData.hasFunds && (
          <Col lg={6} xs={12}>
            <LockedWallet
              className="h-100"
              headerText={<FormattedMessage id="components.wallet.start.locked-wallet" />}
              data={lockedWalletData}
            />
          </Col>
        )}

        {icbmWalletData.hasFunds && (
          <Col lg={6} xs={12}>
            <IcbmWallet
              className="h-100"
              headerText={<FormattedMessage id="components.wallet.start.icbm-wallet" />}
              onUpgradeClick={() => {}}
              data={icbmWalletData}
            />
          </Col>
        )}
      </Row>
      <Row>
        <Col className="my-4">
          <ClaimedDividends className="h-100" totalEurValue="0" recentPayouts={transactions} />
        </Col>
      </Row>
    </>
  );
};

export const WalletStart = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.wallet.startLoadingWalletData()),
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      userAddress: selectEthereumAddressWithChecksum(state.web3),
      // Wallet Related State
      isLoading: selectIsLoading(state.wallet),
      error: selectWalletError(state.wallet),
      liquidWalletData: {
        ethAmount: selectLiquidEtherBalance(state.wallet),
        ethEuroAmount: selectLiquidEtherBalanceEuroAmount(state),
        neuroAmount: selectLiquidEuroTokenBalance(state.wallet),
        neuroEuroAmount: selectLiquidEuroTokenBalance(state.wallet),
        totalEuroAmount: selectLiquidEuroTotalAmount(state),
      },
      lockedWalletData: {
        hasFunds: selectLockedWalletHasFunds(state),
        ethAmount: selectLockedEtherBalance(state.wallet),
        ethEuroAmount: selectLockedEtherBalanceEuroAmount(state),
        neuroAmount: selectLockedEuroTokenBalance(state.wallet),
        neuroEuroAmount: selectLockedEuroTokenBalance(state.wallet),
        totalEuroAmount: selectLockedEuroTotalAmount(state),
      },
      icbmWalletData: {
        hasFunds: selectICBMLockedWalletHasFunds(state),
        ethAmount: selectICBMLockedEtherBalance(state.wallet),
        ethEuroAmount: selectICBMLockedEtherBalanceEuroAmount(state),
        neuroAmount: selectICBMLockedEuroTokenBalance(state.wallet),
        neuroEuroAmount: selectICBMLockedEuroTokenBalance(state.wallet),
        totalEuroAmount: selectICBMLockedEuroTotalAmount(state),
      },
    }),
    dispatchToProps: dispatch => ({
      depositEthUnlockedWallet: () => dispatch(actions.depositEthModal.showDepositEthModal()),
      withdrawEthUnlockedWallet: () => dispatch(actions.txSender.startWithdrawEth()),
    }),
  }),
)(WalletStartComponent);
