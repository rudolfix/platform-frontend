import { Form, FormikProps } from 'formik'
import * as React from "react";
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, FormGroup, Label, Row } from "reactstrap";
import * as neuIcon from "../../../assets/img/neu_icon.svg"
import * as tokenIcon from "../../../assets/img/token_icon.svg"
import { InfoAlert } from "../../shared/Alerts";
import { Button } from "../../shared/Buttons";
import { FormFieldImportant } from "../../shared/forms/formField/FormFieldImportant";
import { Money } from "../../shared/Money";
import * as styles from './Investment.module.scss'
import { WalletSelector } from './WalletSelector'


interface IStateProps {
  investmentData: {
    companyName: string
    tokenProce: string
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


export const InvestmentSummary = injectIntl(({investmentData: data}: IProps & InjectedIntlProps) => {
  return (
    <section>
      <h4 className={styles.header}><FormattedMessage id="investment-flow.select-wallet-and-currency" /></h4>
      <section>
        <div></div>
      </section>
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
) })

