import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";

import { GasModelShape } from "../../../../lib/api/GasApi";
import { actions } from "../../../../modules/actions";
import { EInvestmentType } from "../../../../modules/investmentFlow/reducer";
import { ITxData } from "../../../../modules/tx/sender/reducer";
import { appConnect, IAppState } from "../../../../store";
import { addBigNumbers, divideBigNumbers, multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { InfoAlert } from "../../../shared/Alerts";
import { Button } from "../../../shared/Buttons";
import { FormFieldRaw } from "../../../shared/forms/formField/FormFieldRaw";
import { Heading } from "../../../shared/modals/Heading";
import { InvestmentTypeSelector, IWalletSelectionData } from "./InvestmentTypeSelector";

import * as ethIcon from "../../../../assets/img/eth_icon2.svg";
import * as euroIcon from "../../../../assets/img/euro_icon.svg";
import * as neuroIcon from "../../../../assets/img/neuro_icon.svg";
import { MONEY_DECIMALS } from "../../../../config/constants";
import { selectICBMLockedEtherBalance, selectICBMLockedEtherBalanceEuroAmount, selectICBMLockedEuroTokenBalance, selectLiquidEtherBalance, selectLiquidEtherBalanceEuroAmount } from "../../../../modules/wallet/selectors";
import { formatMoney } from "../../../../utils/Money.utils";
import * as styles from "./Investment.module.scss";


interface IOwnProps {
  onAccept: (tx: Partial<ITxData>) => any;
}

interface IStateProps {
  wallets: IWalletSelectionData[];
  euroValue: string;
  etherPriceEur: string;
  investmentType: EInvestmentType;
  gasPrice?: GasModelShape;
  errorState?: string;
}

interface IDispatchProps {
  getTransaction: () => void;
  setEuroValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  setEthValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  setInvestmentType: (type: EInvestmentType) => void
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

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

function formatEur(val? : string): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 0)
}

function formatEth(val? : string): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 4)
}

export const InvestmentSelectionComponent = injectIntlHelpers(
  (props: IProps & IIntlProps) => {
    const {euroValue, etherPriceEur} = props
    const gasPrice = (props.gasPrice && props.gasPrice.standard) || "0"
    const ethValue = euroValue && divideBigNumbers(euroValue, etherPriceEur)
    const gasCostEuro = multiplyBigNumbers([gasPrice, etherPriceEur])
    const totalCostEth = addBigNumbers([gasPrice, ethValue || "0"])
    const totalCostEur = addBigNumbers([gasCostEuro, euroValue || "0"])

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
          <InvestmentTypeSelector wallets={props.wallets} currentType={props.investmentType} onSelect={props.setInvestmentType} />
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
              <FormFieldRaw prefix="€" controlCursor value={formatEur(euroValue)} onChange={props.setEuroValue}/>
            </Col>
            <Col sm="1">
              <div className={styles.equals}>≈</div>
            </Col>
            <Col>
              <FormFieldRaw prefix="ETH" controlCursor value={formatEth(ethValue)} onChange={props.setEthValue}/>
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
                  <InfoAlert>TODO: Autoconvert from invested amount</InfoAlert>
                </FormGroup>
              </Col>
              <Col sm="1">
              </Col>
              <Col>
                <FormGroup>
                  <Label>
                    <FormattedMessage id="investment-flow.estimated-neu-tokens" />
                  </Label>
                  <InfoAlert>TODO: Autoconvert from invested amount</InfoAlert>
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
                : <span className="orange">{formatEur(gasCostEuro)}€ ≈ ETH {formatEth(gasPrice)}</span>
              </div>
              <div>
                <FormattedMessage id="investment-flow.total" />
                : <span className="orange">{formatEur(totalCostEur)}€ ≈ ETH {formatEth(totalCostEth)}</span>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center mb-0">
            <Button layout="primary" className="mr-4" type="submit">
              <FormattedMessage id="investment-flow.invest-now" />
            </Button>
          </Row>
        </Container>
      </>
    );
  },
);

export const InvestmentSelection = appConnect<IStateProps, IDispatchProps, IOwnProps>({
  stateToProps: state => {
    const etherPriceEur = state.tokenPrice.tokenPriceData!.etherPriceEur
    return ({
      etherPriceEur,
      euroValue: state.investmentFlow.euroValue,
      errorState: state.investmentFlow.errorState,
      gasPrice: state.gas.gasPrice,
      investmentType: state.investmentFlow.investmentType,
      wallets: createWallets(state)
    })
  },
  dispatchToProps: dispatch => ({
    getTransaction: () => { },
    setEthValue: (evt) => dispatch(actions.investmentFlow.setEthValue(evt.target.value)),
    setEuroValue: (evt) => dispatch(actions.investmentFlow.setEuroValue(evt.target.value)),
    setInvestmentType: (type: EInvestmentType) => dispatch(actions.investmentFlow.selectInvestmentType(type))
  })
})(InvestmentSelectionComponent)
