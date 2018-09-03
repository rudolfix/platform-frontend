import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";

import { GasModelShape } from "../../../../lib/api/GasApi";
import { actions } from "../../../../modules/actions";
import { EInvestmentErrorState, EInvestmentType, ICalculatedContribution } from "../../../../modules/investmentFlow/reducer";
import { appConnect, IAppState } from "../../../../store";
import { addBigNumbers, divideBigNumbers, multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { InfoAlert } from "../../../shared/Alerts";
import { Button } from "../../../shared/Buttons";
import { FormFieldRaw } from "../../../shared/forms/formField/FormFieldRaw";
import { Heading } from "../../../shared/modals/Heading";
import { InvestmentTypeSelector, IWalletSelectionData } from "./InvestmentTypeSelector";

import { compose } from "redux";
import * as ethIcon from "../../../../assets/img/eth_icon2.svg";
import * as euroIcon from "../../../../assets/img/euro_icon.svg";
import * as neuroIcon from "../../../../assets/img/neuro_icon.svg";
import { MONEY_DECIMALS } from "../../../../config/constants";
import { selectICBMLockedEtherBalance, selectICBMLockedEtherBalanceEuroAmount, selectICBMLockedEuroTokenBalance, selectLiquidEtherBalance, selectLiquidEtherBalanceEuroAmount } from "../../../../modules/wallet/selectors";
import { formatMoney, formatThousands } from "../../../../utils/Money.utils";
import * as styles from "./Investment.module.scss";


interface IStateProps {
  wallets: IWalletSelectionData[];
  euroValue: string;
  etherPriceEur: string;
  investmentType: EInvestmentType;
  gasPrice?: GasModelShape;
  errorState?: string;
  calculatedContribution?: ICalculatedContribution
  minTicketEur: number
}

interface IDispatchProps {
  getTransaction: () => void;
  changeEuroValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  changeEthValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  changeInvestmentType: (type: EInvestmentType) => void
}

type IProps = IStateProps & IDispatchProps & IIntlProps;

function createWallets (state: IAppState): IWalletSelectionData[] {
  const w = state.wallet
  return [
    {
      balanceEth: selectICBMLockedEtherBalance(w),
      balanceEur: selectICBMLockedEtherBalanceEuroAmount(state),
      type: EInvestmentType.ICBMEth,
      name: "ICBM Wallet",
      icon: ethIcon
    },
    {
      balanceNEuro: selectICBMLockedEuroTokenBalance(w),
      balanceEur: selectICBMLockedEuroTokenBalance(w),
      type: EInvestmentType.ICBMnEuro,
      name: "ICBM Wallet",
      icon: neuroIcon
    },
    {
      balanceEth: selectLiquidEtherBalance(w),
      balanceEur: selectLiquidEtherBalanceEuroAmount(state),
      type: EInvestmentType.InvestmentWallet,
      name: "Investment Wallet",
      icon: ethIcon
    },
    {
      type: EInvestmentType.BankTransfer,
      name: "Direct Bank Transfer",
      icon: euroIcon
    },
  ];
}

function getInvestmentTypeMessages (type: EInvestmentType): React.ReactNode {
  switch (type) {
    case EInvestmentType.ICBMEth:
    case EInvestmentType.ICBMnEuro:
      return <FormattedHTMLMessage id="investment-flow.icbm-wallet-info-message" tagName="p"/>
    case EInvestmentType.BankTransfer:
      return <FormattedHTMLMessage id="investment-flow.bank-transfer-info-message" tagName="p"/>
  }
}

function formatEur(val? : string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 0)
}

function formatEth(val? : string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 4)
}

