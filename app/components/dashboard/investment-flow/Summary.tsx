import { Form, FormikProps } from 'formik'
import * as React from "react";
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, ListGroup, ListGroupItem, Row } from "reactstrap";
import * as neuIcon from "../../../assets/img/neu_icon.svg"
import * as tokenIcon from "../../../assets/img/token_icon.svg"
import { Button } from "../../shared/Buttons";
import { Document } from "../../shared/Document";
import { Heading } from "../../shared/modals/Heading";
import * as styles from './Summary.module.scss'


interface IStateProps {
  investmentData: {
    companyName: string
    tokenPrice: string
    etoAddress: string
    investment: string
    transactionCost: string
    equityTokens: number
    estimatedReward: number
    transactionValue: number
  }
}

interface IDispatchProps {
  submit: () => void;
}

type IProps = IStateProps & IDispatchProps;

interface IInfoRowProps {
  translation: React.ReactNode
  value: string | React.ReactNode
}

export const InfoRow: React.SFC<IInfoRowProps> = ({ translation, value }) => (
  <ListGroupItem className={styles.infoRow}>
    <div className={styles.infoCell}>{translation}</div>
    <div className={styles.infoCell}>{value}</div>
  </ListGroupItem>
)

export const InvestmentSummary = injectIntl(({ investmentData: data }: IProps & InjectedIntlProps) => {
  const equityTokens = (<span><img src={tokenIcon} /> {data.equityTokens}</span>)
  const estimatedReward = (<span><img src={neuIcon} /> {data.estimatedReward}</span>)
  return (
    <Container className={styles.container}>
      <Row >
        <Heading><FormattedMessage id="investment-flow.investment-summary" /></Heading>
      </Row>

      <Row>
        <ListGroup className={styles.infoTable}>
          <InfoRow translation={<FormattedMessage id="investment-flow.summary.company" />} value={data.companyName} />
          <InfoRow translation={<FormattedMessage id="investment-flow.summary.token-price" />} value={data.tokenPrice} />
          <InfoRow translation={<FormattedMessage id="investment-flow.summary.eto-address" />} value={data.etoAddress} />
          <InfoRow translation={<FormattedMessage id="investment-flow.summary.your-investment" />} value={data.investment} />
          <InfoRow translation={<FormattedMessage id="investment-flow.summary.transaction-cost" />} value={data.transactionCost} />
          <InfoRow translation={<FormattedMessage id="investment-flow.summary.equity-tokens" />} value={equityTokens} />
          <InfoRow translation={<FormattedMessage id="investment-flow.summary.estimated-reward" />} value={estimatedReward} />
          <InfoRow translation={<FormattedMessage id="investment-flow.summary.transaction-value" />} value={data.transactionValue} />
        </ListGroup>
      </Row>

      <Row className="justify-content-center">
        <a className={styles.downloadLink} href="" target="_blank"><Document extension="pdf" /><FormattedMessage id="investment-flow.summary.download-agreement" /></a>
      </Row>

      <Row className="justify-content-center">
        <Button
          layout="primary"
          className="mr-4"
          type="submit"
        >
          <FormattedMessage id="investment-flow.confirm" />
        </Button>
      </Row>
    </Container>
  )
})

