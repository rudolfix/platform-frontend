import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { actions } from "../../../../modules/actions";
import {
  selectEthValueUlps,
  selectEurValueUlps,
  selectInvestmentGasCostEth,
} from "../../../../modules/investmentFlow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectEtoById,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/public-etos/selectors";
import { selectEtherPriceEur } from "../../../../modules/shared/tokenPrice/selectors";
import { appConnect } from "../../../../store";
import {
  addBigNumbers,
  divideBigNumbers,
  multiplyBigNumbers,
} from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { formatMoney } from "../../../../utils/Money.utils";
import { Button } from "../../../shared/buttons";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps } from "../TxSender";

import * as styles from "./Summary.module.scss";
import { formatEur } from "./utils";

interface IStateProps {
  accountName: string;
  country: string;
  recipient: string;
  iban: string;
  bic: string;
  referenceCode: string
  amount: string
}

type IProps = IStateProps & ITxSummaryDispatchProps;

const BankTransferDetailsComponent = injectIntlHelpers(
  ({ onAccept, ...data}: IProps & IIntlProps) => {

    return (
      <Container className={styles.container}>
        <Row className="mt-0">
          <Col>
            <Heading>
              <FormattedMessage id="investment-flow.bank-transfer.direct-bank-transfer" />
            </Heading>
          </Col>
        </Row>

        <Row>
          <Col>
            <p>
              <FormattedMessage id="investment-flow.bank-transfer.general-instructions" />
            </p>
            <FormattedHTMLMessage tagName="p" id="investment-flow.bank-transfer.bank-details-instructions" />
          </Col>
        </Row>

        <Row>
          <Col>
            <Heading>
              <FormattedMessage id="investment-flow.bank-transfer.from-account" />
            </Heading>
          </Col>
        </Row>

        <Row>
          <Col>
            <InfoList>
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.account-name" />}
                value={data.accountName}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.country" />}
                value={data.country}
              />
            </InfoList>
          </Col>
        </Row>

        <Row>
          <Col>
            <Heading>
              <FormattedMessage id="investment-flow.bank-transfer.to-account" />
            </Heading>
          </Col>
        </Row>

        <Row>
          <Col>
            <InfoList>
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.recipient" />}
                value={data.recipient}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.iban" />}
                value={data.iban}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.bic" />}
                value={data.bic}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.reference-code" />}
                value={data.referenceCode}
              />
              <InfoRow
                caption={<FormattedMessage id="investment-flow.bank-transfer.amount" />}
                value={`€ ${formatEur(data.amount)}`}
              />
            </InfoList>
          </Col>
        </Row>

        <Row className="justify-content-center mb-0 mt-0">
          <Button layout="primary" type="button" onClick={onAccept}>
            <FormattedMessage id="investment-flow.confirm" />
          </Button>
        </Row>
      </Container>
    );
  },
);

const BankTransferDetails = appConnect<IStateProps, ITxSummaryDispatchProps>({
  stateToProps: state => {
    return {
      accountName: "fufu name",
      country: "lala land",
      recipient: "kuku company",
      iban: "foo iban asdf",
      bic: "bar bic",
      referenceCode: "asdfölk",
      amount: "123456781234567812345678"
    };
  },
  dispatchToProps: d => ({
    onAccept: () => d(actions.investmentFlow.showBankTransferSummary()),
  }),
})(BankTransferDetailsComponent);

export {BankTransferDetailsComponent, BankTransferDetails}
