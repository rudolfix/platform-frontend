import { Form, FormikProps } from "formik";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, ListGroup, Row } from "reactstrap";

import { Button } from "../../../shared/Buttons";
import { DocumentLink } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoRow } from "../shared/InfoRow";
import { InfoList } from "../shared/InfoList";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import * as styles from "./Summary.module.scss";

interface IStateProps {
  investmentData: {
    companyName: string;
    tokenPrice: string;
    etoAddress: string;
    investment: string;
    transactionCost: string;
    equityTokens: number;
    estimatedReward: number;
    transactionValue: number;
  };
  agreementUrl: string;
}

interface IDispatchProps {
  submit: () => void;
}

type IProps = IStateProps & IDispatchProps;

export const InvestmentSummary = injectIntl(
  ({ investmentData: data, agreementUrl }: IProps & InjectedIntlProps) => {
    const equityTokens = (
      <span>
        <img src={tokenIcon} /> {data.equityTokens}
      </span>
    );
    const estimatedReward = (
      <span>
        <img src={neuIcon} /> {data.estimatedReward}
      </span>
    );
    return (
      <Container className={styles.container}>
        <Row>
          <Heading>
            <FormattedMessage id="investment-flow.investment-summary" />
          </Heading>
        </Row>

        <Row>
          <InfoList>
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.company" />}
              value={data.companyName}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.token-price" />}
              value={data.tokenPrice}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.eto-address" />}
              value={data.etoAddress}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.your-investment" />}
              value={data.investment}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.transaction-cost" />}
              value={data.transactionCost}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.equity-tokens" />}
              value={equityTokens}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.estimated-reward" />}
              value={estimatedReward}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.transaction-value" />}
              value={data.transactionValue}
            />
          </InfoList>
        </Row>

        <Row className="justify-content-center">
          <DocumentLink
            url={agreementUrl}
            name={<FormattedMessage id="investment-flow.summary.download-agreement" />}
          />
        </Row>

        <Row className="justify-content-center">
          <Button layout="primary" className="mr-4" type="submit">
            <FormattedMessage id="investment-flow.confirm" />
          </Button>
        </Row>
      </Container>
    );
  },
);
