import { Form, FormikProps } from 'formik'
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { InfoAlert } from "../../shared/Alerts";
import { Button } from "../../shared/Buttons";
import { FormField } from "../../shared/forms/forms";
import { Money } from "../../shared/Money";
import { WalletSelector } from './WalletSelector'


interface IFormState {
  amount: number,
  wallet: string,
}

interface IStateProps {
  wallets: Array<{
    id: string
    name: string
    balance: number
  }>
}

interface IDispatchProps {
  submit: (values: IFormState) => void;
}

type IProps = IStateProps & IDispatchProps;


export const InvestmentSelectionForm = (props: FormikProps<IFormState> & IProps) => (
  <Form>
    <h4><FormattedMessage id="investment-flow.select-wallet-and-currency" /></h4>
    <WalletSelector wallets={props.wallets} name="wallet"></WalletSelector>
    <h4><FormattedMessage id="investment-flow.invest-funds" /></h4>
    <FormField name="amount" label={
      <FormattedMessage id="investment-flow.amount-input-label" values={{ transactionCost: (<Money currency="eth" value="20000000000000000" theme="t-orange" />) }} />
    } />
    <a><FormattedMessage id="investment-flow.invest-entire-balance" /></a>
    <div>
      <strong>=</strong>
    </div>
    <label><img /> <FormattedMessage id="investment-flow.equity-tokens" /></label>
    <InfoAlert>TODO: Autoconvert from invested amount</InfoAlert>
    <label><img /> <FormattedMessage id="investment-flow.estimated-neu-tokens" /></label>
    <InfoAlert>TODO: Autoconvert from invested amount</InfoAlert>
    <Row className="justify-content-center">
      <Button
        layout="primary"
        className="mr-4"
        type="submit"
        isLoading={false}
      >
        <FormattedMessage id="investment-flow.invest"/>
      </Button>
    </Row>

  </Form>
)

