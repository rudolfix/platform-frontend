import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";
import { compose } from "redux";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { actions } from "../../../../modules/actions";
import {
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investmentFlow/reducer";
import {
  selectErrorState,
  selectEthValueUlps,
  selectEurValueUlps,
  selectInvestmentGasCostEth,
  selectInvestmentType,
  selectReadyToInvest,
} from "../../../../modules/investmentFlow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectEtoById,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/public-etos/selectors";
import { selectEtherPriceEur } from "../../../../modules/shared/tokenPrice/selectors";
import {
  selectICBMLockedEtherBalance,
  selectICBMLockedEtherBalanceEuroAmount,
  selectICBMLockedEuroTokenBalance,
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
} from "../../../../modules/wallet/selectors";
import { appConnect, IAppState } from "../../../../store";
import {
  addBigNumbers,
  divideBigNumbers,
  multiplyBigNumbers,
} from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { formatMoney, formatThousands } from "../../../../utils/Money.utils";
import { InfoAlert } from "../../../shared/Alerts";
import { Button } from "../../../shared/Buttons";
import { FormFieldRaw } from "../../../shared/forms/formField/FormFieldRaw";
import { Heading } from "../../../shared/modals/Heading";
import { InvestmentTypeSelector, IWalletSelectionData } from "./InvestmentTypeSelector";

import * as ethIcon from "../../../../assets/img/eth_icon2.svg";
import * as euroIcon from "../../../../assets/img/euro_icon.svg";
import * as neuroIcon from "../../../../assets/img/neuro_icon.svg";
import * as styles from "./Investment.module.scss";

interface IStateProps {
  wallets: IWalletSelectionData[];
  euroValue: string;
  ethValue: string;
  etherPriceEur: string;
  investmentType: EInvestmentType;
  gasCostEth: string;
  errorState?: EInvestmentErrorState;
  equityTokenCount?: string;
  neuReward?: string;
  minTicketEur: number;
  readyToInvest: boolean;
  showTokens: boolean;
}

interface IDispatchProps {
  sendTransaction: () => void;
  changeEuroValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  changeEthValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  changeInvestmentType: (type: EInvestmentType) => void;
}

type IProps = IStateProps & IDispatchProps & IIntlProps;

function createWallets(state: IAppState): IWalletSelectionData[] {
  const w = state.wallet;
  return [
    {
      balanceEth: selectICBMLockedEtherBalance(w),
      balanceEur: selectICBMLockedEtherBalanceEuroAmount(state),
      type: EInvestmentType.ICBMEth,
      name: "ICBM Wallet",
      icon: ethIcon,
    },
    {
      balanceNEuro: selectICBMLockedEuroTokenBalance(w),
      balanceEur: selectICBMLockedEuroTokenBalance(w),
      type: EInvestmentType.ICBMnEuro,
      name: "ICBM Wallet",
      icon: neuroIcon,
    },
    {
      balanceEth: selectLiquidEtherBalance(w),
      balanceEur: selectLiquidEtherBalanceEuroAmount(state),
      type: EInvestmentType.InvestmentWallet,
      name: "Investment Wallet",
      icon: ethIcon,
    },
    {
      type: EInvestmentType.BankTransfer,
      name: "Direct Bank Transfer",
      icon: euroIcon,
    },
  ];
}

function getInvestmentTypeMessages(type: EInvestmentType): React.ReactNode {
  switch (type) {
    case EInvestmentType.ICBMEth:
    case EInvestmentType.ICBMnEuro:
      return <FormattedHTMLMessage id="investment-flow.icbm-wallet-info-message" tagName="p" />;
    case EInvestmentType.BankTransfer:
      return <FormattedHTMLMessage id="investment-flow.bank-transfer-info-message" tagName="p" />;
  }
}

function getInputErrorMessage(type?: EInvestmentErrorState): React.ReactNode | undefined {
  switch (type) {
    case EInvestmentErrorState.ExceedsTokenAmount:
      return <FormattedMessage id="investment-flow.error-message.exceeds-token-amount" />;
    case EInvestmentErrorState.AboveMaximumTicketSize:
      return <FormattedMessage id="investment-flow.error-message.above-maximum-ticket-size" />;
    case EInvestmentErrorState.BelowMinimumTicketSize:
      return <FormattedMessage id="investment-flow.error-message.below-minimum-ticket-size" />;
    case EInvestmentErrorState.ExceedsWalletBalance:
      return <FormattedMessage id="investment-flow.error-message.exceeds-wallet-balance" />;
  }
}

function formatEur(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 0);
}

function formatEth(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 4);
}