export const InvestmentSelectionComponent = injectIntlHelpers(
  (props: IProps & IIntlProps) => {
    const {euroValue, etherPriceEur, minTicketEur, intl} = props
    const gasPrice = (props.gasPrice && props.gasPrice.standard) || "0"
    const ethValue = euroValue && divideBigNumbers(euroValue, etherPriceEur)
    const gasCostEuro = multiplyBigNumbers([gasPrice, etherPriceEur])
    const totalCostEth = addBigNumbers([gasPrice, ethValue || "0"])
    const totalCostEur = addBigNumbers([gasCostEuro, euroValue || "0"])
    const cc = props.calculatedContribution
    const minTicketEth = divideBigNumbers(minTicketEur, etherPriceEur)

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
            <InvestmentTypeSelector wallets={props.wallets} currentType={props.investmentType} onSelect={props.changeInvestmentType} />
            <Col>
              {getInvestmentTypeMessages(props.investmentType)}
              {props.errorState === EInvestmentErrorState.NoWalletSelected && (
                <p><FormattedMessage id="investment-flow.no-selected-wallet-warning" /></p>
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
              <p><FormattedMessage id="investment-flow.amount-to-invest" /></p>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormFieldRaw prefix="€" placeholder={`${intl.formatIntlMessage("investment-flow.min-ticket-size")} ${minTicketEur} €`} controlCursor value={formatEur(euroValue)} onChange={props.changeEuroValue}/>
            </Col>
            <Col sm="1">
              <div className={styles.equals}>≈</div>
            </Col>
            <Col>
              <FormFieldRaw prefix="ETH" placeholder={`${intl.formatIntlMessage("investment-flow.min-ticket-size")} ${formatMoney(minTicketEth, 0, 4)} ETH`} controlCursor value={formatEth(ethValue)} onChange={props.changeEthValue}/>
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
                  <InfoAlert>{cc && formatThousands(cc.equityTokenInt.toString()) || "\xA0" /* non breaking space*/ }</InfoAlert>
                </FormGroup>
              </Col>
              <Col sm="1">
              </Col>
              <Col>
                <FormGroup>
                  <Label>
                    <FormattedMessage id="investment-flow.estimated-neu-tokens" />
                  </Label>
                  <InfoAlert>{cc && formatThousands(formatEth(cc.neuRewardUlps)) || "\xA0"}</InfoAlert>
                </FormGroup>
              </Col>
            </Row>
          </Container>
        </div>
        <Container className={styles.container} fluid>
          <Row>
            <Col className={styles.summary}>
              <div>
                + <FormattedMessage id="investment-flow.estimated-gas-cost" />
                : <span className="orange">{formatEur(gasCostEuro)} € ≈ ETH {formatEth(gasPrice)}</span>
              </div>
              <div>
                <FormattedMessage id="investment-flow.total" />
                : <span className="orange">{formatThousands(formatEur(totalCostEur))} € ≈ ETH {formatThousands(formatEth(totalCostEth))}</span>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center mb-0">
            <Button layout="primary" type="submit">
              <FormattedMessage id="investment-flow.invest-now" />
            </Button>
          </Row>
        </Container>
      </>
    );
  },
);

export const InvestmentSelection: React.SFC = compose<any>(
  injectIntlHelpers,
  appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => {
    const etherPriceEur = state.tokenPrice.tokenPriceData!.etherPriceEur
    return ({
      etherPriceEur,
      euroValue: state.investmentFlow.euroValueUlps,
      errorState: state.investmentFlow.errorState,
      gasPrice: state.gas.gasPrice,
      investmentType: state.investmentFlow.investmentType,
      wallets: createWallets(state),
      calculatedContribution: state.investmentFlow.calculatedContribution,
      minTicketEur: (state.investmentFlow.eto && state.investmentFlow.eto.minTicketEur!) || 0
    })
  },
  dispatchToProps: dispatch => ({
    getTransaction: () => { },
    changeEthValue: (evt) => dispatch(actions.investmentFlow.submitEthValue(evt.target.value)),
    changeEuroValue: (evt) => dispatch(actions.investmentFlow.submitEuroValue(evt.target.value)),
    changeInvestmentType: (type: EInvestmentType) => dispatch(actions.investmentFlow.selectInvestmentType(type))
  })
}))(InvestmentSelectionComponent)
