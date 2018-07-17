import * as cn from 'classnames'
import { Form, FormikProps } from 'formik'
import * as React from "react";
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, FormGroup, Label, ListGroup, ListGroupItem, Row } from "reactstrap";
import * as neuIcon from "../../../assets/img/neu_icon.svg"
import * as tokenIcon from "../../../assets/img/token_icon.svg"
import { InfoAlert } from "../../shared/Alerts";
import { Button } from "../../shared/Buttons";
import { FormFieldImportant } from "../../shared/forms/formField/FormFieldImportant";
import { Heading } from "../../shared/modals/Heading";
import { Money } from "../../shared/Money";
import * as styles from './Summary.module.scss'
import { WalletSelector } from './WalletSelector'


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
  return (
    <section>
      <Heading><FormattedMessage id="investment-flow.investment-summary" /></Heading>

      <ListGroup className={styles.infoTable}>
        <InfoRow translation={<FormattedMessage id="investment-flow.summary.company" />} value={data.companyName} />
        <InfoRow translation={<FormattedMessage id="investment-flow.summary.token-price" />} value={data.tokenPrice} />
        <InfoRow translation={<FormattedMessage id="investment-flow.summary.eto-address" />} value={data.etoAddress} />
        <InfoRow translation={<FormattedMessage id="investment-flow.summary.your-investment" />} value={data.investment} />
        <InfoRow translation={<FormattedMessage id="investment-flow.summary.transaction-cost" />} value={data.transactionCost} />
        <InfoRow translation={<FormattedMessage id="investment-flow.summary.equity-tokens" />} value={data.equityTokens} />
        <InfoRow translation={<FormattedMessage id="investment-flow.summary.estimated-reward" />} value={data.estimatedReward} />
        <InfoRow translation={<FormattedMessage id="investment-flow.summary.transaction-value" />} value={data.transactionValue} />
      </ListGroup>

      <Row className="justify-content-center">
        <Button
          layout="primary"
          className="mr-4"
          type="submit"
        >
          <FormattedMessage id="investment-flow.invest" />
        </Button>
      </Row>
    </section>
  )
})