export const InvestmentSelectionComponent = injectIntlHelpers((props: IProps & IIntlProps) => {
  const { euroValue, ethValue, etherPriceEur, minTicketEur, intl, gasCostEth } = props;
  const gasCostEuro = multiplyBigNumbers([gasCostEth, etherPriceEur]);
  const totalCostEth = addBigNumbers([gasCostEth, ethValue || "0"]);
  const totalCostEur = addBigNumbers([gasCostEuro, euroValue || "0"]);
  const minTicketEth = divideBigNumbers(minTicketEur, etherPriceEur);

  return (
    <>
      <Container className={styles.container} fluid>
        <Row className="mt-0">
          <Col>
            <Heading>
              <FormattedMessage id="investment-flow.select-wallet-and-currency" />
            </Heading>
          </Col>
        </Row>
        <Row>
          <InvestmentTypeSelector
            wallets={props.wallets}
            currentType={props.investmentType}
            onSelect={props.changeInvestmentType}
          />
          <Col>
            {getInvestmentTypeMessages(props.investmentType)}
            {props.errorState === EInvestmentErrorState.NoWalletSelected && (
              <p>
                <FormattedMessage id="investment-flow.no-selected-wallet-warning" />
              </p>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Heading>
              <FormattedMessage id="investment-flow.calculate-investment" />
            </Heading>
          </Col>
        </Row>
        <Row>
          <Col>
            {props.errorState === EInvestmentErrorState.NotEnoughEtherForGas ? (
              <p className={styles.error}>
                <FormattedMessage id="investment-flow.error-message.not-enough-ether-for-gas" />
              </p>
            ) : (
              <p>
                <FormattedMessage id="investment-flow.amount-to-invest" />
              </p>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <FormFieldRaw
              prefix="€"
              errorMsg={getInputErrorMessage(props.errorState)}
              placeholder={`${intl.formatIntlMessage(
                "investment-flow.min-ticket-size",
              )} ${minTicketEur} €`}
              controlCursor
              value={formatEur(euroValue)}
              onChange={props.changeEuroValue}
            />
          </Col>
          <Col sm="1">
            <div className={styles.equals}>≈</div>
          </Col>
          <Col>
            <FormFieldRaw
              prefix="ETH"
              placeholder={`${intl.formatIntlMessage(
                "investment-flow.min-ticket-size",
              )} ${formatMoney(minTicketEth, 0, 4)} ETH`}
              controlCursor
              value={formatEth(ethValue)}
              onChange={props.changeEthValue}
            />
            <a className={styles.investAll} href="#" onClick={el => el.preventDefault()}>
              <FormattedMessage id="investment-flow.invest-entire-balance" />
            </a>
          </Col>
        </Row>
      </Container>
      <div className={styles.green}>
        <Container className={styles.container} fluid>
          <Row>
            <Col>
              <FormGroup>
                <Label>
                  <FormattedMessage id="investment-flow.equity-tokens" />
                </Label>
                <InfoAlert>
                  {(props.showTokens &&
                    props.equityTokenCount &&
                    formatThousands(props.equityTokenCount.toString())) ||
                    "\xA0" /* non breaking space*/}
                </InfoAlert>
              </FormGroup>
            </Col>
            <Col sm="1" />
            <Col>
              <FormGroup>
                <Label>
                  <FormattedMessage id="investment-flow.estimated-neu-tokens" />
                </Label>
                <InfoAlert>
                  {(props.showTokens &&
                    props.neuReward &&
                    formatThousands(formatEth(props.neuReward))) ||
                    "\xA0"}
                </InfoAlert>
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className={styles.container} fluid>
        <Row>
          <Col className={styles.summary}>
            <div>
              + <FormattedMessage id="investment-flow.estimated-gas-cost" />:{" "}
              <span className="orange">
                {formatEur(gasCostEuro)} € ≈ ETH {formatEth(gasCostEth)}
              </span>
            </div>
            <div>
              <FormattedMessage id="investment-flow.total" />:{" "}
              <span className="orange">
                {formatThousands(formatEur(totalCostEur))} € ≈ ETH{" "}
                {formatThousands(formatEth(totalCostEth))}
              </span>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center mb-0">
          <Button
            onClick={props.sendTransaction}
            layout="primary"
            type="submit"
            disabled={!props.readyToInvest}
          >
            <FormattedMessage id="investment-flow.invest-now" />
          </Button>
        </Row>
      </Container>
    </>
  );
});

export const InvestmentSelection: React.SFC = compose<any>(
  injectIntlHelpers,
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const i = state.investmentFlow;
      const eto = selectEtoById(state.publicEtos, i.etoId);
      const eur = selectEurValueUlps(i);
      return {
        etherPriceEur: selectEtherPriceEur(state.tokenPrice),
        euroValue: eur,
        ethValue: selectEthValueUlps(i),
        errorState: selectErrorState(i),
        gasCostEth: selectInvestmentGasCostEth(state.investmentFlow),
        investmentType: selectInvestmentType(i),
        wallets: createWallets(state),
        neuReward: selectNeuRewardUlpsByEtoId(state.publicEtos, i.etoId),
        equityTokenCount: selectEquityTokenCountByEtoId(state.publicEtos, i.etoId),
        showTokens: !!(eur && i.isValidatedInput),
        minTicketEur: (eto && eto.minTicketEur) || 0,
        readyToInvest: selectReadyToInvest(state.investmentFlow),
      };
    },
    dispatchToProps: dispatch => ({
      sendTransaction: () => dispatch(actions.investmentFlow.generateInvestmentTx()),
      changeEthValue: evt =>
        dispatch(
          actions.investmentFlow.submitCurrencyValue(evt.target.value, EInvestmentCurrency.Ether),
        ),
      changeEuroValue: evt =>
        dispatch(
          actions.investmentFlow.submitCurrencyValue(evt.target.value, EInvestmentCurrency.Euro),
        ),
      changeInvestmentType: (type: EInvestmentType) =>
        dispatch(actions.investmentFlow.selectInvestmentType(type)),
    }),
  }),
)(InvestmentSelectionComponent);
