import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, Row } from "reactstrap";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { Button } from "../../../shared/Buttons";
import { DocumentLink } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps, ITxSummaryStateProps } from "../TxSender";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import * as styles from "./Summary.module.scss";

interface IStateProps extends ITxSummaryStateProps {
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

type IProps = IStateProps & ITxSummaryDispatchProps;

export const InvestmentSummaryComponent = injectIntlHelpers(
  ({ investmentData: data, agreementUrl, onAccept }: IProps & IIntlProps) => {
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
          <Button layout="primary" className="mr-4" type="button" onClick={onAccept}>
            <FormattedMessage id="investment-flow.confirm" />
          </Button>
        </Row>
      </Container>
    );
  },
);

export const InvestmentSummary = appConnect<IStateProps, ITxSummaryDispatchProps>({
  stateToProps: state => ({
    txData: state.txSender.txDetails!,
    agreementUrl: "fufu",
    investmentData: {} as any,
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  })
})(InvestmentSummaryComponent)
