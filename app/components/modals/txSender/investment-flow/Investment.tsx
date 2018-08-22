import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";

import { EInvestmentType } from "../../../../modules/investmentFlowModal/reducer";
import { ITxData } from "../../../../modules/tx/sender/reducer";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { InfoAlert } from "../../../shared/Alerts";
import { Button } from "../../../shared/Buttons";
import { Heading } from "../../../shared/modals/Heading";
import { Money } from "../../../shared/Money";
import { InvestmentTypeSelector, IWalletSelectionData } from "./InvestmentTypeSelector";

import { appConnect } from "../../../../store";
import { multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { FormFieldRaw } from "../../../shared/forms/formField/FormFieldRaw";
import * as styles from "./Investment.module.scss";

interface IOwnProps {
  onAccept: (tx: Partial<ITxData>) => any;
}

interface IStateProps {
  wallets: IWalletSelectionData[];
  euroValue: string;
  etherPriceEur: number;
  errorState: string;
  investmentType: EInvestmentType;
  gasCostEth: string;
}

interface IDispatchProps {
  getTransaction: () => void;
  setEuroValue: (eth: string) => void;
  setEthValue: (eur: string) => void;
  setInvestmentType: (type: EInvestmentType) => void
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

export const InvestmentSelectionComponent = injectIntlHelpers(
  (props: IProps & IIntlProps) => {
    const {gasCostEth} = props
    const gasCostEuro = multiplyBigNumbers([gasCostEth, props.etherPriceEur.toString()])
    const totalCostEth = "1000000"
    const totalCostEur = "100000000"

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
              <FormFieldRaw />
            </Col>
            <Col sm="1">
              <div className={styles.equals}>≈</div>
            </Col>
            <Col>
              <FormFieldRaw />
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
                <Money value={gasCostEuro} currency="eur" theme="t-orange"/>
                <span>≈</span>
                <Money value={gasCostEth} currency="eth" theme="t-orange" />
              </div>
              <div>
                <FormattedMessage id="investment-flow.total" />
                <Money value={totalCostEur} currency="eur" theme="t-orange"/>
                <span>≈</span>
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


export const InvestmentSelection = appConnect<IStateProps, IDispatchProps, IOwnProps>({})(InvestmentSelectionComponent)
