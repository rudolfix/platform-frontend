import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { actions } from "../../../../modules/actions";
import {
  selectICBMLockedEtherBalance,
  selectICBMLockedEtherBalanceEuroAmount,
  selectICBMLockedWalletHasFunds,
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedWalletHasFunds,
} from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { IWalletValues, WalletBalance } from "../../wallet-balance/WalletBalance";

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

export const WalletStartComponent: React.SFC<TProps> = props => (
  <Row className="row-gutter-top">
    <Col lg={6} xs={12}>
      <WalletBalance
        isLocked={false}
        headerText={<FormattedMessage id="components.wallet.start.my-wallet" />}
        isLoading={props.isLoading}
        data={props.liquidWalletData}
      />
    </Col>

    {!props.isLoading && (
      <Col lg={6} xs={12}>
        <WalletBalance
          isLocked={true}
          headerText={<FormattedMessage id="components.wallet.start.icbm-wallet" />}
          isLoading={props.isLoading}
          data={props.icbmWalletData}
          isIcbmLocked={true}
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
    />
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
            ethAmount: selectLiquidEtherBalance(walletData),
            ethEuroAmount: selectLiquidEtherBalanceEuroAmount(walletData),
          },
          lockedWalletData: {
            hasFunds: selectLockedWalletHasFunds(walletData),
            ethAmount: selectLockedEtherBalance(walletData),
            ethEuroAmount: selectLockedEtherBalanceEuroAmount(walletData),
          },
          icbmWalletData: {
            hasFunds: selectICBMLockedWalletHasFunds(walletData),
            ethAmount: selectICBMLockedEtherBalance(walletData),
            ethEuroAmount: selectICBMLockedEtherBalanceEuroAmount(walletData),
          },
        };
      } else {
        return {
          isLoading,
          error,
        };
      }
    },
  }),
)(WalletStartComponent);
