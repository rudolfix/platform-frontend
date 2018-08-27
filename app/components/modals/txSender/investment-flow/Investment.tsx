import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";

import { actions } from "../../../../modules/actions";
import { EInvestmentType } from "../../../../modules/investmentFlow/reducer";
import { ITxData } from "../../../../modules/tx/sender/reducer";
import { appConnect } from "../../../../store";
import { addBigNumbers, divideBigNumbers, multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { InfoAlert } from "../../../shared/Alerts";
import { Button } from "../../../shared/Buttons";
import { FormFieldRaw } from "../../../shared/forms/formField/FormFieldRaw";
import { Heading } from "../../../shared/modals/Heading";
import { Money } from "../../../shared/Money";
import { InvestmentTypeSelector, IWalletSelectionData } from "./InvestmentTypeSelector";

import * as ethIcon from "../../../../assets/img/eth_icon2.svg";
import * as euroIcon from "../../../../assets/img/euro_icon.svg";
import * as neuroIcon from "../../../../assets/img/neuro_icon.svg";
import * as styles from "./Investment.module.scss";


interface IOwnProps {
  onAccept: (tx: Partial<ITxData>) => any;
}

interface IStateProps {
  wallets: IWalletSelectionData[];
  euroValue: string;
  etherPriceEur: string;
  investmentType: EInvestmentType;
  gasPrice: string;
  errorState?: string;
}

interface IDispatchProps {
  getTransaction: () => void;
  setEuroValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  setEthValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  setInvestmentType: (type: EInvestmentType) => void
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

export const InvestmentSelectionComponent = injectIntlHelpers(
  (props: IProps & IIntlProps) => {
    const {gasPrice, euroValue, etherPriceEur} = props
    const ethValue = divideBigNumbers(euroValue, etherPriceEur)
    const gasCostEuro = multiplyBigNumbers([gasPrice, etherPriceEur])
    const totalCostEth = addBigNumbers([gasPrice, ethValue])
    const totalCostEur = addBigNumbers([gasCostEuro, euroValue])

    return (
      <>
        <Container className={styles.container}>
          <Row>
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
              <FormFieldRaw prefix="€" value={euroValue}/>
            </Col>
            <Col sm="1">
              <div className={styles.equals}>≈</div>
            </Col>
            <Col>
              <FormFieldRaw prefix="ETH" value={ethValue} onChange={props.setEthValue}/>
              <a className={styles.investAll} href="#" onClick={el => el.preventDefault()}>
                <FormattedMessage id="investment-flow.invest-entire-balance" />
              </a>
            </Col>
          </Row>
        </Container>
        <div className={styles.green}>
          <Container className={styles.container}>
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
        <Container className={styles.container}>
          <Row>
            <Col className={styles.summary}>
              <div>
                + <FormattedMessage id="investment-flow.estimated-gas-cost" />
                : <Money value={gasCostEuro} currency="eur" theme="t-orange"/>
                <span> ≈ </span>
                <Money value={gasPrice} currency="eth" theme="t-orange" />
              </div>
              <div>
                <FormattedMessage id="investment-flow.total" />
                : <Money value={totalCostEur} currency="eur" theme="t-orange"/>
                <span> ≈ </span>
                <Money value={totalCostEth} currency="eth" theme="t-orange" />
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Button layout="primary" className="mr-4" type="submit">
              <FormattedMessage id="investment-flow.invest-now" />
            </Button>
          </Row>
        </Container>
      </>
    );
  },
);


const dummyWallets = [
  {
    balanceEth: "30000000000000000000",
    type: EInvestmentType.ICBMEth,
    name: "ICBM Wallet",
    icon: ethIcon
  },
  {
    balanceNEuro: "45600000000000000000",
    balanceEur: "45600000000000000000",
    type: EInvestmentType.ICBMnEuro,
    name: "ICBM Wallet",
    icon: neuroIcon
  },
  {
    balanceEth: "50000000000000000000",
    balanceEur: "45600000000000000000",
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

export const InvestmentSelection = appConnect<IStateProps, IDispatchProps, IOwnProps>({
  stateToProps: state => ({
    euroValue: state.investmentFlow.euroValue,
    errorState: state.investmentFlow.errorState,
    etherPriceEur: state.tokenPrice.tokenPriceData!.etherPriceEur,
    gasPrice: state.gas.gasPrice!.standard,
    investmentType: state.investmentFlow.investmentType,
    wallets: dummyWallets
  }),
  dispatchToProps: dispatch => ({
    getTransaction: () => {},
    setEthValue: (evt) => dispatch(actions.investmentFlow.setEthValue(evt.target.value)),
    setEuroValue: (evt) => dispatch(actions.investmentFlow.setEuroValue(evt.target.value)),
    setInvestmentType: (type: EInvestmentType) => dispatch(actions.investmentFlow.selectInvestmentType(type))
  }),
})(InvestmentSelectionComponent)
